const TimeMode = () => {
  const timeModes = [15, 30, 60, 120];
  return (
    <div className="flex align-middle ">
      {timeModes.map((mode, index) => (
        <button className="px-2 text-xs text-gruv-gray bg-primary-dark hover:text-gruv-light-yello">
          {mode}
        </button>
      ))}
    </div>
  );
};

export default TimeMode;
