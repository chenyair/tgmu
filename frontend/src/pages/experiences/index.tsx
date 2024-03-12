import { useEffect, useMemo } from 'react';
import { experienceService } from '@/services/experience-service';
import ExperiencesList from './components/experiences-list';
import { debounce } from 'lodash';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ThreeDots } from 'react-loader-spinner';
import { Outlet } from '@tanstack/react-router';

const ExperiencesPage: React.FC = () => {
  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ['experiences'],
    queryFn: async ({ signal, pageParam }) => experienceService.getAll(pageParam, 5, signal),
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

  const handleScrollBottom = useMemo(() => debounce(handleNextPage, 300), [hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    return () => {
      handleScrollBottom.cancel();
    };
  }, [handleScrollBottom]);

  return (
    <div className="h-100">
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
