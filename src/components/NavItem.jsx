import { NavLink, useLocation } from 'react-router-dom';

function NavItem({ icon, text, to, sidebarOpen }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  const baseClasses = "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200";
  const activeClasses = isActive 
    ? "bg-blue-50 text-blue-700 font-medium"
    : "hover:bg-gray-100 text-gray-700";

  return (
    <NavLink to={to} className={`${baseClasses} ${activeClasses}`}>
      <div className="flex-shrink-0">{icon}</div>
      {sidebarOpen && <span>{text}</span>}
    </NavLink>
  );
}

export default NavItem;
