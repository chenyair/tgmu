import * as ScrollArea from '@radix-ui/react-scroll-area';
import React, { ReactNode, useEffect, useRef } from 'react';
import './tgmu-scroll-area.scss';

interface TgmuScrollAreaProps {
  children: ReactNode;
  style?: React.CSSProperties;
  onScroll?: (element: HTMLDivElement) => void;
  onScrollBottom?: () => void;
}

const TgmuScrollArea: React.FC<TgmuScrollAreaProps> = ({
  children,
  style,
  onScroll,
  onScrollBottom,
}: TgmuScrollAreaProps) => {
  const listInnerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current!;
    const isNearBottom = scrollTop + clientHeight + 10 >= scrollHeight;

    if (onScroll) onScroll(listInnerRef.current!);
    if (onScrollBottom && isNearBottom) onScrollBottom();
  };

  useEffect(() => {
    const listInnerElement = listInnerRef.current;

    if (listInnerElement) {
      listInnerElement.addEventListener('scroll', handleScroll);

      // Clean-up
      return () => {
        listInnerElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  return (
    <ScrollArea.Root className="ScrollAreaRoot" style={style}>
      <ScrollArea.Viewport className="ScrollAreaViewport" ref={listInnerRef}>
        {children}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="vertical">
        <ScrollArea.Thumb className="ScrollAreaThumb" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="horizontal">
        <ScrollArea.Thumb className="ScrollAreaThumb" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner className="ScrollAreaCorner" />
    </ScrollArea.Root>
  );
};

export default TgmuScrollArea;
// <div
//   className="d-grid gap-3"
//   style={{ alignItems: 'center', gridTemplateColumns: 'repeat(auto-fill, minmax(154px, 1fr))', width: '95%' }}
// >
//   {movies.map((movie) => (
//     <MovieCard
//       key={movie.id}
//       posterImageUrl={`https://image.tmdb.org/t/p/w154${movie.poster_path}`}
//       title={movie.title}
//     />
//   ))}
// </div>
