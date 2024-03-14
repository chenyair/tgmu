import { useEffect, useMemo, useState } from 'react';
import { experienceService } from '@/services/experience-service';
import ExperiencesList from './components/experiences-list';
import { debounce } from 'lodash';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ThreeDots } from 'react-loader-spinner';
import { Outlet, useNavigate } from '@tanstack/react-router';
import { FaCirclePlus } from 'react-icons/fa6';
import './index.scss';
import { useAuth } from '@/helpers/auth.context';

const ExperiencesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMyExperiences, setIsMyExperiences] = useState(false);

  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ['experiences', isMyExperiences],
    queryFn: async ({ signal, pageParam }) =>
      experienceService.getAll({ page: pageParam, limit: 10, owner: isMyExperiences ? user?._id! : undefined }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.experiences.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
  });

  const handleNextPage = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };
  const handleToggleMyExperiences = () => {
    setIsMyExperiences((prev) => !prev);
  };

  const handleScrollBottom = useMemo(() => debounce(handleNextPage, 300), [hasNextPage, isFetchingNextPage]);
  const handleNewExperience = () => {
    navigate({ to: '/experiences/new' });
  };

  useEffect(() => {
    return () => {
      handleScrollBottom.cancel();
    };
  }, [handleScrollBottom]);

  return (
    <div className="h-100" style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', left: '2%', top: '2%' }}>
        <FaCirclePlus className="new-experience-btn" style={{}} onClick={handleNewExperience} />
      </div>
      <div style={{ position: 'absolute', left: '8%', top: '3%' }}>
        <button type="button" className="btn btn-outline-info" onClick={handleToggleMyExperiences}>
          Click to show {isMyExperiences ? 'all' : 'only yours'}
        </button>
      </div>
      <div className="d-flex flex-column justify-content-center align-items-center h-100">
        {(() => {
          if (status === 'pending') return <div></div>;
          if (status === 'error') return <div>Error: {error.message}</div>;
          return (
            <ExperiencesList
              experiences={data.pages.map((page) => page.experiences).flat()}
              onScrollBottom={handleScrollBottom}
            />
          );
        })()}
      </div>
      {isFetching && (
        <div style={{ position: 'absolute', bottom: '1%', left: '55%' }}>
          <ThreeDots color="#fffcf2" height={'5em'} width={'5em'} />
        </div>
      )}
      <Outlet />
    </div>
  );
};

export default ExperiencesPage;
