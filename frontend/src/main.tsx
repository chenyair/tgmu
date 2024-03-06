import React from 'react';
import ReactDOM from 'react-dom/client';
import './main.scss';
import 'bootstrap/dist/css/bootstrap.css';

import { routeTree } from './routeTree.gen.ts';
import { createRouter, RouterProvider } from '@tanstack/react-router';

const router = createRouter({ routeTree, defaultPreloadStaleTime: 0, defaultPreload: 'intent' });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
