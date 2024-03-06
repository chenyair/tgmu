import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRoute({
  component: () => (
    <div className="vh-100 vw-100">
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  ),
});
