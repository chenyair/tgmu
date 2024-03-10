import { createFileRoute } from '@tanstack/react-router';
import RegsiterPage from '@/pages/auth/register';

export const Route = createFileRoute('/_auth/register')({
  validateSearch: z.object({ redirect: z.string().catch('/') }),
  component: RegsiterPage,
});
