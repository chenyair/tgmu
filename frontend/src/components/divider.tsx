const Divider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={className || 'd-flex align-items-center pb-3 pt-3'}>
      <div style={{ borderBottom: '0.1rem solid rgb(60,60,60)', width: '100%' }} />
    </div>
  );
};

export default Divider;
