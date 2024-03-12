import { createFileRoute } from '@tanstack/react-router';
import NewExperienceDialog from '@/pages/experiences/new-experience-dialog';

export const Route = createFileRoute('/_authenticated/experiences/new')({
  component: NewExperienceDialog,
});
