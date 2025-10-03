import StatCard from './StatCard';
import { Users, DollarSign, ShoppingCart, Activity } from 'lucide-react';
import RecentActivityTable from './RecentActivityTable';
import RevenueChart from './RevenueChart';
import { useState } from 'react';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Dashboard() {
  const [lessonType, setLessonType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dummy Lesson Types
  const [lessonsTypes, setLessonsTypes] = useState([
    { id: 1, type_name: "Grammar" },
    { id: 2, type_name: "Vocabulary" },
    { id: 3, type_name: "Listening" },
    { id: 4, type_name: "Speaking" },
  ]);

  // Handle Submit Dummy
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!lessonType.trim()) {
      toast.error('Please enter a lesson type name');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newType = { id: lessonsTypes.length + 1, type_name: lessonType };
      setLessonsTypes([...lessonsTypes, newType]);

      toast.success('Lesson type added successfully!');
      setLessonType('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <main className="flex-1 p-4 md:p-6 overflow-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>
      
      {/* Add Lesson Type Section */}
      <div className="bg-white rounded-lg shadow-sm p-5 mb-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Add Lesson Type</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <input
            type="text"
            value={lessonType}
            onChange={(e) => setLessonType(e.target.value)}
            className="flex-1 w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Enter lesson type name"
            disabled={isSubmitting}
          />
          
          <button 
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-blue-300"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>

      {/* Charts and Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
          <RevenueChart />
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Lesson Types</h3>
          <RecentActivityTable data={lessonsTypes} />
        </div>
      </div>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </main>
  );
}

export default Dashboard;
