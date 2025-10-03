import { Home,User, LogOut,ShieldCheck  } from 'lucide-react'; 
import NavItem from './NavItem';
import { Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer , toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function Sidebar({ sidebarOpen }) {
  const Navigate = useNavigate();
  
  return (
    <aside 
      className={`bg-white shadow-md fixed md:relative z-20 h-full transition-all duration-300 ease-in-out w-64 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-16'
      }`}
    >
      <nav className="p-4 space-y-2 h-full overflow-y-auto">
        <div className={`mb-6 text-gray-400 text-xs font-semibold uppercase tracking-wider ${!sidebarOpen && 'md:hidden'}`}>
          Main Menu
        </div>

        <NavItem icon={<Home size={18} />} text="Dashboard" to="/dashboard" active sidebarOpen={sidebarOpen} />
        <NavItem icon={<User size={18} />} text="Users" to="/users" sidebarOpen={sidebarOpen} />
        <NavItem icon={<ShieldCheck  size={18} />} text="Approvals" to="/memberships" sidebarOpen={sidebarOpen} />

        <div className={`my-6 text-gray-400 text-xs font-semibold uppercase tracking-wider ${!sidebarOpen && 'md:hidden'}`}>
          Account
        </div>
        
        <div onClick={() => {
          localStorage.removeItem('isAdminloggedIn')
          localStorage.removeItem('role')
          localStorage.removeItem('id')
          toast.success('Logout Successfully')
          setTimeout(() => {
            Navigate('/');
          }, 2000);
        }}>
          
          <NavItem icon={<LogOut size={18} />} text="Logout"  sidebarOpen={sidebarOpen} />
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
