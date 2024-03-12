import React from 'react';
import ReactDOM from 'react-dom/client';
import './main.scss';
import 'bootstrap/dist/css/bootstrap.css';

import { routeTree } from './routeTree.gen.ts';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { AuthProvider, useAuth } from './helpers/auth.context.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  defaultPreloadStaleTime: 0,
  defaultPreload: 'intent',
  context: {
    auth: undefined!,
    queryClient,
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const App: React.FC = () => {
  const auth = useAuth();
  return auth.refreshTokenStatus === 'pending' ? (
    <div>Refreshing token</div> // TODO: Implement loader
  ) : (
    <RouterProvider router={router} context={{ auth }} />
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <GoogleOAuthProvider clientId="860638363058-5iqacpso2vp44fib6o8tq7opdmkk1e7q.apps.googleusercontent.com">
      <AuthProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </AuthProvider>
    </GoogleOAuthProvider>
  </QueryClientProvider>
);
