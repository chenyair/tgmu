import TgmuScrollArea from '@/components/tgmu-scroll-area';
import { IExperience } from 'shared-types';
import ExperienceCard from './experience-card';
import { useAuth } from '@/helpers/auth.context';
import { useNavigate } from '@tanstack/react-router';

interface ExperiencesListProps {
  experiences: IExperience[];
  onScrollBottom: () => void;
}

const ExperiencesList: React.FC<ExperiencesListProps> = ({ experiences, onScrollBottom }: ExperiencesListProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // TODO: Implement functions
  const handleLikeClicked = (experience: IExperience) => {
    navigate({ to: '/experiences/new' });
  };
  const handleCommentClicked = (experience: IExperience) => {
    navigate({ to: `/experiences/${experience._id}/comments` });
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
            onLikeClicked={handleLikeClicked}
            height="14rem"
            width="100%"
          />
        ))}
      </div>
    </TgmuScrollArea>
  );
};

export default ExperiencesList;
