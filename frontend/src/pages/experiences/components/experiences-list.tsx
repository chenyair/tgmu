import TgmuScrollArea from '@/components/tgmu-scroll-area';
import { ExperienceGetAllResponse, IExperience } from 'shared-types';
import ExperienceCard from './experience-card';
import { useAuth } from '@/helpers/auth.context';
import { useNavigate } from '@tanstack/react-router';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { experienceService } from '@/services/experience-service';

interface ExperiencesListProps {
  experiences: IExperience[];
  onScrollBottom: () => void;
}

const ExperiencesList: React.FC<ExperiencesListProps> = ({ experiences, onScrollBottom }: ExperiencesListProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // TODO: Implement functions
  // const handleLikeClicked = (experience: IExperience) => {};

  const handleCommentClicked = (experience: IExperience) => {
    navigate({ to: '/experiences/$experienceId/comments', params: { experienceId: experience._id! } });
  };

  const handleEditClicked = (experience: IExperience) => {
    navigate({ to: '/experiences/$experienceId/edit', params: { experienceId: experience._id! } });
  };

  const handleDeleteClicked = async (experience: IExperience) => {
    // TODO: Add Loader
    await experienceService.delete(experience._id!);

    // Delete experience from the list
    queryClient.setQueryData<InfiniteData<ExperienceGetAllResponse, number>>(['experiences'], (data) => {
      if (data === undefined) return undefined;
      const filteredPages = data.pages.map((page) => ({
        ...page,
        experiences: page.experiences.filter((exp) => exp._id !== experience._id),
      }));

      return {
        pages: filteredPages,
        pageParams: data.pageParams,
      };
    });
  };

  return (
    <TgmuScrollArea onScrollBottom={onScrollBottom} style={{ height: '80%', width: '70%' }}>
      <div className="d-flex align-items-center flex-column w-100 gap-4">
        {experiences.map((experience) => (
          <ExperienceCard
            key={experience._id}
            experience={experience}
            loggedUser={user!}
            onCommentClicked={handleCommentClicked}
            // onLikeClicked={handleLikeClicked}
            onEditClicked={handleEditClicked}
            onDeleteClicked={handleDeleteClicked}
            isOwner={user!._id === experience.userId.toString()}
            height="14rem"
            width="100%"
          />
        ))}
      </div>
    </TgmuScrollArea>
  );
};

export default ExperiencesList;
