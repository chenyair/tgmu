import { IExperience, IUserDetails } from 'shared-types';
import './experience-card.scss';
import { FaHeart, FaRegHeart, FaRegComment } from 'react-icons/fa6';
import { MdDelete } from 'react-icons/md';
import MovieCard from '@/components/movie-card';
interface ExperienceCardProps {
  experience: IExperience;
  loggedUser: IUserDetails;
  onLikeClicked: (experience: IExperience) => void;
  onCommentClicked: (experience: IExperience) => void;
  style?: React.CSSProperties;
  height: string;
  width: string;
  isOwner: boolean;
  onDeleteClicked: (experience: IExperience) => void;
  onEditClicked?: (experience: IExperience) => void;
}

const ExperienceCard = ({
  experience,
  loggedUser,
  onLikeClicked,
  height,
  width,
  onCommentClicked,
  onDeleteClicked,
  onEditClicked,
  isOwner,
  style = {},
}: ExperienceCardProps) => {
  return (
    <div className="d-flex gap-3 px-4" style={{ ...style, height, width, position: 'relative' }}>
      {isOwner && (
        <div className="experience-card-owner-actions">
          <MdDelete
            style={{ color: 'red', height: '20px', width: '20px', cursor: 'pointer' }}
            onClick={() => onDeleteClicked(experience)}
          />
        </div>
      )}
      <div style={{ width: '20%' }}>
        <MovieCard
          height={height}
          posterImageUrl={`https://image.tmdb.org/t/p/w185${experience.movieDetails.poster_path}`}
          title={experience.movieDetails.title}
        />
      </div>
      <div className="d-flex h-100 justify-content-center experience-card" style={{ width: '80%' }}>
        <img
          src={experience.imgUrl}
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
    </div>
  );
};

export default ExperienceCard;
