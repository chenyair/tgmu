import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { AuthContext } from '@/helpers/auth.context';

interface MyRouterContext {
  auth: AuthContext;
}
export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <div className="vh-100 vw-100">
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  ),
});
