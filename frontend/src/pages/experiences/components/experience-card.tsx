import { IExperience, IUserDetails } from 'shared-types';
import './experience-card.scss';
import { FaHeart, FaRegHeart, FaRegComment } from 'react-icons/fa6';
interface ExperienceCardProps {
  experience: IExperience;
  loggedUser: IUserDetails;
  onLikeClicked: (experience: IExperience) => void;
  onCommentClicked: (experience: IExperience) => void;
}

const ExperienceCard = ({ experience, loggedUser, onLikeClicked, onCommentClicked }: ExperienceCardProps) => {
  return (
    <div className="d-flex h-100 justify-content-center experience-card" style={{ width: '80%' }}>
      <img
        src={`http://localhost:8000/public/images/${experience.imgUrl}`}
        alt={experience.title}
        className="mw-100 mh-100 experience-card-img"
        style={{ width: '50%' }}
      />
      <div className="d-flex flex-column experience-content gap-4" style={{ width: '50%' }}>
        <div className="fs-5 fw-semibold mt-3 experience-card-title">{experience.title}</div>
        <div className="experience-card-description">{experience.description}</div>
        <div className="experience-actions d-flex mt-auto justify-content-evenly">
          <div
            className="d-flex align-items-center justify-content-center gap-2 fs-6 experience-card-likes-btn w-100"
            onClick={() => onLikeClicked(experience)}
          >
            {experience.likedUsers.findIndex((like) => like === loggedUser?._id) !== -1 ? (
              <FaHeart color="#CE2C31" />
            ) : (
              <FaRegHeart />
            )}

            <div>{experience.likedUsers.length}</div>
          </div>
          <div
            className="d-flex align-items-center justify-content-center gap-2 fs-6 experience-card-comments-btn w-100"
            onClick={() => onCommentClicked(experience)}
          >
            <div>
              <FaRegComment style={{ marginBottom: '2px' }} />
            </div>
            <div>{experience.comments.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;