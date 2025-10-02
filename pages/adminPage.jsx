"use client";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  submitDoctorApplication,
  getUsersFromFirestore,
  getAllDoctorApplications,
  approveDoctorApplication,
  rejectDoctorApplication,
  getAnalyticsData,
} from "@/lib/firebase-users";
import {
  ArrowRight,
  Stethoscope,
  Star,
  MapPin,
  Calendar,
  Video,
  Brain,
  Heart,
  Eye,
  Baby,
  Bone,
  UserCog,
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    totalApplications: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        // Fetch users
        const firestoreUsers = await getUsersFromFirestore();
        if (firestoreUsers) {
          setUsers(firestoreUsers);
        }

        // Fetch doctor applications
        const doctorApplications = await getAllDoctorApplications();
        if (doctorApplications) {
          setApplications(doctorApplications);
        }

        // Fetch analytics data
        const analytics = await getAnalyticsData();
        if (analytics) {
          setAnalyticsData(analytics);
        }
        
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  
  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    const name = (
      user?.fullName ||
      user?.name ||
      `${user?.firstName || ""} ${user?.lastName || ""}`.trim()
    ).toLowerCase();
    const email = (user?.email || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    return name.includes(search) || email.includes(search);
  });

  // Filter applications based on search term
  const filteredApplications = applications.filter((app) => {
    const name = (app?.fullName || app?.name || "").toLowerCase();
    const specialization = (app?.specialization || "").toLowerCase();
    const email = (app?.email || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    return (
      name.includes(search) ||
      specialization.includes(search) ||
      email.includes(search)
    );
  });

  const handleRoleChange = async (user, newRole) => {
    try {
      setUsers(
        users.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
      );
      setShowRoleModal(false);
      setSelectedUser(null);
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, { role: newRole });
    } catch (error) {
      console.error("❌ Error updating role:", error);
    }
  };

  const handleApproveApplication = async (application) => {
    try {
      const result = await approveDoctorApplication(
        application.id,
        user.id,
        "Approved by admin"
      );

      if (result.success) {
        // Update local state
        setApplications(
          applications.map((app) =>
            app.id === application.id ? { ...app, status: "approved" } : app
          )
        );

        // Refresh analytics data
        const analytics = await getAnalyticsData();
        if (analytics) {
          setAnalyticsData(analytics);
        }

        // Refresh users data
        const firestoreUsers = await getUsersFromFirestore();
        if (firestoreUsers) {
          setUsers(firestoreUsers);
        }

        alert("Doctor application approved successfully!");
      } else {
        alert("Failed to approve application: " + result.error);
      }
    } catch (error) {
      console.error("Error approving application:", error);
      alert("An error occurred while approving the application.");
    }

    setShowApproveModal(false);
    setSelectedApplication(null);
  };

  const handleRejectApplication = async (application) => {
    try {
      const result = await rejectDoctorApplication(
        application.id,
        "admin-user-id",
        "Rejected by admin"
      );

      if (result.success) {
        // Update local state - change status to rejected instead of removing
        setApplications(
          applications.map((app) =>
            app.id === application.id ? { ...app, status: "rejected" } : app
          )
        );

        // Refresh analytics data
        const analytics = await getAnalyticsData();
        if (analytics) {
          setAnalyticsData(analytics);
        }

        // Refresh users data
        const firestoreUsers = await getUsersFromFirestore();
        if (firestoreUsers) {
          setUsers(firestoreUsers);
        }

        alert("Doctor application rejected successfully!");
      } else {
        alert("Failed to reject application: " + result.error);
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
      alert("An error occurred while rejecting the application.");
    }

    setShowApproveModal(false);
    setSelectedApplication(null);
  };
  // console.log("user id:", user.id)
  return (
    <div className="min-h-screen bg-gray-50 pt-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <div className="bg-emerald-600/25 text-emerald-600 p-4 rounded-full">
            <UserCog className="w-14 h-14 " />
          </div>
          <div className="ml-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Manage users and doctor applications
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search users or applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("users")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "users"
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                  Manage Users
                </span>
              </button>
              <button
                onClick={() => setActiveTab("applications")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "applications"
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Doctor Applications
                  {applications.filter((app) => app.status === "pending")
                    .length > 0 && (
                    <span className="ml-2 bg-emerald-100 text-emerald-600 text-xs font-medium px-2 py-1 rounded-full">
                      {
                        applications.filter((app) => app.status === "pending")
                          .length
                      }
                    </span>
                  )}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "analytics"
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Analytics
                </span>
              </button>
            </nav>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <span className="ml-3 text-gray-600">
              Loading admin dashboard...
            </span>
          </div>
        )}

        {/* Content */}
        {!loading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Manage Users
                </h2>
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                          
                              <div className="flex-shrink-0 h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center overflow-hidden">
                                <img
                                  src={user.profileImage}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user?.fullName ||
                                    user?.name ||
                                    `${user?.firstName || ""} ${
                                      user?.lastName || ""
                                    }`.trim() ||
                                    "Unknown User"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.role === "doctor"
                                  ? "bg-purple-100 text-purple-800"
                                  : user.role === "admin"? 
                                  "bg-blue-100 text-blue-800" : "bg-pink-100 text-pink-800"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.status === "active" ||
                                user.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : user.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowRoleModal(true);
                              }}
                              className="text-emerald-600 hover:text-emerald-900 font-medium"
                            >
                              Change Role
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === "applications" && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Doctor Applications
                </h2>
                <div className="space-y-4">
                  {filteredApplications.map((application) => (
                    <div
                      key={application.id}
                      className="border border-gray-200 rounded-lg p-6 hover:border-emerald-300 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {application.fullName ||
                                application.name ||
                                "Unknown Doctor"}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                application.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : application.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {application.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Email:</span>{" "}
                              {application.email || "Not provided"}
                            </div>
                            <div>
                              <span className="font-medium">
                                Specialization:
                              </span>{" "}
                              {application.specialization || "Not provided"}
                            </div>
                            <div>
                              <span className="font-medium">Experience:</span>{" "}
                              {application.experience
                                ? `${application.experience} years`
                                : "Not provided"}
                            </div>
                            <div>
                              <span className="font-medium">License:</span>{" "}
                              {application.licenseNumber || "Not provided"}
                            </div>
                          <div className="mt-3">
                            <span className="font-medium text-sm">
                              Qualifications:
                            </span>
                            <p className="text-sm text-gray-600">
                              {application.qualifications}
                            </p>
                          </div>
                          
                          {application.status === "approved" && (
                          <div className="mt-3">
                            <span className="font-medium text-sm">
                              Approved By:
                            </span>
                            <p className="text-sm text-gray-600">
                              {application.qualifications}
                            </p>
                          </div>
                          )}

                          </div>
                          <div className="mt-2 text-sm text-gray-500">
                            Applied on:{" "}
                            {application.submittedAt?.toDate
                              ? application.submittedAt
                                  .toDate()
                                  .toLocaleDateString()
                              : application.appliedDate
                              ? new Date(
                                  application.appliedDate
                                ).toLocaleDateString()
                              : "Unknown date"}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-3">
                        {application.status === "pending" && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedApplication(application);
                                setShowApproveModal(true);
                              }}
                              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() =>
                                handleRejectApplication(application)
                              }
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            setSelectedApplication(application);
                            setShowDetailsModal(true);
                          }}
                          className="bg-[#FBF4FD] text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredApplications.length === 0 && (
                    <div className="text-center py-12">
                      <svg
                        className="w-16 h-16 mx-auto text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <h3 className="mt-4 text-lg font-medium text-gray-900">
                        No applications found
                      </h3>
                      <p className="mt-2 text-gray-500">
                        No doctor applications match your search criteria.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Analytics Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-6 border border-emerald-100">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-emerald-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-500">
                          Total Users
                        </h3>
                        <p className="text-2xl font-semibold text-gray-900">
                          {analyticsData.totalUsers}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-100">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-500">
                          Doctors
                        </h3>
                        <p className="text-2xl font-semibold text-gray-900">
                          {analyticsData.totalDoctors}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-100">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-500">
                          Pending Applications
                        </h3>
                        <p className="text-2xl font-semibold text-gray-900">
                          {analyticsData.pendingApplications}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-6 border border-indigo-100">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-indigo-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-500">
                          Total Patients
                        </h3>
                        <p className="text-2xl font-semibold text-gray-900">
                          {analyticsData.totalPatients}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-6 border border-green-100">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-500">
                          Approved Applications
                        </h3>
                        <p className="text-2xl font-semibold text-gray-900">
                          {analyticsData.approvedApplications}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-6 border border-red-100">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-500">
                          Rejected Applications
                        </h3>
                        <p className="text-2xl font-semibold text-gray-900">
                          {analyticsData.rejectedApplications}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Statistics */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Application Statistics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-600">
                        {analyticsData.totalApplications}
                      </div>
                      <div className="text-sm text-gray-500">
                        Total Applications
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {analyticsData.totalApplications > 0
                          ? Math.round(
                              (analyticsData.approvedApplications /
                                analyticsData.totalApplications) *
                                100
                            )
                          : 0}
                        %
                      </div>
                      <div className="text-sm text-gray-500">Approval Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">
                        {analyticsData.totalApplications > 0
                          ? Math.round(
                              (analyticsData.pendingApplications /
                                analyticsData.totalApplications) *
                                100
                            )
                          : 0}
                        %
                      </div>
                      <div className="text-sm text-gray-500">
                        Pending Review
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Role Change Modal */}
        {showRoleModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-auto shadow-2xl">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-4">
                  <svg
                    className="h-8 w-8 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Change User Role
                </h3>
                <p className="text-gray-600 mb-6">
                  Change role for{" "}
                  <span className="font-semibold">
                    {selectedUser?.fullName ||
                      selectedUser?.name ||
                      `${selectedUser?.firstName || ""} ${
                        selectedUser?.lastName || ""
                      }`.trim() ||
                      "Unknown User"}
                  </span>
                </p>
                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => handleRoleChange(selectedUser, "patient")}
                    className={`w-full py-3 px-4 rounded-lg border-2 transition-colors ${
                      selectedUser.role === "patient"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 cursor-not-allowed"
                        : "border-gray-300 hover:border-emerald-300 hover:bg-emerald-50"
                    }`}
                    disabled={selectedUser.role === "patient"}
                  >
                    Patient
                  </button>
                  <button
                    onClick={() => handleRoleChange(selectedUser, "doctor")}
                    className={`w-full py-3 px-4 rounded-lg border-2 transition-colors ${
                      selectedUser.role === "doctor"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 cursor-not-allowed"
                        : "border-gray-300 hover:border-emerald-300 hover:bg-emerald-50"
                    }`}
                    disabled={selectedUser.role === "doctor"}
                  >
                    Doctor
                  </button>
                  <button
                    onClick={() => handleRoleChange(selectedUser, "admin")}
                    className={`w-full py-3 px-4 rounded-lg border-2 transition-colors ${
                      selectedUser.role === "admin"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 cursor-not-allowed"
                        : "border-gray-300 hover:border-emerald-300 hover:bg-emerald-50"
                    }`}
                    disabled={selectedUser.role === "admin"}
                  >
                    Admin
                  </button>
                </div>
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Approve Application Modal */}
        {showApproveModal && selectedApplication && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-auto shadow-2xl">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-4">
                  <svg
                    className="h-8 w-8 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Approve Doctor Application
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to approve{" "}
                  <span className="font-semibold">
                    {selectedApplication?.fullName ||
                      selectedApplication?.name ||
                      "Unknown Doctor"}
                  </span>
                  's application?
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() =>
                      handleApproveApplication(selectedApplication)
                    }
                    className="flex-1 bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-200"
                  >
                    Yes, Approve
                  </button>
                  <button
                    onClick={() => setShowApproveModal(false)}
                    className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Doctor Details Modal */}
        {showDetailsModal && selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-auto shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Doctor Application Details
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Comprehensive information about the applicant
                  </p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Personal Information */}
                <div className="border rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Full Name
                      </label>
                      <p className="text-gray-900">
                        {selectedApplication.fullName || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Email
                      </label>
                      <p className="text-gray-900">
                        {selectedApplication.email || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Phone
                      </label>
                      <p className="text-gray-900">
                        {selectedApplication.phone || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Gender
                      </label>
                      <p className="text-gray-900">
                        {selectedApplication.gender || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="border rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Professional Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Specialization
                      </label>
                      <p className="text-gray-900">
                        {selectedApplication.specialization || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Experience
                      </label>
                      <p className="text-gray-900">
                        {selectedApplication.experience
                          ? `${selectedApplication.experience} years`
                          : "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        License Number
                      </label>
                      <p className="text-gray-900">
                        {selectedApplication.licenseNumber || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Consultation Fee
                      </label>
                      <p className="text-gray-900">
                        {selectedApplication.consultationFee
                          ? `₹${selectedApplication.consultationFee}`
                          : "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Qualifications
                    </label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded">
                      {selectedApplication.qualifications || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Location Information */}
                <div className="border rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Location Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        State
                      </label>
                      <p className="text-gray-900">
                        {selectedApplication.state || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        City
                      </label>
                      <p className="text-gray-900">
                        {selectedApplication.city || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Clinic Name
                      </label>
                      <p className="text-gray-900">
                        {selectedApplication.clinicName || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Clinic Address
                    </label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded">
                      {selectedApplication.clinicAddress || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Application Status */}
                <div className="border rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Application Status
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Status
                      </label>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          selectedApplication.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : selectedApplication.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {selectedApplication.status}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Application Date
                      </label>
                      <p className="text-gray-900">
                        {selectedApplication.submittedAt?.toDate
                          ? selectedApplication.submittedAt
                              .toDate()
                              .toLocaleDateString()
                          : selectedApplication.appliedDate
                          ? new Date(
                              selectedApplication.appliedDate
                            ).toLocaleDateString()
                          : "Unknown date"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Close
                </button>
                {selectedApplication.status === "pending" && (
                  <>
                    <button
                      onClick={() => {
                        setShowDetailsModal(false);
                        handleRejectApplication(selectedApplication);
                      }}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Reject Application
                    </button>
                    <button
                      onClick={() => {
                        setShowDetailsModal(false);
                        setShowApproveModal(true);
                      }}
                      className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                    >
                      Approve Application
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
