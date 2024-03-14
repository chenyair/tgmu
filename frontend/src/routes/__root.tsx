import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { AuthContext } from '@/helpers/auth.context';
import { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import '../main.scss';

interface MyRouterContext {
  auth: AuthContext;
  queryClient: QueryClient;
}
export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <div className="root-route">
      <Outlet />
      {(() => {
        if (import.meta.env.PROD)
          return (
            <>
              <TanStackRouterDevtools position="bottom-right" />
              <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-right" />
            </>
          );
      })()}
    </div>
  ),
});
