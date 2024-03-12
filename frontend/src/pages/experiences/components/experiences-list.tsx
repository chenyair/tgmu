import TgmuScrollArea from '@/components/tgmu-scroll-area';
import { IExperience } from 'shared-types';
import ExperienceCard from './experience-card';
import { useAuth } from '@/helpers/auth.context';

interface ExperiencesListProps {
  experiences: IExperience[];
  onScrollBottom: () => void;
}

const ExperiencesList: React.FC<ExperiencesListProps> = ({ experiences, onScrollBottom }: ExperiencesListProps) => {
  const { user } = useAuth();

  // TODO: Implement functions
  const handleLikeClicked = (experience: IExperience) => {};
  const handleCommentClicked = (experience: IExperience) => {};

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
          />
        ))}
      </div>
    </TgmuScrollArea>
  );
};

export default ExperiencesList;
