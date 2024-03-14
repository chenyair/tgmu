interface DividerProps {
  className?: string;
}
const Divider: React.FC<DividerProps> = ({ className = 'py-3' }: DividerProps) => {
  return (
    <div className={`d-flex align-items-center ${className}`}>
      <div style={{ borderBottom: '0.1rem solid rgb(60,60,60)', width: '100%' }} />
    </div>
  );
};

export default Divider;
