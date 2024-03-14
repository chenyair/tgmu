import { createFileRoute } from '@tanstack/react-router';
import NewExperienceDialog from '@/pages/experiences/experience-dialog/new-experience';

export const Route = createFileRoute('/_authenticated/experiences/new')({
  component: NewExperienceDialog,
});
