import { createFileRoute } from '@tanstack/react-router';
import ExperiencesPage from '@/pages/experiences';

export const Route = createFileRoute('/_authenticated/experiences')({
  component: ExperiencesPage,
});
