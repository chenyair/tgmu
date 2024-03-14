import { useState } from 'react';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import TgmuDialog from '@/components/tgmu-dialog';
import { useForm } from '@tanstack/react-form';
import ImageEditor from './image-editor';
import { ExperienceGetAllResponse, Movie } from 'shared-types';
import MoviePicker from './movie-picker';
import { Grid as InitialLoader } from 'react-loader-spinner';
import './experience-dialog.scss';
import Divider from '@/components/divider';
import { TailSpin as Loader } from 'react-loader-spinner';
import { experienceService } from '@/services/experience-service';
import { useAuth } from '@/helpers/auth.context';
import { useQueryClient, InfiniteData, useQuery } from '@tanstack/react-query';

interface ExperienceDialogProps {
  mode: 'edit' | 'new';
}

interface ExperienceFormValues {
  title: string;
  description: string;
  experienceImage: File | undefined;
  movie: Movie | undefined;
}

const ExperienceDialog = ({ mode = 'new' }: ExperienceDialogProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoding, setIsLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const { experienceId } = getRouteApi('/_authenticated/experiences/$experienceId/edit').useParams();

  const { data: experience, status } = useQuery({
    queryKey: ['experience', experienceId],
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    gcTime: 0,
    queryFn: ({ signal, queryKey }) => experienceService.getById(queryKey.at(-1)!, signal),
    enabled: mode === 'edit',
  });

  const formDefaultValues: ExperienceFormValues = experience
    ? {
        title: experience.title,
        description: experience.description,
        experienceImage: undefined,
        movie: experience.movieDetails as Movie,
      }
    : {
        title: '',
        description: '',
        experienceImage: undefined,
        movie: undefined,
      };

  const experienceForm = useForm<ExperienceFormValues>({
    defaultValues: formDefaultValues,
    onSubmit: async ({ value }) => {
      const { title, description, experienceImage, movie } = value;

      // Insert new experience
      setIsLoading(true);

      const payload = {
        title,
        description,
        userId: user!._id!,
        experienceImage: experienceImage!,
        movieDetails: { id: movie!.id, poster_path: movie!.poster_path, title: movie!.title },
      };

      const newExperience =
        mode === 'new'
          ? await experienceService.create(payload)
          : await experienceService.updateById(experienceId, payload);

      setIsLoading(false);

      const updateQueryAfterCreate = (data: InfiniteData<ExperienceGetAllResponse, number> | undefined) => {
        if (data === undefined) return undefined;
        data.pages[0].experiences = [newExperience, ...data.pages[0].experiences];
        return {
          pages: data.pages,
          pageParams: data.pageParams,
        };
      };

      const updateQueryAfterUpdate = (data: InfiniteData<ExperienceGetAllResponse, number> | undefined) => {
        if (data === undefined) return undefined;

        const pages = data.pages.map((page) => ({
          ...page,
          experiences: page.experiences.map((exp) => (exp._id === experienceId ? newExperience : exp)),
        }));

        return {
          pages,
          pageParams: data.pageParams,
        };
      };

      const updateQuery = mode === 'new' ? updateQueryAfterCreate : updateQueryAfterUpdate;

      // Insert new experience to the first page of the experiences list
      queryClient.setQueryData<InfiniteData<ExperienceGetAllResponse, number>>(['experiences', true], (data) =>
        updateQuery(data)
      );
      queryClient.setQueryData<InfiniteData<ExperienceGetAllResponse, number>>(['experiences', false], (data) =>
        updateQuery(data)
      );

      // Redirect back to experiences page
      handleClose();
    },
    validators: {
      onSubmit({ value }) {
        const { title, description, experienceImage, movie } = value;
        const errors = {
          title: fieldValiators.title(title),
          description: fieldValiators.description(description),
          experienceImage: fieldValiators.experienceImage(experienceImage),
          movie: fieldValiators.movie(movie),
        };

        return Object.values(errors).some((error) => error !== undefined) ? 'There are missing fields' : undefined;
      },
    },
  });

  const fieldValiators = {
    title: (value: string) => {
      if (value.length < 3) {
        return 'Title must be at least 3 characters long';
      }
    },
    description: (value: string) => {
      if (value.length < 10) {
        return 'Description must be at least 10 characters long';
      }
    },
    experienceImage: (value: File | undefined) => {
      if (!value && mode === 'new') {
        return 'Experience image is required';
      }
    },
    movie: (value: Movie | undefined) => {
      if (!value) {
        return 'Movie is required';
      }
    },
  };

  const handleClose = () => {
    navigate({ to: '/experiences' });
  };

  return (
    <TgmuDialog open={true} onOpenChange={handleClose} style={{ height: '70%', width: '70%' }}>
      {mode === 'edit' && status !== 'success' ? (
        <div
          style={{ backgroundColor: 'transparent', height: '100%' }}
          className="d-flex justify-content-center align-items-center"
        >
          <InitialLoader color="var(--violet-9)" />
        </div>
      ) : (
        <experienceForm.Provider>
          <form
            className="d-flex gap-1 h-100 flex-column"
            style={{ width: '100%' }}
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void experienceForm.handleSubmit();
            }}
          >
            <div className="d-flex flex-column gap-3" style={{ height: '10%' }}>
              <div className="experience-form-title">{mode === 'new' ? 'New' : 'Edit'} Experience</div>
              <Divider className="" />
            </div>
            <div className="d-flex gap-3 py-2" style={{ height: '80%' }}>
              <experienceForm.Field
                name="experienceImage"
                children={(field) => (
                  <ImageEditor
                    style={{ width: '40%' }}
                    placeholderImg={experience?.imgUrl}
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
                      placeholder="Enter title..."
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
                      placeholder="Enter description..."
                      onChange={(e) => field.handleChange(e.target.value)}
                      style={{ height: '100%', width: '100%' }}
                    />
                  )}
                />
              </div>
            </div>
            <div className="d-flex flex-column gap-3" style={{ height: '10%' }}>
              <Divider className="" />
              <div className="w-100 d-flex justify-content-center">
                <button
                  type="submit"
                  className="btn w-25 d-flex justify-content-center align-items-center"
                  style={{ height: '40px', backgroundColor: 'var(--violet-9)', color: 'var(--violet-1)' }}
                >
                  {!isLoding ? 'Save' : <Loader color="#fffcf2" height="1.5rem" width="1.5rem" />}
                </button>
              </div>
            </div>
          </form>
        </experienceForm.Provider>
      )}
    </TgmuDialog>
  );
};

export default ExperienceDialog;
