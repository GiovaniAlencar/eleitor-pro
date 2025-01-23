interface StatsCardProps {
  title: string;
  value: string | number;
  // change: string;
  icon: React.ReactNode;
  color: 'green' | 'cyan' | 'blue';
}

export default function StatsCard({ title, value, icon, color }: StatsCardProps) {
  const gradientClasses = {
    green: 'from-[#13db63] to-[#02bde8]',
    cyan: 'from-cyan-500 to-blue-500',
    blue: 'from-blue-500 to-indigo-600'
  };

  const shadowClasses = {
    green: 'shadow-green-500/5 hover:shadow-green-500/10',
    cyan: 'shadow-cyan-500/5 hover:shadow-cyan-500/10',
    blue: 'shadow-blue-500/5 hover:shadow-blue-500/10'
  };

  return (
    <div className={`bg-white rounded-xl p-6 border border-gray-100 shadow-sm ${shadowClasses[color]} transition-all duration-200 hover:-translate-y-1 hover:shadow-lg`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-500 uppercase text-sm font-medium tracking-wider">{title}</h3>
          <p className="text-3xl font-bold mt-1 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {value}
          </p>
          {/* <p className="text-green-500 text-sm mt-2 font-medium flex items-center">
            {change}
          </p> */}
        </div>
        <div className={`bg-gradient-to-r ${gradientClasses[color]} p-3 rounded-xl shadow-sm`}>
          {icon}
        </div>
      </div>
    </div>
  );
}