import { Search, Bell, Menu, X } from 'lucide-react';

function Header({ sidebarOpen, toggleSidebar }) {
  return (
    <header className="bg-white shadow-sm z-30 sticky top-0">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar} 
            className="p-2 mr-2 rounded-md hover:bg-gray-100 focus:outline-none"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-xl font-bold text-blue-800">My Dashboard</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative hidden sm:block">
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-8 pr-4 py-1 border rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search size={16} className="absolute left-2 top-2 text-gray-400" />
          </div>
          
          <div className="relative">
            <Bell size={20} className="text-gray-500 hover:text-gray-700 cursor-pointer" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">3</span>
          </div>
          
          <div className="w-8 h-8 rounded-full bg-blue-600  flex items-center justify-center text-white font-medium">
            US
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;