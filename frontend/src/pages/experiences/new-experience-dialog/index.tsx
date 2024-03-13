import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import TgmuDialog from '@/components/tgmu-dialog';
import { useForm } from '@tanstack/react-form';
import ImageEditor from './components/image-editor';

const NewExperienceDialog: React.FC = () => {
  const navigate = useNavigate();
  const experienceForm = useForm<{ title: string; description: string; experienceImage: File | undefined }>({
    defaultValues: { title: '', description: '', experienceImage: undefined },
    onSubmit: async ({ value }) => {},
    validators: {
      onSubmit({ value }) {
        if (false) return 'test';
      },
    },
  });

  const handleClose = () => {
    navigate({ to: '/experiences' });
  };

  return (
    <TgmuDialog open={true} onOpenChange={handleClose} style={{ height: '50%', width: '70%' }}>
      <experienceForm.Provider>
        <form
          className="d-flex gap-3 h-100 flex-wrap"
          style={{ width: '100%' }}
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void experienceForm.handleSubmit();
          }}
        >
          <experienceForm.Field
            name="experienceImage"
            children={(field) => (
              <ImageEditor className="w-50" value={field.state.value} onChange={(file) => field.handleChange(file)} />
            )}
          />
        </form>
      </experienceForm.Provider>
    </TgmuDialog>
  );
};

export default NewExperienceDialog;
