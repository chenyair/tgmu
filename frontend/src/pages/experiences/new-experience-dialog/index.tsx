import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import TgmuDialog from '@/components/tgmu-dialog';
import { useForm } from '@tanstack/react-form';
import ImageEditor from './components/image-editor';
import { Movie } from 'shared-types';
import MoviePicker from './components/movie-picker';
import './index.scss';

const NewExperienceDialog: React.FC = () => {
  const navigate = useNavigate();
  const experienceForm = useForm<{
    title: string;
    description: string;
    experienceImage: File | undefined;
    movie: Movie | undefined;
  }>({
    defaultValues: { title: '', description: '', experienceImage: undefined, movie: undefined },
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
    <TgmuDialog open={true} onOpenChange={handleClose} style={{ height: '60%', width: '70%' }}>
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
              <ImageEditor
                style={{ width: '40%' }}
                value={field.state.value}
                onChange={(file) => field.handleChange(file)}
              />
            )}
          />
          <experienceForm.Field
            name="movie"
            children={(field) => (
              <MoviePicker
                onSelect={(movie) => {
                  field.handleChange(movie);
                }}
                posterWidth="185px"
                posterHeight="278px"
                value={field.state.value}
                style={{ width: '30%' }}
              />
            )}
          />
          <div className="d-flex flex-column h-100 gap-2">
            <experienceForm.Field
              name="title"
              children={(field) => (
                <input
                  type="text"
                  className="dialog-input"
                  value={field.state.value}
                  style={{ width: '100%' }}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            />

            <experienceForm.Field
              name="description"
              children={(field) => (
                <textarea
                  value={field.state.value}
                  className="dialog-input"
                  onChange={(e) => field.handleChange(e.target.value)}
                  style={{ height: '100%', width: '100%' }}
                />
              )}
            />
          </div>
        </form>
      </experienceForm.Provider>
    </TgmuDialog>
  );
};

export default NewExperienceDialog;
