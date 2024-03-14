import React from 'react';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import TgmuDialog from '@/components/tgmu-dialog';
import { InfiniteData, useQuery, useQueryClient } from '@tanstack/react-query';
import { format as formatTimeAgo } from 'timeago.js';
import { Puff as PostLoader } from 'react-loader-spinner';
import { Grid as InitialLoader } from 'react-loader-spinner';
import { FaRegCommentDots } from 'react-icons/fa';
import { experienceService } from '@/services/experience-service';
import TgmuScrollArea from '@/components/tgmu-scroll-area';
import * as Avatar from '@radix-ui/react-avatar';
import './index.scss';
import { ExperienceGetAllResponse, ExperienceGetByIdResponse } from 'shared-types';
import { useAuth } from '@/helpers/auth.context';
import Divider from '@/components/divider';

const ExperienceCommentsDialog: React.FC = () => {
  const purpleColor = 'var(--violet-9)';
  const whiteColor = '#fffcf2';

  const navigate = useNavigate();
  const { experienceId } = getRouteApi('/_authenticated/experiences/$experienceId/comments').useParams();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [newComment, setNewComment] = React.useState<string>('');

  const queryClient = useQueryClient();
  const auth = useAuth();

  const { data: experience, status } = useQuery({
    queryKey: ['experience', experienceId],
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    queryFn: ({ signal, queryKey }) => experienceService.getById(queryKey.at(-1)!, signal),
  });

  const postComment = async () => {
    try {
      setIsLoading(true);

      const createdAt = new Date();
      const { firstName, lastName, imgUrl } = auth.user!;


      const updatedExperience = await experienceService.postComment(experienceId, newComment);
      queryClient.setQueryData<ExperienceGetByIdResponse>(['experience', experienceId], (oldData) => {
        if (!oldData) {
          return undefined;
        }

        const commentToAdd = {
          text: newComment,
          userId: {
            firstName,
            lastName,
            imgUrl,
          },
          createdAt,
          updatedAt: createdAt,
        };

        return {
          ...oldData!,
          comments: [...oldData!.comments, commentToAdd],
        };
      });

      const updateExperienceListData = (data: InfiniteData<ExperienceGetAllResponse, number> | undefined) => {
        if (data === undefined) return undefined;

        const newPages = data.pages.map(page => ({
          ...page,
          experiences: page.experiences.map(exp => exp._id === experienceId ? updatedExperience : exp)
        }))


        return {
          pages: newPages,
          pageParams: data.pageParams,
        };
      }

      // Insert new experience to the first page of the experiences list
      queryClient.setQueryData<InfiniteData<ExperienceGetAllResponse, number>>(['experiences', true], (data) => updateExperienceListData(data));
      queryClient.setQueryData<InfiniteData<ExperienceGetAllResponse, number>>(['experiences', false], (data) => updateExperienceListData(data));

      setNewComment('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    navigate({ to: '/experiences' });
  };

  return (
    <TgmuDialog open={true} onOpenChange={handleClose} style={{ height: '85%', width: '35%', color: purpleColor }}>
      {status !== 'success' ? (
        <div
          style={{ backgroundColor: 'transparent', height: '100%' }}
          className="d-flex justify-content-center align-items-center"
        >
          <InitialLoader color={purpleColor} />
        </div>
      ) : (
        <span>
          <div className="d-flex flex-row align-items-center">
            <FaRegCommentDots size="1.5rem" />
            <div className="fs-4 fw-semibold" style={{ paddingLeft: '0.5rem' }}>
              Add Comment
            </div>
          </div>
          <div style={{ paddingLeft: '2rem' }}>"{experience.title}"</div>
          <TgmuScrollArea
            style={{
              height: '70%',
              width: '100%',
              boxShadow: 'none',
              paddingTop: '1rem',
              display: 'flex',
              flexDirection: 'column-reverse',
            }}
          >
            {experience.comments
              .map(({ text, createdAt, userId: user }, index) => (
                <div>
                  <div key={index} style={{ padding: '1rem' }} className="d-flex flex-row">
                    <Avatar.Root
                      style={{ height: '2rem', width: '2rem' }}
                      className="AvatarRoot flex-column justify-content-center"
                    >
                      <Avatar.Image
                        className="AvatarImage"
                        src={user.imgUrl || `${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`}
                      />
                    </Avatar.Root>
                    <div className="d-flex flex-column w-100" style={{ paddingLeft: '2%' }}>
                      <div className="d-flex flex-row justify-content-between">
                        <div className="fw-semibold" style={{ color: whiteColor }}>
                          {user.firstName} {user.lastName}
                        </div>
                        <small style={{ color: 'grey' }}>{formatTimeAgo(createdAt)}</small>
                      </div>
                      <div style={{ color: 'grey' }}>{text}</div>
                    </div>
                  </div>
                  <Divider className="pb-0 pt-0 w-90" />
                </div>
              ))
              .reverse()}
          </TgmuScrollArea>
          <div className="d-flex d-row pt-4">
            <textarea
              id="add-comment-input"
              style={{ backgroundColor: 'transparent', caretColor: purpleColor, borderColor: purpleColor }}
              placeholder="Reply here..."
              className="form-control text-white form-control-md tgmu-form-input"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </div>
          <div className="d-flex flex-row justify-content-end" style={{ paddingTop: '0.5rem' }}>
            <button
              id="post-comment-button"
              disabled={newComment.length === 0}
              onClick={postComment}
              className="btn"
              style={{ backgroundColor: purpleColor, color: whiteColor }}
            >
              {isLoading ? (
                <div className="d-flex justify-content-center">
                  <PostLoader color={whiteColor} width="1.5rem" height="1.5rem"></PostLoader>
                </div>
              ) : (
                'Post'
              )}
            </button>
          </div>
        </span>
      )}
    </TgmuDialog>
  );
};

export default ExperienceCommentsDialog;
