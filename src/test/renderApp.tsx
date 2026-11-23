import { render } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { AppProviders } from "../app/providers/AppProviders";
import { routes } from "../app/router";

/** Renderiza a aplicação inteira (providers + rotas) em uma URL de teste. */
export function renderApp(path = "/") {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  return render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  );
}
