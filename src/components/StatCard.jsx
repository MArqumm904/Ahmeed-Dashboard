function StatCard({ title, value, trend, trendUp, icon }) {
    return (
      <div className="bg-white p-4 md:p-6 rounded-lg shadow hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-500 text-sm">{title}</h3>
          {icon}
        </div>
        <p className="text-2xl font-bold mt-2">{value}</p>
        <p className={`${trendUp ? 'text-blue-500' : 'text-red-500'} text-sm mt-2`}>
          {trend}
        </p>
      </div>
    );
  }
  
  export default StatCard;