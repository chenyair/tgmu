import React from 'react';
import ReactDOM from 'react-dom/client';
import './main.scss';
import 'bootstrap/dist/css/bootstrap.css';

import { routeTree } from './routeTree.gen.ts';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { AuthProvider, useAuth } from './helpers/auth.context.tsx';

const router = createRouter({
  routeTree,
  defaultPreloadStaleTime: 0,
  defaultPreload: 'intent',
  context: {
    auth: undefined!,
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const App: React.FC = () => {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
