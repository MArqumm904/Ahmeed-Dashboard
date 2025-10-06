import React, { useState, useEffect } from "react";
import { Briefcase, UserCircle, Calendar, MapPin, Check, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiUrl } from "../../config/config";

const Memberships = () => {
  const [activeTab, setActiveTab] = useState("user"); // "user" or "company"
  const [userMemberships, setUserMemberships] = useState([]);
  const [companyMemberships, setCompanyMemberships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  // Fetch memberships when component mounts or tab changes
  useEffect(() => {
    fetchMemberships();
  }, [activeTab]);

  /**
   * Fetch memberships from backend based on active tab
   */
  const fetchMemberships = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === "user" 
        ? `${apiUrl}/getUserMembershipsForAdmin`
        : `${apiUrl}/getCompanyMembershipsForAdmin`;

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${your_token}`
        },
      });

      const data = await response.json();
      
      if (data.success) {
        if (activeTab === "user") {
          setUserMemberships(data.data);
        } else {
          setCompanyMemberships(data.data);
        }
      } else {
        toast.error(data.message || "Failed to fetch memberships");
      }
    } catch (error) {
      toast.error("Failed to fetch memberships. Please try again.");
      console.error("Error fetching memberships:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle status change (Verify or Reject)
   * @param {number} membershipId - Membership ID
   * @param {string} newStatus - "admin_verified" or "rejected"
   * @param {string} type - "user" or "company"
   */
  const handleStatusChange = async (membershipId, newStatus, type) => {
    // Set loading state for this specific membership
    setActionLoading(prev => ({ ...prev, [membershipId]: true }));
    
    try {
      const endpoint = type === "user" 
        ? `${apiUrl}/updateUserMembershipStatus`
        : `${apiUrl}/updateCompanyMembershipStatus`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${your_token}`
        },
        body: JSON.stringify({
          membership_id: membershipId,
          status: newStatus
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          `Membership ${newStatus === 'admin_verified' ? 'verified' : 'rejected'} successfully!`
        );
        
        // Refresh the list after status change
        await fetchMemberships();
      } else {
        toast.error(data.message || "Failed to update membership status");
      }
    } catch (error) {
      toast.error("Failed to update membership status. Please try again.");
      console.error("Error updating status:", error);
    } finally {
      // Remove loading state
      setActionLoading(prev => ({ ...prev, [membershipId]: false }));
    }
  };

  /**
   * Render individual membership card
   * @param {object} membership - Membership data
   * @param {string} type - "user" or "company"
   */
  const renderMembershipCard = (membership, type) => {
    const isLoading = actionLoading[membership.id];
    
    return (
      <div
        key={membership.id}
        className="bg-white shadow-md rounded-2xl p-5 mb-4 border border-gray-100 hover:shadow-lg transition-all duration-200"
      >
        <div className="flex flex-col">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-semibold text-blue-700 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-500" />
                {membership.company_name}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mt-1 flex items-center gap-2">
                <UserCircle className="w-4 h-4 text-gray-500" />
                {membership.job_title}
              </p>
              <p className="text-gray-600 text-sm mt-1 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                {membership.location}
              </p>
            </div>

            <span className="px-3 py-1 text-sm rounded-full font-medium mt-2 sm:mt-0 bg-blue-100 text-blue-700">
              COMPANY APPROVED
            </span>
          </div>

          {/* Details Section */}
          <div className="mb-4 text-sm text-gray-700 space-y-2 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>
                {new Date(membership.start_date).toLocaleDateString()} →{" "}
                {membership.end_date 
                  ? new Date(membership.end_date).toLocaleDateString() 
                  : "Present"}
              </span>
            </div>
            <div>
              <strong>Responsibilities:</strong>{" "}
              {membership.responsibilities || "N/A"}
            </div>
            <div>
              <strong>Currently Working:</strong>{" "}
              {membership.currently_working ? "Yes" : "No"}
            </div>
            
            {/* User Info (for user memberships) */}
            {type === "user" && membership.user && (
              <div className="pt-2 border-t border-gray-200">
                <strong>User:</strong> {membership.user.name} ({membership.user.email})
              </div>
            )}
            
            {/* Company Page Info */}
            {membership.page && (
              <div className="pt-2 border-t border-gray-200">
                <strong>Company Page:</strong> {membership.page.page_name}
              </div>
            )}

            {/* User Page Info (for company memberships) */}
            {type === "company" && membership.pageaffiliation && (
              <div className="pt-2 border-t border-gray-200">
                <strong>User Page:</strong> {membership.pageaffiliation.page_name}
              </div>
            )}

            {/* Documents */}
            {membership.documents && membership.documents.length > 0 && (
              <div className="pt-2 border-t border-gray-200">
                <strong>Documents:</strong>
                <ul className="ml-4 mt-1 list-disc">
                  {membership.documents.map((doc, idx) => (
                    <li key={idx} className="text-xs text-blue-600">
                      {doc.confirmation_letter && (
                        <a 
                          href={'https://backend.fusixtech.com/public/storage/'+doc.confirmation_letter} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          Confirmation Letter
                        </a>
                      )}
                      {doc.confirmation_letter && doc.proof_document && " | "}
                      {doc.proof_document && (
                        <a 
                          href={'https://backend.fusixtech.com/public/storage/'+doc.proof_document} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          Proof Document
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => handleStatusChange(membership.id, "admin_verified", type)}
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200"
            >
              <Check className="w-4 h-4" />
              {isLoading ? "Processing..." : "Verify"}
            </button>
            
            <button
              onClick={() => handleStatusChange(membership.id, "rejected", type)}
              disabled={isLoading}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200"
            >
              <X className="w-4 h-4" />
              {isLoading ? "Processing..." : "Reject"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-700">
          Membership Approvals
        </h1>
      </div>

      {/* Toggle Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab("user")}
          className={`px-5 py-2 rounded-lg font-semibold transition-all ${
            activeTab === "user"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
        >
          User Memberships
        </button>
        <button
          onClick={() => setActiveTab("company")}
          className={`px-5 py-2 rounded-lg font-semibold transition-all ${
            activeTab === "company"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
        >
          Company Memberships
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div>
          {/* User Memberships Tab */}
          {activeTab === "user" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Pending User Memberships ({userMemberships.length})
              </h2>
              {userMemberships.length > 0 ? (
                userMemberships.map((membership) => 
                  renderMembershipCard(membership, "user")
                )
              ) : (
                <div className="bg-white rounded-lg p-8 text-center shadow-md">
                  <p className="text-gray-500 text-lg">
                    No pending user memberships.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Company Memberships Tab */}
          {activeTab === "company" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Pending Company Memberships ({companyMemberships.length})
              </h2>
              {companyMemberships.length > 0 ? (
                companyMemberships.map((membership) => 
                  renderMembershipCard(membership, "company")
                )
              ) : (
                <div className="bg-white rounded-lg p-8 text-center shadow-md">
                  <p className="text-gray-500 text-lg">
                    No pending company memberships.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Memberships;