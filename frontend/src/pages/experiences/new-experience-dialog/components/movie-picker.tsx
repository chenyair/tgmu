import MovieCard from '@/components/movie-card';
import { movieService } from '@/services/movie-service';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Movie } from 'shared-types';
import Select, { InputActionMeta } from 'react-select';
import { debounce } from 'lodash';
import './movie-picker.scss';
import React from 'react';

interface MoviePickerProps {
  onSelect: (movie?: Movie) => void;
  value?: Movie;
  posterHeight?: string;
  posterWidth?: string;
  style?: React.CSSProperties;
}
const MoviePicker: React.FC<MoviePickerProps> = ({
  onSelect,
  value,
  posterHeight,
  posterWidth,
  style,
}: MoviePickerProps) => {
  const [query, setQuery] = useState(value?.title || '');

  const { data, isFetching } = useQuery({
    queryKey: ['movies', query],
    queryFn: ({ signal }) => movieService.getByQuery(query, signal),
    refetchOnMount: false,
  });

  const options = useMemo(() => data?.map((movie) => ({ value: movie, label: movie.title, color: '#00B8D9' })), [data]);
  const handleInputChange = useMemo(
    () => debounce((newValue: string, _: InputActionMeta) => setQuery(newValue), 300),
    []
  );

  return (
    <div className="d-flex flex-column h-100 gap-2 align-items-center" style={style}>
      <Select
        className="basic-single"
        classNamePrefix="select"
        options={options}
        isLoading={isFetching}
        isSearchable
        isClearable
        onInputChange={handleInputChange}
        onChange={(newValue, _) => onSelect(newValue?.value)}
        value={value ? { value, label: value.title, color: '#00B8D9' } : null}
        styles={{
          control: (base, isFocused) => ({
            ...base,
            backgroundColor: 'var(--violet-1)',
            border: `var(--violet-${isFocused ? '9' : '4'}) 2px solid`,
            ':hover': { border: 'var(--violet-4) 2px solid' },
          }),
          menu: (base) => ({ ...base, backgroundColor: 'var(--violet-1)', border: 'var(--violet-9) 2px solid' }),
          indicatorSeparator: (base) => ({ ...base, backgroundColor: 'var(--violet-9)' }),
          dropdownIndicator: (base) => ({ ...base, color: 'var(--violet-9)' }),
          input: (base) => ({ ...base, color: 'var(--violet-9)' }),
          singleValue: (base) => ({ ...base, color: 'var(--violet-9)' }),
          option: (base, { isFocused }) => ({
            ...base,
            color: isFocused ? 'var(--violet-1)' : 'var(--violet-9)',
            backgroundColor: isFocused ? 'var(--violet-9)' : 'transparent',

            '&:hover': {
              backgroundColor: 'var(--violet-9)',
              color: 'var(--violet-1)',
            },
          }),
          menuPortal: (base) => ({ ...base, backgroundColor: 'var(--violet-9)' }),
          clearIndicator: (base) => ({ ...base, color: 'var(--violet-9)' }),
          noOptionsMessage: (base) => ({ ...base, color: 'var(--violet-9)' }),
          placeholder: (base) => ({ ...base, color: 'var(--violet-9)' }),
        }}
      />
      {value ? (
        <MovieCard
          title={value?.title || ''}
          height={posterHeight}
          width={posterWidth}
          border="var(--violet-9) 2px solid"
          posterImageUrl={
            value
              ? `https://image.tmdb.org/t/p/w185${value.poster_path}`
              : 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Black_question_mark.png'
          }
        />
      ) : (
        <div className="movie-picker-card" style={{ height: posterHeight, width: posterWidth }}>
          <div>No movie selected.</div>
          <div>Please start typing above.</div>
        </div>
      )}
    </div>
  );
};

export default MoviePicker;
