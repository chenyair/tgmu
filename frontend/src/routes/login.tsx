import { createFileRoute } from '@tanstack/react-router';
import LoginPage from '../pages/login';
import { z } from 'zod';

export const Route = createFileRoute('/login')({
  validateSearch: z.object({ redirect: z.string().catch('/') }),
  component: LoginPage,
});
