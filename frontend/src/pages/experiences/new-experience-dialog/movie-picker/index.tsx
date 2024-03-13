import { Movie } from 'shared-types';

interface MoviePickerProps {
  onSelect: (movie: Movie) => void;
  value?: Movie;
}
const MoviePicker: React.FC = () => {
  return <div></div>;
};

export default MoviePicker;
