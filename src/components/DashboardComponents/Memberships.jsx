import React, { useState } from "react";
import { Plus } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Memberships = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer />
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-700">
          Memberships Approvals
        </h1>
        <button
          //   onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white 
             px-4 py-2 rounded-lg text-sm sm:text-base
             hover:bg-blue-700 transition-all w-full sm:w-auto
             whitespace-nowrap"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          Create User
        </button>
      </div>
    </div>
  );
};

export default Memberships;