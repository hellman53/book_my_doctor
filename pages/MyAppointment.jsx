"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { toast } from "react-hot-toast";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  User,
  Search,
  Filter,
  Play,
  Phone,
  MessageCircle,
  Star,
  Download,
  Eye,
  X,
  ChevronRight,
  ChevronLeft,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Stethoscope,
  Building,
  Monitor,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import VideoCall from "@/components/VideoCall";

export default function MyAppointments() {
  const { user: currentUser, isLoaded } = useUser();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeVideoCall, setActiveVideoCall] = useState(null);

  useEffect(() => {
    if (currentUser && isLoaded) {
      fetchAppointments();
    }
  }, [currentUser, isLoaded]);

  const fetchAppointments = async () => {
    try {
      const appointmentsRef = collection(db, "appointments");
      const q = query(
        appointmentsRef,
        where("patientId", "==", currentUser.id)
      );

      const querySnapshot = await getDocs(q);
      const appointmentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort appointments by date and time (newest first)
      appointmentsData.sort((a, b) => {
        const dateA = new Date(`${a.appointmentDate}T${a.appointmentTime}`);
        const dateB = new Date(`${b.appointmentDate}T${b.appointmentTime}`);
        return dateB - dateA;
      });

      setAppointments(appointmentsData);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Error loading appointments");
    } finally {
      setLoading(false);
    }
  };

  const joinVideoCall = (appointment) => {
    if (appointment.zegoCloudData?.roomID || appointment.vonageSessionId) {
      const roomID =
        appointment.zegoCloudData?.roomID || appointment.vonageSessionId;
      setActiveVideoCall({
        roomID,
        appointmentId: appointment.id,
        doctorName: appointment.doctorName,
      });
    } else {
      toast.error("Video call not available for this appointment");
    }
  };

  const leaveVideoCall = () => {
    setActiveVideoCall(null);
    toast.success("Left the video call");
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      await updateDoc(doc(db, "appointments", appointmentId), {
        status: "cancelled",
        cancelledAt: serverTimestamp(),
      });

      toast.success("Appointment cancelled successfully!");
      fetchAppointments();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error("Error cancelling appointment");
    }
  };

  const viewAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  // Check if join button should be shown for an appointment
  const shouldShowJoinButton = (appointment) => {
    if (
      appointment.status !== "confirmed" ||
      appointment.appointmentType !== "virtual"
    ) {
      return false;
    }

    const appointmentDateTime = new Date(
      `${appointment.appointmentDate}T${appointment.appointmentTime}`
    );
    const now = new Date();

    // Calculate time differences in minutes
    const timeUntilAppointment = (appointmentDateTime - now) / (1000 * 60);
    const timeSinceAppointment = (now - appointmentDateTime) / (1000 * 60);

    // Show button 15 minutes before appointment until 1 hour after appointment start
    return timeUntilAppointment <= 15 && timeSinceAppointment <= 60;
  };

  // Filter appointments based on active tab, search, and status
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "virtual" && appointment.appointmentType === "virtual") ||
      (activeTab === "inPerson" && appointment.appointmentType === "personal");

    const matchesSearch =
      appointment.doctorName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.doctorSpecialization
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter;

    return matchesTab && matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "text-green-600 bg-green-50 border-green-200";
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "cancelled":
        return "text-red-600 bg-red-50 border-red-200";
      case "completed":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getAppointmentTypeIcon = (type) => {
    switch (type) {
      case "virtual":
        return <Monitor className="h-5 w-5 text-green-600" />;
      case "personal":
        return <Building className="h-5 w-5 text-blue-600" />;
      default:
        return <Stethoscope className="h-5 w-5 text-purple-600" />;
    }
  };

  // Render Video Call if active
  if (activeVideoCall) {
    return (
      <VideoCall
        roomID={activeVideoCall.roomID}
        userID={currentUser.id}
        userName={`${currentUser.firstName} ${currentUser.lastName}`}
        onLeave={leaveVideoCall}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-emerald-600 to-blue-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-emerald-700 bg-opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              My Appointments
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto lg:mx-0">
              Manage and track all your medical appointments in one place
            </p>
            <div className="mt-6 flex items-center justify-center lg:justify-start gap-4">
              <div className="bg-white text-emerald-700 bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="font-semibold">
                  {appointments.length} Total Appointments
                </span>
              </div>
              <div className="bg-white bg-opacity-20 text-emerald-700 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="font-semibold">
                  {appointments.filter((a) => a.status === "confirmed").length}{" "}
                  Upcoming
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="w-full absolute bottom-0 left-0 right-0 overflow-hidden leading-[0]">
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="w-full h-12 text-slate-50"
          >
            <path
              fill="currentColor"
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search doctors or specializations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-3 rounded-xl hover:bg-emerald-200 transition-colors">
                <Filter className="h-5 w-5" />
                <span className="hidden sm:inline">Filter</span>
              </button>
            </div>
          </div>

          {/* Appointment Type Tabs */}
          <div className="mt-6 overflow-x-auto">
            <div className="flex space-x-2 min-w-max">
              {[
                {
                  id: "all",
                  name: "All Appointments",
                  count: appointments.length,
                },
                {
                  id: "virtual",
                  name: "Virtual Consultations",
                  count: appointments.filter(
                    (a) => a.appointmentType === "virtual"
                  ).length,
                },
                {
                  id: "inPerson",
                  name: "In-Person Visits",
                  count: appointments.filter(
                    (a) => a.appointmentType === "personal"
                  ).length,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-emerald-500 text-white shadow-lg transform scale-105"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:transform hover:scale-105"
                  }`}
                >
                  <span>{tab.name}</span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      activeTab === tab.id
                        ? "bg-white text-emerald-600"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Appointments Grid */}
        {filteredAppointments.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onJoinVideoCall={joinVideoCall}
                onCancel={cancelAppointment}
                onViewDetails={viewAppointmentDetails}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
                getAppointmentTypeIcon={getAppointmentTypeIcon}
                shouldShowJoinButton={shouldShowJoinButton}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="max-w-md mx-auto">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No appointments found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== "all" || activeTab !== "all"
                  ? "Try adjusting your search or filters to find more appointments."
                  : "You don't have any appointments scheduled yet."}
              </p>
              {!searchTerm && statusFilter === "all" && activeTab === "all" && (
                <button
                  onClick={() => (window.location.href = "/doctors")}
                  className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Book Your First Appointment
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Appointment Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          onClose={() => setShowDetailsModal(false)}
          onJoinVideoCall={joinVideoCall}
          onCancel={cancelAppointment}
          getStatusColor={getStatusColor}
          getStatusIcon={getStatusIcon}
          getAppointmentTypeIcon={getAppointmentTypeIcon}
          shouldShowJoinButton={shouldShowJoinButton}
        />
      )}
    </div>
  );
}

// Appointment Card Component
function AppointmentCard({
  appointment,
  onJoinVideoCall,
  onCancel,
  onViewDetails,
  getStatusColor,
  getStatusIcon,
  getAppointmentTypeIcon,
  shouldShowJoinButton,
}) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const isUpcoming =
    appointment.status === "confirmed" &&
    new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}`) >
      new Date();

  const showJoinButton = shouldShowJoinButton(appointment);

  // Calculate time until appointment
  const getTimeUntilAppointment = () => {
    const appointmentDateTime = new Date(
      `${appointment.appointmentDate}T${appointment.appointmentTime}`
    );
    const now = new Date();
    const timeDiff = appointmentDateTime - now;

    if (timeDiff <= 0) return "Meeting in progress";

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return `Starts in ${hours}h ${minutes}m`;
    return `Starts in ${minutes}m`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {getAppointmentTypeIcon(appointment.appointmentType)}
            <div>
              <h3 className="font-semibold text-gray-900">
                Dr. {appointment.doctorName}
              </h3>
              <p className="text-sm text-gray-600">
                {appointment.doctorSpecialization}
              </p>
            </div>
          </div>
          <div
            className={`flex items-center gap-1 px-3 py-1 rounded-full border ${getStatusColor(
              appointment.status
            )}`}
          >
            {getStatusIcon(appointment.status)}
            <span className="text-sm font-medium capitalize">
              {appointment.status}
            </span>
          </div>
        </div>

        {/* Date and Time */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span>{formatDate(appointment.appointmentDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4" />
            <span>{formatTime(appointment.appointmentTime)}</span>
          </div>
        </div>

        {/* Countdown for upcoming appointments */}
        {isUpcoming && (
          <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-blue-700 text-sm">
              <Clock className="h-3 w-3" />
              <span className="font-medium">{getTimeUntilAppointment()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Appointment Type Badge */}
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 ${
            appointment.appointmentType === "virtual"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-blue-50 text-blue-700 border border-blue-200"
          }`}
        >
          {appointment.appointmentType === "virtual" ? (
            <Monitor className="h-4 w-4" />
          ) : (
            <Building className="h-4 w-4" />
          )}
          <span className="text-sm font-medium capitalize">
            {appointment.appointmentType === "virtual"
              ? "Virtual Consultation"
              : "In-Person Visit"}
          </span>
        </div>

        {/* Fee */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">Consultation Fee</span>
          <span className="text-lg font-bold text-emerald-600">
            ₹{appointment.consultationFee}
          </span>
        </div>

        {/* Patient Notes */}
        {appointment.patientNotes && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">Your Notes:</p>
            <p className="text-sm text-gray-800 bg-gray-50 rounded-lg p-3 border border-gray-200">
              {appointment.patientNotes}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => onViewDetails(appointment)}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <Eye className="h-4 w-4" />
            View Details
          </button>

          {showJoinButton && (
            <button
              onClick={() => onJoinVideoCall(appointment)}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors animate-pulse"
            >
              <Video className="h-4 w-4" />
              Join Call
            </button>
          )}

          {isUpcoming && !showJoinButton && (
            <button
              onClick={() => onCancel(appointment.id)}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Appointment Details Modal Component
function AppointmentDetailsModal({
  appointment,
  onClose,
  onJoinVideoCall,
  onCancel,
  getStatusColor,
  getStatusIcon,
  getAppointmentTypeIcon,
  shouldShowJoinButton,
}) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const isUpcoming =
    appointment.status === "confirmed" &&
    new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}`) >
      new Date();

  const showJoinButton = shouldShowJoinButton(appointment);

  // Calculate time until appointment
  const getTimeUntilAppointment = () => {
    const appointmentDateTime = new Date(
      `${appointment.appointmentDate}T${appointment.appointmentTime}`
    );
    const now = new Date();
    const timeDiff = appointmentDateTime - now;

    if (timeDiff <= 0) {
      const timeSinceStart = Math.abs(timeDiff) / (1000 * 60);
      if (timeSinceStart <= 60) {
        return "Meeting in progress - You can join now";
      } else {
        return "Meeting time has passed";
      }
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return `Starts in ${hours}h ${minutes}m`;
    return `Starts in ${minutes}m`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-2xl w-full mx-auto shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Appointment Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Doctor Info */}
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl border border-emerald-200">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Dr. {appointment.doctorName}
              </h3>
              <p className="text-emerald-600 font-medium">
                {appointment.doctorSpecialization}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm text-gray-600">4.8 (128 reviews)</span>
              </div>
            </div>
          </div>

          {/* Time Status */}
          {isUpcoming && (
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-blue-900">
                    Appointment Timing
                  </h4>
                  <p className="text-blue-700 text-sm">
                    {getTimeUntilAppointment()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Appointment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Date & Time
                </h4>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(appointment.appointmentDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(appointment.appointmentTime)}</span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Appointment Type
                </h4>
                <div className="flex items-center gap-2">
                  {getAppointmentTypeIcon(appointment.appointmentType)}
                  <span className="text-gray-600 capitalize">
                    {appointment.appointmentType === "virtual"
                      ? "Virtual Consultation"
                      : "In-Person Visit"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Status</h4>
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-full border w-fit ${getStatusColor(
                    appointment.status
                  )}`}
                >
                  {getStatusIcon(appointment.status)}
                  <span className="font-medium capitalize">
                    {appointment.status}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Consultation Fee
                </h4>
                <p className="text-2xl font-bold text-emerald-600">
                  ₹{appointment.consultationFee}
                </p>
              </div>
            </div>
          </div>

          {/* Patient Notes */}
          {appointment.patientNotes && (
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-2">Your Notes</h4>
              <p className="text-gray-700">{appointment.patientNotes}</p>
            </div>
          )}

          {/* Instructions based on appointment type */}
          {appointment.appointmentType === "virtual" && isUpcoming && (
            <div className="p-4 bg-green-50 rounded-2xl border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">
                Virtual Appointment Instructions
              </h4>
              <ul className="text-green-800 space-y-1 text-sm">
                <li>• Ensure you have a stable internet connection</li>
                <li>• Join the call 5 minutes before the scheduled time</li>
                <li>• Use headphones for better audio quality</li>
                <li>• Find a quiet, well-lit space for the consultation</li>
                {showJoinButton && (
                  <li className="font-semibold text-green-900">
                    • Join button is now available! Click to start your
                    consultation
                  </li>
                )}
              </ul>
            </div>
          )}

          {appointment.appointmentType === "personal" && isUpcoming && (
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">
                Clinic Visit Instructions
              </h4>
              <ul className="text-blue-800 space-y-1 text-sm">
                <li>• Arrive 15 minutes before your scheduled time</li>
                <li>• Bring your ID and any relevant medical reports</li>
                <li>• Wear a mask and follow clinic safety protocols</li>
                <li>• Carry your insurance information if applicable</li>
              </ul>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 rounded-2xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Close
            </button>

            {showJoinButton && (
              <button
                onClick={() => {
                  onJoinVideoCall(appointment);
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-2xl font-semibold hover:bg-green-700 transition-colors animate-pulse"
              >
                <Video className="h-5 w-5" />
                Join Video Call
              </button>
            )}

            {isUpcoming && !showJoinButton && (
              <button
                onClick={() => {
                  onCancel(appointment.id);
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-6 rounded-2xl font-semibold hover:bg-red-700 transition-colors"
              >
                <X className="h-5 w-5" />
                Cancel Appointment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
