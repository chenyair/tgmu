import { createFileRoute } from '@tanstack/react-router';
import EditExperienceDialog from '@/pages/experiences/experience-dialog/edit-experience';

export const Route = createFileRoute('/_authenticated/experiences/$experienceId/edit')({
  component: EditExperienceDialog,
});
