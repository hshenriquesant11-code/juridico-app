
-- ============================================================
-- SAAS-JUD | SPRINT 2
-- FOUNDATION MULTI-TENANT
-- Organizations, profiles, memberships and RLS
-- ============================================================

-- 1. Private schema for internal security functions.
CREATE SCHEMA IF NOT EXISTS private;

REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO authenticated;

-- 2. Organization roles.
CREATE TYPE public.organization_role AS ENUM (
  'owner',
  'admin',
  'lawyer',
  'collaborator'
);

-- 3. Organizations.
CREATE TABLE public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  name text NOT NULL,

  created_by uuid
    REFERENCES auth.users(id)
    ON DELETE SET NULL,

  created_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT organizations_name_length
    CHECK (
      char_length(btrim(name)) BETWEEN 2 AND 160
    )
);

-- 4. User profiles.
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY
    REFERENCES auth.users(id)
    ON DELETE CASCADE,

  full_name text,

  created_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT profiles_full_name_length
    CHECK (
      full_name IS NULL
      OR (
        btrim(full_name) <> ''
        AND char_length(full_name) <= 120
      )
    )
);

-- 5. Organization membership.
CREATE TABLE public.organization_members (
  organization_id uuid NOT NULL
    REFERENCES public.organizations(id)
    ON DELETE RESTRICT,

  user_id uuid NOT NULL
    REFERENCES auth.users(id)
    ON DELETE RESTRICT,

  role public.organization_role NOT NULL,

  created_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT organization_members_pkey
    PRIMARY KEY (organization_id, user_id)
);

CREATE INDEX organization_members_user_id_idx
  ON public.organization_members (user_id, organization_id);

-- 6. Security helper: check organization membership.
-- SECURITY DEFINER avoids recursive RLS evaluation.
CREATE OR REPLACE FUNCTION private.is_org_member(
  p_organization_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members AS m
    WHERE m.organization_id = p_organization_id
      AND m.user_id = (SELECT auth.uid())
  );
$function$;

-- 7. Security helper: check organization role.
CREATE OR REPLACE FUNCTION private.has_org_role(
  p_organization_id uuid,
  p_roles public.organization_role[]
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members AS m
    WHERE m.organization_id = p_organization_id
      AND m.user_id = (SELECT auth.uid())
      AND m.role = ANY (p_roles)
  );
$function$;

REVOKE ALL ON FUNCTION private.is_org_member(uuid)
  FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION private.has_org_role(uuid, public.organization_role[])
  FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION private.is_org_member(uuid)
  TO authenticated;

GRANT EXECUTE ON FUNCTION private.has_org_role(uuid, public.organization_role[])
  TO authenticated;

-- 8. Automatically create a profile when an Auth user is created.
CREATE OR REPLACE FUNCTION private.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_full_name text;
BEGIN
  v_full_name :=
    NULLIF(
      pg_catalog.left(
        pg_catalog.btrim(
          COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
        ),
        120
      ),
      ''
    );

  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, v_full_name)
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$function$;

REVOKE ALL ON FUNCTION private.handle_new_user()
  FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION private.handle_new_user();

-- Also create profiles for any Auth users that already exist.
INSERT INTO public.profiles (id, full_name)
SELECT
  u.id,
  NULLIF(
    pg_catalog.left(
      pg_catalog.btrim(
        COALESCE(u.raw_user_meta_data ->> 'full_name', '')
      ),
      120
    ),
    ''
  )
FROM auth.users AS u
ON CONFLICT (id) DO NOTHING;

-- 9. Controlled organization onboarding.
-- The caller can choose the name, but cannot choose the owner or role.
CREATE OR REPLACE FUNCTION public.create_organization(
  p_name text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_user_id uuid := auth.uid();
  v_name text := pg_catalog.btrim(COALESCE(p_name, ''));
  v_organization_id uuid;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required'
      USING ERRCODE = '28000';
  END IF;

  IF pg_catalog.char_length(v_name) < 2
     OR pg_catalog.char_length(v_name) > 160 THEN
    RAISE EXCEPTION 'Organization name must contain 2 to 160 characters'
      USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.organizations (name, created_by)
  VALUES (v_name, v_user_id)
  RETURNING id INTO v_organization_id;

  INSERT INTO public.organization_members (
    organization_id,
    user_id,
    role
  )
  VALUES (
    v_organization_id,
    v_user_id,
    'owner'::public.organization_role
  );

  RETURN v_organization_id;
END;
$function$;

REVOKE ALL ON FUNCTION public.create_organization(text)
  FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.create_organization(text)
  TO authenticated;

-- 10. Explicit table and type privileges.
-- RLS and SQL grants are both required.
REVOKE ALL ON TYPE public.organization_role
  FROM PUBLIC, anon, authenticated;

GRANT USAGE ON TYPE public.organization_role
  TO authenticated;

REVOKE ALL ON TABLE public.organizations
  FROM PUBLIC, anon, authenticated;

REVOKE ALL ON TABLE public.profiles
  FROM PUBLIC, anon, authenticated;

REVOKE ALL ON TABLE public.organization_members
  FROM PUBLIC, anon, authenticated;

GRANT SELECT ON TABLE public.organizations
  TO authenticated;

GRANT UPDATE (name) ON TABLE public.organizations
  TO authenticated;

GRANT SELECT ON TABLE public.profiles
  TO authenticated;

GRANT UPDATE (full_name) ON TABLE public.profiles
  TO authenticated;

GRANT SELECT ON TABLE public.organization_members
  TO authenticated;

-- 11. Enable Row Level Security.
ALTER TABLE public.organizations
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.profiles
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.organization_members
  ENABLE ROW LEVEL SECURITY;

-- 12. Profile policies: users can access only their own profile.
CREATE POLICY profiles_select_own
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = id);

CREATE POLICY profiles_update_own
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

-- 13. Organization policies: members can read their organizations.
CREATE POLICY organizations_select_members
  ON public.organizations
  FOR SELECT
  TO authenticated
  USING (private.is_org_member(id));

-- Only owners and admins can update organization names.
CREATE POLICY organizations_update_admins
  ON public.organizations
  FOR UPDATE
  TO authenticated
  USING (
    private.has_org_role(
      id,
      ARRAY['owner', 'admin']::public.organization_role[]
    )
  )
  WITH CHECK (
    private.has_org_role(
      id,
      ARRAY['owner', 'admin']::public.organization_role[]
    )
  );

-- 14. Membership policies: members can see membership rows
-- belonging to organizations they are part of.
CREATE POLICY organization_members_select_members
  ON public.organization_members
  FOR SELECT
  TO authenticated
  USING (private.is_org_member(organization_id));

-- There are deliberately no direct INSERT, UPDATE or DELETE
-- grants/policies for memberships or organizations.
-- Membership changes will be implemented through controlled
-- server-side functions in a later migration.

-- ============================================================
-- END OF FOUNDATION MIGRATION
-- ============================================================
