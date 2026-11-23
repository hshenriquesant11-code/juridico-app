import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { getPageTitle, navItems } from "../../app/navigation";
import { Icon } from "../ui/Icon";
import { DemoBanner } from "../ui/DemoBanner";

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="app-shell">
      {menuOpen && (
        <button
          className="mobile-scrim"
          aria-label="Fechar menu"
          onClick={closeMenu}
        />
      )}
      <aside
        id="sidebar"
        className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}
      >
        <div className="brand-row">
          <div className="brand-mark">
            <span />
          </div>
          <span className="brand-name">
            clara<span className="brand-period">.</span>
          </span>
          <button
            className="mobile-close icon-button"
            aria-label="Fechar menu"
            onClick={closeMenu}
          >
            <Icon name="close" />
          </button>
        </div>
        <button className="workspace-switch">
          <span className="workspace-avatar">VA</span>
          <span className="workspace-copy">
            <strong>Vieira Advocacia</strong>
            <small>Plano gratuito</small>
          </span>
          <span className="workspace-chevron">
            <Icon name="chevron" size={15} />
          </span>
        </button>
        <div className="side-label">MENU PRINCIPAL</div>
        <nav className="nav-list" aria-label="Navegação principal">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `nav-item ${isActive ? "nav-item-active" : ""}`
              }
              onClick={closeMenu}
            >
              <Icon name={item.icon} size={19} />
              <span>{item.label}</span>
              {item.label === "Tarefas" && <span className="nav-count">4</span>}
            </NavLink>
          ))}
        </nav>
        <div className="side-spacer" />
        <div className="help-card">
          <div className="help-spark">✳</div>
          <strong>Precisa de ajuda?</strong>
          <p>Estamos por aqui para facilitar sua rotina.</p>
          <button
            onClick={() => {
              closeMenu();
              navigate("/ajuda");
            }}
          >
            Acessar suporte <Icon name="arrow" size={14} />
          </button>
        </div>
        <NavLink
          to="/configuracoes"
          className={({ isActive }) =>
            `nav-item settings-link ${isActive ? "nav-item-active" : ""}`
          }
          onClick={closeMenu}
        >
          <Icon name="settings" size={19} />
          <span>Configurações</span>
        </NavLink>
        <div className="profile-row">
          <div className="profile-avatar">AL</div>
          <div className="profile-copy">
            <strong>Ana Luiza</strong>
            <small>Administradora</small>
          </div>
          <button
            className="icon-button profile-more"
            aria-label="Opções de perfil"
          >
            <Icon name="dots" />
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button
            className="mobile-menu icon-button"
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            aria-controls="sidebar"
            onClick={() => setMenuOpen(true)}
          >
            <Icon name="menu" />
          </button>
          <div className="breadcrumb">
            <span>Workspace</span>
            <Icon name="chevron" size={14} />
            <strong>{getPageTitle(pathname)}</strong>
          </div>
          <div className="top-actions">
            {searchOpen && (
              <input
                className="quick-search"
                autoFocus
                placeholder="Buscar..."
                aria-label="Buscar"
                onKeyDown={(event) => {
                  if (event.key === "Escape") setSearchOpen(false);
                }}
              />
            )}
            <button
              className="icon-button search-button"
              aria-label="Buscar"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Icon name="search" />
            </button>
            <button
              className="icon-button notification-button"
              aria-label="Notificações"
            >
              <Icon name="bell" />
              <span />
            </button>
            <div className="top-divider" />
            <button className="top-profile">
              <span className="profile-avatar small-avatar">AL</span>
              <span>Ana Luiza</span>
              <Icon name="chevron" size={14} />
            </button>
          </div>
        </header>

        <div className="page-content">
          <DemoBanner />
          <Outlet />
          <footer className="page-footer">
            <span>© 2026 Clara. Feito para cuidar do que importa.</span>
            <span>
              <span className="online-dot" /> Tudo atualizado agora
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
