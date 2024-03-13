interface DividerProps {
  classNames?: string;
}
const Divider: React.FC<DividerProps> = ({ classNames = 'py-3' }: DividerProps) => {
  return (
    <div className={`d-flex align-items-center ${classNames}`}>
      <div style={{ borderBottom: '0.1rem solid rgb(60,60,60)', width: '100%' }} />
    </div>
  );
};

export default Divider;
