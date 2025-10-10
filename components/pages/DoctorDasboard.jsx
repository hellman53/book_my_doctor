"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  writeBatch,
  deleteDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "@/app/firebase/config";
import VideoCallWrapper from "@/components/VideoCallWrapper";
import { toast } from "react-hot-toast";
import {
  Calendar,
  Clock,
  Video,
  User,
  MapPin,
  DollarSign,
  Settings,
  BarChart3,
  Bell,
  X,
  Save,
  Trash2,
  Edit,
  ToggleLeft,
  ToggleRight,
  Wallet,
  AlertCircle,
  CheckCircle,
  Star,
  Stethoscope,
  Users,
  Phone,
  Monitor,
  Building2,
  Play,
  Eye,
  Search,
  Filter,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Download,
  MessageCircle,
} from "lucide-react";
import VideoCall from "@/components/VideoCall";
import FloatingActionButton from "@/components/HomeComponent/FloatingActionButton";

export default function DoctorDashboard() {
  const { user: currentUser, isLoaded } = useUser();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [appointments, setAppointments] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [cancelledRevenue, setCancelledRevenue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeVideoCall, setActiveVideoCall] = useState(null);

  // Schedule settings
  const [scheduleSettings, setScheduleSettings] = useState({
    virtual: {
      enabled: true,
      slotDuration: 30,
      availability: [],
    },
    inPerson: {
      enabled: true,
      slotDuration: 30,
      availability: [],
    },
    general: {
      appointments: [],
    },
  });

  // Form states
  const [newAppointment, setNewAppointment] = useState({
    type: "general",
    date: "",
    startTime: "",
    endTime: "",
    patientName: "",
    patientEmail: "",
    notes: "",
    fee: 0,
  });

  const [cancellationRange, setCancellationRange] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    if (currentUser && isLoaded) {
      fetchDoctorData();
    }
  }, [currentUser, isLoaded]);

  const fetchDoctorData = async () => {
    try {
      const doctorDoc = await getDoc(doc(db, "doctors", currentUser.id));
      if (doctorDoc.exists()) {
        const doctorData = { id: doctorDoc.id, ...doctorDoc.data() };
        setDoctor(doctorData);

        // Load schedule settings
        if (doctorData.scheduleSettings) {
          setScheduleSettings(doctorData.scheduleSettings);
        }

        // Fetch appointments
        await fetchAppointments(currentUser.id);

        // Calculate revenue
        await calculateRevenue(currentUser.id);
      }
    } catch (error) {
      console.error("Error fetching doctor data:", error);
      toast.error("Error loading dashboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async (doctorId) => {
    try {
      const appointmentsRef = collection(db, "appointments");
      const q = query(
        appointmentsRef, 
        where("doctorId", "==", doctorId),
        // orderBy("createdAt", "desc") // Sort by creation date, newest first
      );

      const querySnapshot = await getDocs(q);
      const appointmentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Additional sorting by appointment date and time (newest first)
      appointmentsData.sort((a, b) => {
        const dateA = new Date(`${a.appointmentDate}T${a.appointmentTime}`);
        const dateB = new Date(`${b.appointmentDate}T${b.appointmentTime}`);
        return dateB - dateA;
      });

      setAppointments(appointmentsData);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const calculateRevenue = async (doctorId) => {
    try {
      const appointmentsRef = collection(db, "appointments");
      const q = query(
        appointmentsRef,
        where("doctorId", "==", doctorId),
        where("status", "==", "confirmed")
      );

      const querySnapshot = await getDocs(q);
      let totalRevenue = 0;
      let totalCancelled = 0;

      querySnapshot.forEach((doc) => {
        const appointment = doc.data();
        if (appointment.consultationFee) {
          totalRevenue += appointment.consultationFee;
        }
      });

      // Calculate cancelled appointments revenue
      const cancelledQ = query(
        appointmentsRef,
        where("doctorId", "==", doctorId),
        where("status", "==", "cancelled")
      );

      const cancelledSnapshot = await getDocs(cancelledQ);
      cancelledSnapshot.forEach((doc) => {
        const appointment = doc.data();
        if (appointment.consultationFee) {
          totalCancelled += appointment.consultationFee;
        }
      });

      setRevenue(totalRevenue);
      setCancelledRevenue(totalCancelled);
    } catch (error) {
      console.error("Error calculating revenue:", error);
    }
  };

  const saveScheduleSettings = async () => {
    try {
      await updateDoc(doc(db, "doctors", currentUser.id), {
        scheduleSettings: scheduleSettings,
        updatedAt: serverTimestamp(),
      });
      toast.success("Schedule settings saved successfully!");
    } catch (error) {
      console.error("Error saving schedule settings:", error);
      toast.error("Error saving settings");
    }
  };

  const toggleAppointmentType = (type) => {
    setScheduleSettings((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        enabled: !prev[type].enabled,
      },
    }));
  };

  const updateSlotDuration = (type, duration) => {
    setScheduleSettings((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        slotDuration: duration,
      },
    }));
  };

  const addAvailability = (type, day, startTime, endTime) => {
    setScheduleSettings((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        availability: [...prev[type].availability, { day, startTime, endTime }],
      },
    }));
  };

  const removeAvailability = (type, index) => {
    setScheduleSettings((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        availability: prev[type].availability.filter((_, i) => i !== index),
      },
    }));
  };

  const addGeneralAppointment = async () => {
    if (
      !newAppointment.date ||
      !newAppointment.startTime ||
      !newAppointment.endTime
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const appointmentData = {
        doctorId: currentUser.id,
        doctorName: doctor.fullName,
        patientName: newAppointment.patientName || "General Appointment",
        patientEmail: newAppointment.patientEmail || "",
        appointmentDate: newAppointment.date,
        appointmentTime: newAppointment.startTime,
        endTime: newAppointment.endTime,
        appointmentType: "general",
        status: "confirmed",
        patientNotes: newAppointment.notes,
        consultationFee: newAppointment.fee || doctor.consultationFee,
        isGeneral: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, "appointments"), appointmentData);

      toast.success("General appointment added successfully!");
      fetchAppointments(currentUser.id);

      setNewAppointment({
        type: "general",
        date: "",
        startTime: "",
        endTime: "",
        patientName: "",
        patientEmail: "",
        notes: "",
        fee: 0,
      });
    } catch (error) {
      console.error("Error adding general appointment:", error);
      toast.error("Error adding appointment");
    }
  };

  const cancelAppointment = async (appointmentId, refundAmount) => {
    try {
      // Update appointment status
      await updateDoc(doc(db, "appointments", appointmentId), {
        status: "cancelled",
        cancelledAt: serverTimestamp(),
        refundAmount: refundAmount,
      });

      toast.success("Appointment cancelled successfully!");
      fetchAppointments(currentUser.id);
      calculateRevenue(currentUser.id);
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error("Error cancelling appointment");
    }
  };

  const cancelAppointmentsInRange = async () => {
    if (
      !cancellationRange.date ||
      !cancellationRange.startTime ||
      !cancellationRange.endTime
    ) {
      toast.error("Please select date and time range");
      return;
    }

    try {
      const appointmentsRef = collection(db, "appointments");
      const q = query(
        appointmentsRef,
        where("doctorId", "==", currentUser.id),
        where("appointmentDate", "==", cancellationRange.date),
        where("status", "in", ["confirmed", "pending"])
      );

      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);
      let cancelledCount = 0;

      querySnapshot.forEach((doc) => {
        const appointment = doc.data();
        const appointmentTime = appointment.appointmentTime;

        if (
          appointmentTime >= cancellationRange.startTime &&
          appointmentTime <= cancellationRange.endTime
        ) {
          batch.update(doc.ref, {
            status: "cancelled",
            cancelledAt: serverTimestamp(),
            refundAmount: appointment.consultationFee,
          });
          cancelledCount++;
        }
      });

      await batch.commit();

      setCancellationRange({
        date: "",
        startTime: "",
        endTime: "",
      });

      toast.success(`Cancelled ${cancelledCount} appointments successfully!`);
      fetchAppointments(currentUser.id);
      calculateRevenue(currentUser.id);
    } catch (error) {
      console.error("Error cancelling appointments:", error);
      toast.error("Error cancelling appointments");
    }
  };

  const joinVideoCall = async (appointment) => {
    try {
      // Check if it's a virtual appointment
      if (appointment.appointmentType !== "virtual") {
        toast.error("Video calls are only available for virtual appointments");
        return;
      }

      // Check if appointment is confirmed
      if (appointment.status !== "confirmed") {
        toast.error("Can only join confirmed appointments");
        return;
      }

      let zegoCloudData = appointment.zegoCloudData;

      // Generate ZegoCloud data if not exists
      if (!zegoCloudData) {
        zegoCloudData = await generateZegoCloudRoom(appointment.id);

        // Update appointment with ZegoCloud data
        await updateDoc(doc(db, "appointments", appointment.id), {
          zegoCloudData: zegoCloudData,
          updatedAt: serverTimestamp(),
        });
      }

      // Validate ZegoCloud data
      if (!zegoCloudData.roomID) {
        throw new Error("Invalid room configuration");
      }

      // Start video call with generated data
      setActiveVideoCall({
        roomID: zegoCloudData.roomID,
        appointmentId: appointment.id,
        patientName: appointment.patientName,
      });

      toast.success("Joining video call...");
    } catch (error) {
      console.error("Error joining video call:", error);
      toast.error("Error starting video call. Please try again.");
    }
  };

  const generateZegoCloudRoom = async (appointmentId) => {
    try {
      // Generate a unique room ID based on appointment ID
      const roomID = `appointment_${appointmentId}_${Date.now()}`;

      // Your ZegoCloud credentials
      const appID = process.env.NEXT_PUBLIC_ZEGOCLOUD_APP_ID;
      const serverSecret = process.env.NEXT_PUBLIC_ZEGOCLOUD_SERVER_SECRET;

      if (!appID || !serverSecret) {
        throw new Error("ZegoCloud credentials not configured");
      }

      return {
        roomID,
        appID: parseInt(appID),
        serverSecret,
      };
    } catch (error) {
      console.error("Error generating ZegoCloud room:", error);
      throw error;
    }
  };

  const leaveVideoCall = () => {
    setActiveVideoCall(null);
    toast.success("Left the video call");
  };

  const viewAppointmentDetails = (appointment) => {
    // You can implement a modal or separate page for detailed view
    toast.success(
      `Viewing details for ${appointment.patientName}'s appointment`
    );
  };

  // Filter appointments based on search and status
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patientName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.patientEmail
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Doctor Not Found
          </h2>
          <p className="text-gray-600">
            Please complete your doctor profile first.
          </p>
        </div>
      </div>
    );
  }

  // Render video call if active
  if (activeVideoCall) {
    return (
      <VideoCallWrapper
        roomID={activeVideoCall.roomID}
        userID={currentUser.id}
        userName={`Dr. ${doctor.fullName}`}
        onLeave={leaveVideoCall}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20">
      <FloatingActionButton />
      
      {/* Header */}
      <div className="relative bg-gradient-to-r from-emerald-600 to-blue-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-emerald-700 bg-opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Welcome, Dr. {doctor.fullName}
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto lg:mx-0">
              Manage your practice, appointments, and patient care in one place
            </p>
            <div className="mt-6 flex items-center justify-center lg:justify-start gap-4">
              <div className="bg-white text-emerald-700 bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="font-semibold">
                  {appointments.filter(a => a.status === "confirmed").length} Upcoming Appointments
                </span>
              </div>
              <div className="bg-white bg-opacity-20 text-emerald-700 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="font-semibold">
                  ₹{revenue} Total Revenue
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

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="overflow-x-auto">
            <nav className="flex space-x-8 min-w-max">
              {[
                { id: "overview", name: "Overview", icon: BarChart3 },
                { id: "appointments", name: "Appointments", icon: Calendar },
                { id: "schedule", name: "Schedule", icon: Clock },
                { id: "revenue", name: "Revenue", icon: DollarSign },
                { id: "settings", name: "Settings", icon: Settings },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-6 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? "border-emerald-500 text-emerald-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Appointments
                    </p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {appointments.filter((a) => a.status === "confirmed").length}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Virtual Appointments
                    </p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {
                        appointments.filter(
                          (a) =>
                            a.appointmentType === "virtual" &&
                            a.status === "confirmed"
                        ).length
                      }
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Video className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      In-Person Appointments
                    </p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {
                        appointments.filter(
                          (a) =>
                            a.appointmentType === "personal" &&
                            a.status === "confirmed"
                        ).length
                      }
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Revenue
                    </p>
                    <p className="text-2xl lg:text-3xl font-bold text-emerald-600">
                      ₹{revenue}
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-xl">
                    <DollarSign className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                  Today's Appointments
                </h3>
                <div className="space-y-4">
                  {appointments
                    .filter(
                      (a) =>
                        a.appointmentDate ===
                          new Date().toISOString().split("T")[0] &&
                        a.status === "confirmed"
                    )
                    .slice(0, 5)
                    .map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-emerald-50 hover:border-emerald-200 transition-colors"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">
                            {appointment.patientName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {appointment.appointmentTime}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium ${
                            appointment.appointmentType === "virtual"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {appointment.appointmentType}
                        </span>
                      </div>
                    ))}
                  {appointments.filter(
                    (a) =>
                      a.appointmentDate ===
                      new Date().toISOString().split("T")[0]
                  ).length === 0 && (
                    <p className="text-gray-500 text-center py-8">
                      No appointments today
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-emerald-600" />
                  Revenue Overview
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">Total Revenue</span>
                    <span className="font-bold text-emerald-600">₹{revenue}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">Cancelled Revenue</span>
                    <span className="font-bold text-red-600">-₹{cancelledRevenue}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200">
                    <span className="text-gray-900 font-semibold">Net Revenue</span>
                    <span className="text-xl font-bold text-blue-600">
                      ₹{revenue - cancelledRevenue}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === "appointments" && (
          <AppointmentsManager
            appointments={filteredAppointments}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onCancel={cancelAppointment}
            onJoinVideoCall={joinVideoCall}
            onViewDetails={viewAppointmentDetails}
            cancellationRange={cancellationRange}
            setCancellationRange={setCancellationRange}
            onBulkCancel={cancelAppointmentsInRange}
          />
        )}

        {/* Schedule Settings Tab */}
        {activeTab === "schedule" && (
          <ScheduleManager
            scheduleSettings={scheduleSettings}
            toggleAppointmentType={toggleAppointmentType}
            updateSlotDuration={updateSlotDuration}
            addAvailability={addAvailability}
            removeAvailability={removeAvailability}
            newAppointment={newAppointment}
            setNewAppointment={setNewAppointment}
            onAddGeneralAppointment={addGeneralAppointment}
            onSaveSettings={saveScheduleSettings}
            doctor={doctor}
          />
        )}

        {/* Revenue Tab */}
        {activeTab === "revenue" && (
          <RevenueManager
            revenue={revenue}
            cancelledRevenue={cancelledRevenue}
            appointments={appointments}
          />
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && <SettingsManager doctor={doctor} />}
      </div>
    </div>
  );
}

// Appointments Manager Component
function AppointmentsManager({
  appointments,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onCancel,
  onJoinVideoCall,
  onViewDetails,
  cancellationRange,
  setCancellationRange,
  onBulkCancel,
}) {
  const [activeAppointmentType, setActiveAppointmentType] = useState("all");

  const filteredByType = appointments.filter(
    (appointment) =>
      activeAppointmentType === "all" ||
      appointment.appointmentType === activeAppointmentType
  );

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
        return <X className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>

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
              { id: "all", name: "All Appointments", icon: Calendar, count: appointments.length },
              { id: "virtual", name: "Virtual", icon: Video, count: appointments.filter(a => a.appointmentType === "virtual").length },
              { id: "personal", name: "In-Person", icon: MapPin, count: appointments.filter(a => a.appointmentType === "personal").length },
              { id: "general", name: "General", icon: Users, count: appointments.filter(a => a.appointmentType === "general").length },
            ].map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setActiveAppointmentType(type.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                    activeAppointmentType === type.id
                      ? "bg-emerald-500 text-white shadow-lg transform scale-105"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:transform hover:scale-105"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{type.name}</span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      activeAppointmentType === type.id
                        ? "bg-white text-emerald-600"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {type.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bulk Cancellation */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          Bulk Cancellation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={cancellationRange.date}
              onChange={(e) =>
                setCancellationRange((prev) => ({
                  ...prev,
                  date: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time
            </label>
            <input
              type="time"
              value={cancellationRange.startTime}
              onChange={(e) =>
                setCancellationRange((prev) => ({
                  ...prev,
                  startTime: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Time
            </label>
            <input
              type="time"
              value={cancellationRange.endTime}
              onChange={(e) =>
                setCancellationRange((prev) => ({
                  ...prev,
                  endTime: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={onBulkCancel}
              className="w-full bg-red-600 text-white px-4 py-3 rounded-xl hover:bg-red-700 transition-colors font-semibold"
            >
              Cancel Appointments
            </button>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold">
            {activeAppointmentType === "all"
              ? "All"
              : activeAppointmentType.charAt(0).toUpperCase() +
                activeAppointmentType.slice(1)}{" "}
            Appointments
            <span className="text-gray-500 text-sm font-normal ml-2">
              ({filteredByType.length})
            </span>
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredByType.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onCancel={onCancel}
              onJoinVideoCall={onJoinVideoCall}
              onViewDetails={onViewDetails}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
            />
          ))}
          {filteredByType.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No appointments found
              </h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== "all" || activeAppointmentType !== "all"
                  ? "Try adjusting your search or filters to find more appointments."
                  : "You don't have any appointments scheduled yet."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Schedule Manager Component
function ScheduleManager({
  scheduleSettings,
  toggleAppointmentType,
  updateSlotDuration,
  addAvailability,
  removeAvailability,
  newAppointment,
  setNewAppointment,
  onAddGeneralAppointment,
  onSaveSettings,
  doctor,
}) {
  return (
    <div className="space-y-8">
      {/* Virtual Appointments Settings */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <Video className="h-6 w-6 text-green-600" />
            <h3 className="text-xl font-semibold">Virtual Appointments</h3>
          </div>
          <button
            onClick={() => toggleAppointmentType("virtual")}
            className="flex items-center gap-2"
          >
            {scheduleSettings.virtual.enabled ? (
              <ToggleRight className="h-6 w-6 text-green-600" />
            ) : (
              <ToggleLeft className="h-6 w-6 text-gray-400" />
            )}
            <span className="text-sm font-medium">
              {scheduleSettings.virtual.enabled ? "Enabled" : "Disabled"}
            </span>
          </button>
        </div>

        {scheduleSettings.virtual.enabled && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slot Duration (minutes)
              </label>
              <select
                value={scheduleSettings.virtual.slotDuration}
                onChange={(e) =>
                  updateSlotDuration("virtual", parseInt(e.target.value))
                }
                className="w-full max-w-xs border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>

            <AvailabilityManager
              type="virtual"
              availability={scheduleSettings.virtual.availability}
              onAdd={addAvailability}
              onRemove={removeAvailability}
            />
          </div>
        )}
      </div>

      {/* In-Person Appointments Settings */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <MapPin className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-semibold">In-Person Appointments</h3>
          </div>
          <button
            onClick={() => toggleAppointmentType("inPerson")}
            className="flex items-center gap-2"
          >
            {scheduleSettings.inPerson.enabled ? (
              <ToggleRight className="h-6 w-6 text-green-600" />
            ) : (
              <ToggleLeft className="h-6 w-6 text-gray-400" />
            )}
            <span className="text-sm font-medium">
              {scheduleSettings.inPerson.enabled ? "Enabled" : "Disabled"}
            </span>
          </button>
        </div>

        {scheduleSettings.inPerson.enabled && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slot Duration (minutes)
              </label>
              <select
                value={scheduleSettings.inPerson.slotDuration}
                onChange={(e) =>
                  updateSlotDuration("inPerson", parseInt(e.target.value))
                }
                className="w-full max-w-xs border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>

            <AvailabilityManager
              type="inPerson"
              availability={scheduleSettings.inPerson.availability}
              onAdd={addAvailability}
              onRemove={removeAvailability}
            />
          </div>
        )}
      </div>

      {/* General Appointments */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="h-6 w-6 text-purple-600" />
          <h3 className="text-xl font-semibold">General Appointments</h3>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={newAppointment.date}
                onChange={(e) =>
                  setNewAppointment((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fee (₹)
              </label>
              <input
                type="number"
                value={newAppointment.fee}
                onChange={(e) =>
                  setNewAppointment((prev) => ({
                    ...prev,
                    fee: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                placeholder={doctor.consultationFee}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={newAppointment.startTime}
                onChange={(e) =>
                  setNewAppointment((prev) => ({
                    ...prev,
                    startTime: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <input
                type="time"
                value={newAppointment.endTime}
                onChange={(e) =>
                  setNewAppointment((prev) => ({
                    ...prev,
                    endTime: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient Name (Optional)
              </label>
              <input
                type="text"
                value={newAppointment.patientName}
                onChange={(e) =>
                  setNewAppointment((prev) => ({
                    ...prev,
                    patientName: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                placeholder="General Appointment"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient Email (Optional)
              </label>
              <input
                type="email"
                value={newAppointment.patientEmail}
                onChange={(e) =>
                  setNewAppointment((prev) => ({
                    ...prev,
                    patientEmail: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={newAppointment.notes}
              onChange={(e) =>
                setNewAppointment((prev) => ({
                  ...prev,
                  notes: e.target.value,
                }))
              }
              rows={4}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>

          <button
            onClick={onAddGeneralAppointment}
            className="bg-emerald-600 text-white px-8 py-3 rounded-xl hover:bg-emerald-700 transition-colors font-semibold"
          >
            Add General Appointment
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onSaveSettings}
          className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
        >
          <Save className="h-5 w-5" />
          Save All Changes
        </button>
      </div>
    </div>
  );
}

// Revenue Manager Component
function RevenueManager({ revenue, cancelledRevenue, appointments }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl lg:text-3xl font-bold text-emerald-600">
                ₹{revenue}
              </p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-xl">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Cancelled Revenue
              </p>
              <p className="text-2xl lg:text-3xl font-bold text-red-600">
                -₹{cancelledRevenue}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Revenue</p>
              <p className="text-2xl lg:text-3xl font-bold text-blue-600">
                ₹{revenue - cancelledRevenue}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Wallet className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-semibold mb-6">Revenue Breakdown</h3>
        <div className="space-y-4">
          {appointments
            .filter((a) => a.status === "confirmed")
            .map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-semibold text-gray-900">{appointment.patientName}</p>
                  <p className="text-sm text-gray-600">
                    {appointment.appointmentDate} at {appointment.appointmentTime}
                  </p>
                  <span
                    className={`inline-block px-3 py-1 text-xs rounded-full font-medium mt-1 ${
                      appointment.appointmentType === "virtual"
                        ? "bg-green-100 text-green-800"
                        : appointment.appointmentType === "personal"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {appointment.appointmentType}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-emerald-600">
                    ₹{appointment.consultationFee}
                  </p>
                  <p className="text-sm text-green-600 font-medium">Completed</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

// Settings Manager Component
function SettingsManager({ doctor }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-xl font-semibold mb-6">Profile Settings</h3>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Consultation Fee (₹)
            </label>
            <input
              type="number"
              defaultValue={doctor.consultationFee}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialization
            </label>
            <input
              type="text"
              defaultValue={doctor.specialization}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>
        <button className="bg-emerald-600 text-white px-8 py-3 rounded-xl hover:bg-emerald-700 transition-colors font-semibold">
          Update Profile
        </button>
      </div>
    </div>
  );
}

// Availability Manager Component
function AvailabilityManager({ type, availability, onAdd, onRemove }) {
  const [newSlot, setNewSlot] = useState({
    day: "Monday",
    startTime: "09:00",
    endTime: "17:00",
  });

  const handleAdd = () => {
    onAdd(type, newSlot.day, newSlot.startTime, newSlot.endTime);
    setNewSlot({ day: "Monday", startTime: "09:00", endTime: "17:00" });
  };

  return (
    <div>
      <h4 className="text-lg font-semibold mb-4">Weekly Availability</h4>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Day
          </label>
          <select
            value={newSlot.day}
            onChange={(e) =>
              setNewSlot((prev) => ({ ...prev, day: e.target.value }))
            }
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
          >
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Time
          </label>
          <input
            type="time"
            value={newSlot.startTime}
            onChange={(e) =>
              setNewSlot((prev) => ({ ...prev, startTime: e.target.value }))
            }
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Time
          </label>
          <input
            type="time"
            value={newSlot.endTime}
            onChange={(e) =>
              setNewSlot((prev) => ({ ...prev, endTime: e.target.value }))
            }
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={handleAdd}
            className="w-full bg-gray-600 text-white px-4 py-3 rounded-xl hover:bg-gray-700 transition-colors font-semibold"
          >
            Add Slot
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {availability.map((slot, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-emerald-50 hover:border-emerald-200 transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="font-medium min-w-20">{slot.day}</span>
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="font-medium">
                {slot.startTime} - {slot.endTime}
              </span>
            </div>
            <button
              onClick={() => onRemove(type, index)}
              className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        {availability.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            No availability slots added
          </p>
        )}
      </div>
    </div>
  );
}

// Appointment Card Component
function AppointmentCard({
  appointment,
  onCancel,
  onJoinVideoCall,
  onViewDetails,
  getStatusColor,
  getStatusIcon,
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

  const canJoinVideoCall =
    appointment.status === "confirmed" &&
    appointment.appointmentType === "virtual" &&
    (appointment.zegoCloudData || appointment.vonageSessionId);

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <p className="font-semibold text-lg text-gray-900">{appointment.patientName}</p>
            <div className="flex gap-2">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full border ${getStatusColor(
                  appointment.status
                )}`}
              >
                {getStatusIcon(appointment.status)}
                <span className="font-medium capitalize">{appointment.status}</span>
              </span>
              <span
                className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
                  appointment.appointmentType === "virtual"
                    ? "bg-green-100 text-green-800"
                    : appointment.appointmentType === "personal"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-purple-100 text-purple-800"
                }`}
              >
                {appointment.appointmentType}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-1">
            {appointment.patientEmail}
          </p>
          <p className="text-sm text-gray-600">
            {formatDate(appointment.appointmentDate)} at {formatTime(appointment.appointmentTime)}
          </p>

          {appointment.patientNotes && (
            <p className="text-sm text-gray-600 mt-2">
              Notes: {appointment.patientNotes}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-3">
          <p className="font-bold text-lg text-emerald-600">₹{appointment.consultationFee}</p>

          <div className="flex gap-2">
            {canJoinVideoCall && (
              <button
                onClick={() => onJoinVideoCall(appointment)}
                className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
                title="Join video consultation"
              >
                <Video className="h-4 w-4" />
                Join Call
              </button>
            )}

            <button
              onClick={() => onViewDetails(appointment)}
              className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Eye className="h-4 w-4" />
              View
            </button>

            {isUpcoming && (
              <button
                onClick={() => onCancel(appointment.id, appointment.consultationFee)}
                className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}