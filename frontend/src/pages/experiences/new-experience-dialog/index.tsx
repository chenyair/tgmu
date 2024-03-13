import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import TgmuDialog from '@/components/tgmu-dialog';

const NewExperienceDialog: React.FC = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate({ to: '/experiences' });
  };

  return (
    <TgmuDialog open={true} onOpenChange={handleClose} style={{ height: '50%', width: '70%' }}>
      <div></div>
    </TgmuDialog>
  );
};

export default NewExperienceDialog;
