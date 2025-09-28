"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

// Mock data - replace with actual API calls
const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "patient",
    status: "active",
  },
  {
    id: 2,
    name: "Dr. Sarah Smith",
    email: "sarah@example.com",
    role: "doctor",
    status: "pending",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "patient",
    status: "active",
  },
  {
    id: 4,
    name: "Dr. Robert Brown",
    email: "robert@example.com",
    role: "doctor",
    status: "approved",
  },
  {
    id: 5,
    name: "Dr. Emily Davis",
    email: "emily@example.com",
    role: "doctor",
    status: "pending",
  },
];

const mockDoctorApplications = [
  {
    id: 1,
    name: "Dr. Sarah Smith",
    email: "sarah@example.com",
    specialization: "Cardiologist",
    experience: "8 years",
    qualifications: "MBBS, MD",
    licenseNumber: "MED123456",
    appliedDate: "2024-01-15",
    status: "pending",
  },
  {
    id: 2,
    name: "Dr. Emily Davis",
    email: "emily@example.com",
    specialization: "Pediatrician",
    experience: "5 years",
    qualifications: "MBBS, DCH",
    licenseNumber: "MED789012",
    appliedDate: "2024-01-16",
    status: "pending",
  },
  {
    id: 3,
    name: "Dr. Michael Wilson",
    email: "michael@example.com",
    specialization: "Orthopedic Surgeon",
    experience: "12 years",
    qualifications: "MBBS, MS",
    licenseNumber: "MED345678",
    appliedDate: "2024-01-14",
    status: "pending",
  },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState(mockUsers);
  const [applications, setApplications] = useState(mockDoctorApplications);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const router = useRouter();

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter applications based on search term
  const filteredApplications = applications.filter(
    (app) =>
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleChange = (user, newRole) => {
    setUsers(
      users.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
    );
    setShowRoleModal(false);
    setSelectedUser(null);
    // Here you would typically make an API call to update the user role
  };

  const handleApproveApplication = (application) => {
    setApplications(
      applications.map((app) =>
        app.id === application.id ? { ...app, status: "approved" } : app
      )
    );
    setUsers(
      users.map((user) =>
        user.email === application.email
          ? { ...user, role: "doctor", status: "approved" }
          : user
      )
    );
    setShowApproveModal(false);
    setSelectedApplication(null);
    // Here you would typically make an API call to update the application status
  };

  const handleRejectApplication = (application) => {
    setApplications(applications.filter((app) => app.id !== application.id));
    setShowApproveModal(false);
    setSelectedApplication(null);
    // Here you would typically make an API call to reject the application
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <div className="bg-emerald-600/25 text-emerald-600 p-4 rounded-full">
            <UserCog className="w-14 h-14 "/>
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

        {/* Content */}
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
                            <div className="flex-shrink-0 h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                              <span className="text-emerald-600 font-medium">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
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
                                : "bg-blue-100 text-blue-800"
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
                            {application.name}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              application.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {application.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Email:</span>{" "}
                            {application.email}
                          </div>
                          <div>
                            <span className="font-medium">Specialization:</span>{" "}
                            {application.specialization}
                          </div>
                          <div>
                            <span className="font-medium">Experience:</span>{" "}
                            {application.experience}
                          </div>
                          <div>
                            <span className="font-medium">License:</span>{" "}
                            {application.licenseNumber}
                          </div>
                        </div>
                        <div className="mt-3">
                          <span className="font-medium text-sm">
                            Qualifications:
                          </span>
                          <p className="text-sm text-gray-600">
                            {application.qualifications}
                          </p>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          Applied on:{" "}
                          {new Date(
                            application.appliedDate
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {application.status === "pending" && (
                      <div className="mt-4 flex space-x-3">
                        <button
                          onClick={() => {
                            setSelectedApplication(application);
                            setShowApproveModal(true);
                          }}
                          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                        >
                          Approve Application
                        </button>
                        <button
                          onClick={() => handleRejectApplication(application)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                          Reject
                        </button>
                        <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium">
                          View Details
                        </button>
                      </div>
                    )}
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
                        {users.length}
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
                        {users.filter((u) => u.role === "doctor").length}
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
                        {
                          applications.filter((app) => app.status === "pending")
                            .length
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Role Change Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                <span className="font-semibold">{selectedUser.name}</span>
              </p>
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handleRoleChange(selectedUser, "patient")}
                  className={`w-full py-3 px-4 rounded-lg border-2 transition-colors ${
                    selectedUser.role === "patient"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-gray-300 hover:border-emerald-300 hover:bg-emerald-50"
                  }`}
                >
                  Patient
                </button>
                <button
                  onClick={() => handleRoleChange(selectedUser, "doctor")}
                  className={`w-full py-3 px-4 rounded-lg border-2 transition-colors ${
                    selectedUser.role === "doctor"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-gray-300 hover:border-emerald-300 hover:bg-emerald-50"
                  }`}
                >
                  Doctor
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                  {selectedApplication.name}
                </span>
                's application?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleApproveApplication(selectedApplication)}
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
    </div>
  );
}
