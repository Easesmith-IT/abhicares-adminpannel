export const StatCard = ({ title, value, icon, bg="bg-main" }) => {
  return (
    <div
      className={`
        flex h-[130px] w-[230px] cursor-pointer items-center
        justify-around rounded-[20px] ${bg}
        shadow-lg transition-transform duration-300 hover:scale-105`}
    >
      <div className="text-white">
        <h2 className="text-[30px] font-bold tracking-wider">{value}</h2>
        <p className="text-[13px] font-medium tracking-wide">{title}</p>
      </div>
      {icon}
    </div>
  );
};
