import { createFileRoute } from '@tanstack/react-router';
import ExperienceCommentsDialog from '@/pages/experiences/comments';

export const Route = createFileRoute('/_authenticated/experiences/$experienceId/comments')({
  component: ExperienceCommentsDialog,
});
