"use client";

import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import stripePromise from "@/lib/stripe";
import PaymentModal from "@/components/PaymentModal";
import { useParams, useRouter } from "next/navigation";
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
} from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { toast } from "react-hot-toast";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Award,
  Star,
  Calendar,
  Video,
  User,
  Heart,
  Shield,
  CheckCircle,
  ArrowLeft,
  Stethoscope,
  GraduationCap,
  Building,
  X,
  Users,
  Monitor,
  Building2,
  Sparkles,
} from "lucide-react";
import FloatingActionButton from "@/components/HomeComponent/FloatingActionButton";

export default function DoctorProfile() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser, isLoaded } = useUser();
  const [doctor, setDoctor] = useState(null);
  const [doctorUser, setDoctorUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("virtual");
  const [patientNotes, setPatientNotes] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isTodayAvailable, setIsTodayAvailable] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [appointmentId, setAppointmentId] = useState(null);
  const [availabilityTab, setAvailabilityTab] = useState("virtual");
  const [zegoCloudData, setZegoCloudData] = useState(null); // New state for ZegoCloud data

  const doctorId = params.id;

  // Fetch doctor data
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const doctorDoc = await getDoc(doc(db, "doctors", doctorId));
        const doctorData = await getDoc(doc(db, "users", doctorId));

        if (doctorDoc.exists()) {
          const doctorDataObj = { id: doctorDoc.id, ...doctorDoc.data() };
          setDoctor(doctorDataObj);
          checkTodaysAvailability(doctorDataObj);
        } else {
          toast.error("Doctor not found");
          router.push("/");
          return;
        }

        if (doctorData.exists()) {
          const userData = { id: doctorData.id, ...doctorData.data() };
          setDoctorUser(userData);
          if (userData.role !== "doctor") {
            toast.error("Doctor not found");
            router.push("/");
          }
        } else {
          toast.error("Doctor not found");
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching doctor:", error);
        toast.error("Error loading doctor profile");
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchDoctor();
    }
  }, [doctorId, router]);

  // Generate ZegoCloud session data for virtual appointments
  const generateZegoCloudSession = (appointmentId) => {
    if (appointmentType !== "virtual") return null;

    const roomID = `appointment_${appointmentId}`;
    
    // In a real application, you would generate these server-side for security
    // For demo purposes, we're generating client-side
    const appID = "1088666283"; // This should come from environment variables
    const serverSecret = "a8fd6941cab34415532a1e15671f6628"; // This should come from server-side
    
    return {
      appID,
      roomID,
      serverSecret,
      userID: currentUser?.id || `user_${Date.now()}`,
      userName: currentUser?.fullName || currentUser?.firstName || "Patient",
    };
  };

  // Check if today is available for appointments
  const checkTodaysAvailability = (doctorData) => {
    const today = new Date();
    const todayDay = today.toLocaleDateString("en-US", { weekday: "long" });

    let todayAvailability = null;

    if (doctorData.scheduleSettings) {
      if (doctorData.scheduleSettings.virtual?.enabled) {
        todayAvailability =
          doctorData.scheduleSettings.virtual.availability?.find(
            (avail) => avail.day === todayDay
          );
      }
      if (!todayAvailability && doctorData.scheduleSettings.inPerson?.enabled) {
        todayAvailability =
          doctorData.scheduleSettings.inPerson.availability?.find(
            (avail) => avail.day === todayDay
          );
      }
    }

    if (!todayAvailability && doctorData.availability) {
      todayAvailability = doctorData.availability.find(
        (avail) => avail.day === todayDay
      );
    }

    setIsTodayAvailable(!!todayAvailability);
  };

  // Check if appointment type is enabled
  const isAppointmentTypeEnabled = (type) => {
    if (!doctor?.scheduleSettings) return true;

    if (type === "virtual") {
      return doctor.scheduleSettings.virtual?.enabled !== false;
    } else if (type === "personal") {
      return doctor.scheduleSettings.inPerson?.enabled !== false;
    }
    return true;
  };

  // Get availability for a specific day and appointment type
  const getDayAvailability = (dayOfWeek, type) => {
    if (!doctor) return null;

    if (doctor.scheduleSettings) {
      if (type === "virtual" && doctor.scheduleSettings.virtual?.enabled) {
        return doctor.scheduleSettings.virtual.availability?.find(
          (avail) => avail.day === dayOfWeek
        );
      } else if (
        type === "personal" &&
        doctor.scheduleSettings.inPerson?.enabled
      ) {
        return doctor.scheduleSettings.inPerson.availability?.find(
          (avail) => avail.day === dayOfWeek
        );
      }
    }

    if (doctor.availability) {
      return doctor.availability.find((avail) => avail.day === dayOfWeek);
    }

    return null;
  };

  // Generate available time slots
  const generateTimeSlots = (date, type) => {
    if (!doctor || !date) return [];

    const dayOfWeek = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
    });
    const dayAvailability = getDayAvailability(dayOfWeek, type);
    if (!dayAvailability) return [];

    let slotDuration = 30;
    if (type === "virtual" && doctor.scheduleSettings?.virtual) {
      slotDuration = doctor.scheduleSettings.virtual.slotDuration || 30;
    } else if (type === "personal" && doctor.scheduleSettings?.inPerson) {
      slotDuration = doctor.scheduleSettings.inPerson.slotDuration || 30;
    }

    const slots = [];
    const startTime = new Date(`${date}T${dayAvailability.startTime}`);
    const endTime = new Date(`${date}T${dayAvailability.endTime}`);

    let currentTime = new Date(startTime);
    while (currentTime < endTime) {
      const timeString = currentTime.toTimeString().slice(0, 5);
      slots.push(timeString);
      currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
    }

    return slots;
  };

  // Check if a slot is already booked
  const isSlotBooked = async (date, time) => {
    try {
      const appointmentsRef = collection(db, "appointments");
      const q = query(
        appointmentsRef,
        where("doctorId", "==", doctorId),
        where("appointmentDate", "==", date),
        where("appointmentTime", "==", time),
        where("status", "in", ["confirmed", "pending"])
      );

      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking slot availability:", error);
      return false;
    }
  };

  // Handle date selection
  const handleDateSelect = async (date) => {
    if (!date) return;

    setSelectedDate(date);
    setSelectedTime("");

    if (!isAppointmentTypeEnabled(appointmentType)) {
      toast.error(
        `${
          appointmentType === "virtual" ? "Virtual" : "In-person"
        } appointments are currently not available`
      );
      return;
    }

    const dayOfWeek = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
    });
    const dayAvailability = getDayAvailability(dayOfWeek, appointmentType);

    if (!dayAvailability) {
      toast.error(
        `No ${appointmentType} appointments available for ${dayOfWeek}`
      );
      setAvailableSlots([]);
      return;
    }

    const slots = generateTimeSlots(date, appointmentType);

    if (slots.length === 0) {
      setAvailableSlots([]);
      return;
    }

    const availableSlotsWithStatus = await Promise.all(
      slots.map(async (slot) => {
        const isBooked = await isSlotBooked(date, slot);
        return {
          time: slot,
          available: !isBooked,
        };
      })
    );

    setAvailableSlots(availableSlotsWithStatus);
    setBookingStep(2);
  };

  // Handle appointment type selection
  const handleAppointmentTypeSelect = (type) => {
    if (!isAppointmentTypeEnabled(type)) {
      toast.error(
        `${
          type === "virtual" ? "Virtual" : "In-person"
        } appointments are currently not available`
      );
      return;
    }
    setAppointmentType(type);
    setSelectedDate("");
    setSelectedTime("");
    setAvailableSlots([]);
  };

  // Book appointment
  const handleBookAppointment = () => {
    if (!currentUser) {
      toast.error("Please sign in to book an appointment");
      router.push("/sign-in");
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error("Please select date and time");
      return;
    }

    if (!isAppointmentTypeEnabled(appointmentType)) {
      toast.error(
        `${
          appointmentType === "virtual" ? "Virtual" : "In-person"
        } appointments are currently not available`
      );
      return;
    }

    // Show payment modal instead of directly booking
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (appointmentId) => {
    try {
      // Generate ZegoCloud session data for virtual appointments
      if (appointmentType === "virtual") {
        const zegoCloudSession = generateZegoCloudSession(appointmentId);
        
        if (zegoCloudSession) {
          // Update the appointment document with ZegoCloud data
          const appointmentRef = doc(db, "appointments", appointmentId);
          await updateDoc(appointmentRef, {
            zegoCloudData: zegoCloudSession,
            updatedAt: serverTimestamp(),
          });
          
          setZegoCloudData(zegoCloudSession);
          console.log("ZegoCloud session data added to appointment:", zegoCloudSession);
        }
      }

      setAppointmentId(appointmentId);
      setPaymentSuccess(true);
      setShowPaymentModal(false);
      setShowBookingModal(false);
      setBookingStep(1);
      setSelectedDate("");
      setSelectedTime("");
      setPatientNotes("");

      toast.success("Appointment booked successfully!");
    } catch (error) {
      console.error("Error updating appointment with ZegoCloud data:", error);
      toast.error("Appointment booked but there was an error setting up video call");
    }
  };

  const handleProceedToPayment = () => {
    setShowPaymentModal(true);
  };

  // Format time for display
  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Get appointment type availability status
  const getAppointmentTypeStatus = () => {
    const virtualEnabled = isAppointmentTypeEnabled("virtual");
    const inPersonEnabled = isAppointmentTypeEnabled("personal");

    return {
      virtual: virtualEnabled,
      inPerson: inPersonEnabled,
      bothEnabled: virtualEnabled && inPersonEnabled,
      noneEnabled: !virtualEnabled && !inPersonEnabled,
    };
  };

  // Get minimum date for date input (today)
  const getMinDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  // Toggle favorite
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  // Get availability for display based on selected tab
  const getAvailabilityForDisplay = () => {
    if (!doctor) return [];

    if (availabilityTab === "virtual" && doctor.scheduleSettings?.virtual) {
      return doctor.scheduleSettings.virtual.availability || [];
    } else if (availabilityTab === "inPerson" && doctor.scheduleSettings?.inPerson) {
      return doctor.scheduleSettings.inPerson.availability || [];
    }
    
    // Fallback to old availability structure
    return doctor.availability || [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Doctor Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The doctor you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const appointmentStatus = getAppointmentTypeStatus();
  const displayAvailability = getAvailabilityForDisplay();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 mt-4">
      <FloatingActionButton />
      {/* Navigation */}
      <div className="pt-20 pb-4">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            Back to Search
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-emerald-600 to-emerald-700 text-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 sm:gap-6 lg:gap-8">
            {/* Doctor Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-white bg-opacity-20 rounded-2xl lg:rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30">
                {doctorUser?.profileImage ? (
                  <img
                    src={doctorUser.profileImage}
                    alt={doctorUser.fullName}
                    className="w-full h-full rounded-2xl lg:rounded-3xl object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white opacity-80" />
                )}
              </div>
              <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1 sm:p-1.5">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
            </div>

            {/* Doctor Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="mb-4 lg:mb-6">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2">
                  Dr. {doctor.fullName}
                </h1>
                <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                  <span className="text-lg sm:text-xl lg:text-2xl font-semibold">
                    {doctor.specialization}
                  </span>
                </div>

                {/* Rating */}
                {doctor.rating > 0 && (
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-3 sm:mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 ${
                            i < Math.floor(doctor.rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-base sm:text-lg">
                      {doctor.rating}
                    </span>
                    {doctor.reviewCount > 0 && (
                      <span className="opacity-80 text-sm sm:text-base">
                        ({doctor.reviewCount} reviews)
                      </span>
                    )}
                  </div>
                )}

                {/* Appointment Type Availability */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3 mb-4 sm:mb-6">
                  {appointmentStatus.virtual && (
                    <div className="flex items-center gap-1 sm:gap-2 bg-white text-emerald-700 font-semibold backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                      <Monitor className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Virtual Available</span>
                    </div>
                  )}
                  {appointmentStatus.inPerson && (
                    <div className="flex items-center gap-1 sm:gap-2 bg-white text-emerald-700 font-semibold backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                      <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>In-Person Available</span>
                    </div>
                  )}
                </div>

                {/* Quick Info */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm mb-4 sm:mb-6">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>
                      {doctor.city}, {doctor.state}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{doctor.experience} years experience</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Award className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Verified Doctor</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                  <button
                    onClick={() => setShowBookingModal(true)}
                    disabled={appointmentStatus.noneEnabled}
                    className={`px-4 sm:px-4 lg:px-6 py-2 sm:py-2 lg:py-3 rounded-xl lg:rounded-2xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                      appointmentStatus.noneEnabled
                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                        : "bg-white text-emerald-600 hover:bg-gray-50"
                    }`}
                  >
                    {appointmentStatus.noneEnabled
                      ? "No Appointments"
                      : "Book Appointment"}
                  </button>
                  <div className="flex gap-2 sm:gap-3 justify-center">
                    <button
                      onClick={toggleFavorite}
                      className="bg-white text-emerald-800 bg-opacity-20 backdrop-blur-sm p-2 sm:p-3 lg:p-4 rounded-xl lg:rounded-2xl hover:bg-opacity-30 transition-all"
                    >
                      <Heart
                        className={`h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 ${
                          isFavorite ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                    </button>
                    <button className="bg-white text-emerald-800 bg-opacity-20 backdrop-blur-sm p-2 sm:p-3 lg:p-4 rounded-xl lg:rounded-2xl hover:bg-opacity-30 transition-all">
                      <Video className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex lg:flex-col gap-3 sm:gap-4 lg:gap-3">
              <div className="text-center bg-white text-emerald-700 font-semibold bg-opacity-20 backdrop-blur-sm rounded-xl lg:rounded-2xl p-2 sm:p-3 lg:p-4">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                  ₹{doctor.consultationFee}
                </div>
                <div className="text-xs sm:text-sm">Consultation</div>
              </div>
              <div className="text-center bg-white text-emerald-700 font-semibold bg-opacity-20 backdrop-blur-sm rounded-xl lg:rounded-2xl p-2 sm:p-3 lg:p-4">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                  98%
                </div>
                <div className="text-xs sm:text-sm">Success Rate</div>
              </div>
              <div className="text-center bg-white text-emerald-700 font-semibold bg-opacity-20 backdrop-blur-sm rounded-xl lg:rounded-2xl p-2 sm:p-3 lg:p-4">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                  500+
                </div>
                <div className="text-xs sm:text-sm">Patients</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Doctor Details */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-3 sm:p-4">
              <div className="flex overflow-x-auto scrollbar-hide gap-1 sm:gap-2">
                {["overview", "services", "availability", "reviews"].map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all text-xs sm:text-sm ${
                        activeTab === tab
                          ? "bg-emerald-500 text-white shadow-lg"
                          : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                      }`}
                    >
                      {tab === "overview" && (
                        <User className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                      {tab === "services" && (
                        <Stethoscope className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                      {tab === "availability" && (
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                      {tab === "reviews" && (
                        <Star className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                {/* About Section */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="p-1.5 sm:p-2 bg-emerald-100 rounded-lg sm:rounded-xl">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-emerald-600" />
                    </div>
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                      About Dr. {doctor.fullName}
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl">
                        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                          <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                            Qualifications
                          </h3>
                        </div>
                        <p className="text-gray-700 text-xs sm:text-sm">
                          {doctor.qualifications ||
                            "MBBS, MD - Internal Medicine"}
                        </p>
                      </div>

                      <div className="p-3 sm:p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg sm:rounded-xl">
                        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                          <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                            Medical License
                          </h3>
                        </div>
                        <p className="text-gray-700 text-xs sm:text-sm">
                          {doctor.licenseNumber ||
                            "Licensed Medical Practitioner"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg sm:rounded-xl">
                        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                          <Building className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                            Clinic Information
                          </h3>
                        </div>
                        <p className="text-gray-700 font-medium text-xs sm:text-sm">
                          {doctor.clinicName}
                        </p>
                        <p className="text-gray-600 text-xs mt-1">
                          {doctor.clinicAddress}
                        </p>
                      </div>

                      <div className="p-3 sm:p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg sm:rounded-xl">
                        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                          <Award className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                            Specialization
                          </h3>
                        </div>
                        <p className="text-gray-700 text-xs sm:text-sm">
                          {doctor.specialization}
                        </p>
                        <p className="text-gray-600 text-xs mt-1">
                          {doctor.experience} years of expertise
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expertise Section */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg sm:rounded-xl">
                      <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600" />
                    </div>
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                      Areas of Expertise
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                    {[
                      "Chronic Disease",
                      "Preventive Care",
                      "Health Screening",
                      "Medication",
                      "Lifestyle",
                      "Follow-up",
                    ].map((expertise, index) => (
                      <div
                        key={index}
                        className="text-center p-2 sm:p-3 lg:p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl border border-gray-200 hover:border-emerald-200 transition-colors"
                      >
                        <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-1 sm:mb-2">
                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-700">
                          {expertise}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "services" && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="p-1.5 sm:p-2 bg-emerald-100 rounded-lg sm:rounded-xl">
                    <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-emerald-600" />
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                    Services Offered
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
                  {[
                    {
                      type: "virtual",
                      title: "Virtual Consultation",
                      description: "Video call appointments",
                      icon: Video,
                      color: "emerald",
                    },
                    {
                      type: "personal",
                      title: "In-Person Visit",
                      description: "Clinic consultations",
                      icon: MapPin,
                      color: "blue",
                    },
                    {
                      type: "followup",
                      title: "Follow-up Sessions",
                      description: "Continuous care support",
                      icon: Calendar,
                      color: "purple",
                    },
                    {
                      type: "sameday",
                      title: "Same Day Booking",
                      description: "Quick appointments",
                      icon: Clock,
                      color: "amber",
                    },
                  ].map((service, index) => {
                    const isEnabled =
                      service.type === "virtual"
                        ? appointmentStatus.virtual
                        : service.type === "personal"
                        ? appointmentStatus.inPerson
                        : true;

                    return (
                      <div
                        key={index}
                        className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all ${
                          isEnabled
                            ? `bg-gradient-to-r from-${service.color}-50 to-${service.color}-100 border border-${service.color}-200`
                            : "bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 opacity-60"
                        }`}
                      >
                        <div
                          className={`p-1.5 sm:p-2 rounded-lg ${
                            isEnabled
                              ? `bg-${service.color}-500`
                              : "bg-gray-400"
                          }`}
                        >
                          <service.icon className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                            {service.title}
                          </h3>
                          <p className="text-gray-600 text-xs sm:text-sm">
                            {service.description}
                          </p>
                          {!isEnabled && (
                            <p className="text-red-500 text-xs mt-1">
                              Currently unavailable
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "availability" && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="p-1.5 sm:p-2 bg-emerald-100 rounded-lg sm:rounded-xl">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-emerald-600" />
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                    Weekly Schedule
                  </h2>
                </div>

                {/* Availability Type Tabs */}
                <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setAvailabilityTab("virtual")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors flex-1 ${
                      availabilityTab === "virtual"
                        ? "bg-white text-emerald-700 shadow-sm"
                        : "text-gray-600 hover:text-emerald-600"
                    }`}
                  >
                    <Video className="h-4 w-4" />
                    Virtual Appointments
                  </button>
                  <button
                    onClick={() => setAvailabilityTab("inPerson")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors flex-1 ${
                      availabilityTab === "inPerson"
                        ? "bg-white text-emerald-700 shadow-sm"
                        : "text-gray-600 hover:text-emerald-600"
                    }`}
                  >
                    <Building2 className="h-4 w-4" />
                    In-Person Appointments
                  </button>
                </div>

                {/* Availability Status */}
                <div className="mb-6">
                  <div className={`p-4 rounded-lg border ${
                    (availabilityTab === "virtual" && appointmentStatus.virtual) ||
                    (availabilityTab === "inPerson" && appointmentStatus.inPerson)
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        (availabilityTab === "virtual" && appointmentStatus.virtual) ||
                        (availabilityTab === "inPerson" && appointmentStatus.inPerson)
                          ? "bg-green-500 animate-pulse"
                          : "bg-red-500"
                      }`}></div>
                      <span className={`font-medium ${
                        (availabilityTab === "virtual" && appointmentStatus.virtual) ||
                        (availabilityTab === "inPerson" && appointmentStatus.inPerson)
                          ? "text-green-700"
                          : "text-red-700"
                      }`}>
                        {availabilityTab === "virtual" && appointmentStatus.virtual
                          ? "Virtual appointments are available"
                          : availabilityTab === "inPerson" && appointmentStatus.inPerson
                          ? "In-person appointments are available"
                          : availabilityTab === "virtual"
                          ? "Virtual appointments are currently unavailable"
                          : "In-person appointments are currently unavailable"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Availability Schedule */}
                <div className="grid gap-2 sm:gap-3">
                  {displayAvailability.length > 0 ? (
                    displayAvailability.map((slot, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg sm:rounded-xl hover:from-emerald-50 hover:to-emerald-100 transition-all duration-300"
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-emerald-500 rounded-full"></div>
                          <span className="font-semibold text-gray-900 text-sm sm:text-base lg:text-lg">
                            {slot.day}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600" />
                          <span className="text-emerald-600 font-bold text-sm sm:text-base lg:text-lg">
                            {formatTime(slot.startTime)} -{" "}
                            {formatTime(slot.endTime)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <Calendar className="h-8 w-8 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
                      <p className="text-gray-500 text-sm sm:text-base">
                        No {availabilityTab} availability schedule provided.
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick availability indicator */}
                <div
                  className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg sm:rounded-xl border ${
                    isTodayAvailable
                      ? "bg-gradient-to-r from-green-50 to-green-100 border-green-200"
                      : "bg-gradient-to-r from-red-50 to-red-100 border-red-200"
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                        isTodayAvailable
                          ? "bg-green-500 animate-pulse"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <span
                      className={`font-medium text-sm sm:text-base ${
                        isTodayAvailable ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {isTodayAvailable
                        ? "Available for appointments today"
                        : "Not available for appointments today"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="p-1.5 sm:p-2 bg-yellow-100 rounded-lg sm:rounded-xl">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-yellow-600" />
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                    Patient Reviews
                  </h2>
                </div>

                <div className="text-center mb-4 sm:mb-6">
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                    {doctor.rating || "4.8"}
                  </div>
                  <div className="flex items-center justify-center gap-1 mb-1 sm:mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 sm:h-5 sm:w-5 ${
                          i < Math.floor(doctor.rating || 4.8)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {doctor.reviewCount || "128"} patient reviews
                  </p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {[
                    {
                      patientName: "Sarah M.",
                      rating: 5,
                      comment:
                        "Excellent doctor! Very professional and caring. Explained everything clearly.",
                      avatar: "S",
                    },
                    {
                      patientName: "Raj K.",
                      rating: 4,
                      comment:
                        "Great experience with virtual consultation. Very convenient and effective.",
                      avatar: "R",
                    },
                    {
                      patientName: "Priya S.",
                      rating: 5,
                      comment:
                        "Dr. Smith is very knowledgeable and patient. Highly recommended!",
                      avatar: "P",
                    },
                  ].map((review, index) => (
                    <div
                      key={index}
                      className="p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {review.avatar}
                        </div>
                        <span className="font-medium text-gray-900 text-sm sm:text-base">
                          {review.patientName}
                        </span>
                        <div className="flex gap-1 ml-auto">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 sm:h-4 sm:w-4 ${
                                i < review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-4 text-emerald-600 font-medium hover:text-emerald-700 transition-colors text-sm sm:text-base">
                  View All Reviews
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Quick Info */}
          <div className="space-y-4 sm:space-y-6">
            {/* Quick Action Card */}
            <div className=" top-20">
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 text-white">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">
                    ₹{doctor.consultationFee}
                  </div>
                  <p className="opacity-90 text-sm sm:text-base">
                    Consultation Fee
                  </p>
                </div>

                <button
                  onClick={() => setShowBookingModal(true)}
                  disabled={appointmentStatus.noneEnabled}
                  className={`w-full py-2 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg mb-3 sm:mb-4 ${
                    appointmentStatus.noneEnabled
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-white text-emerald-600 hover:bg-gray-50"
                  }`}
                >
                  {appointmentStatus.noneEnabled
                    ? "Not Available"
                    : "Book Appointment Now"}
                </button>

                <div className="flex gap-2 sm:gap-3">
                  <button
                    onClick={() => handleAppointmentTypeSelect("virtual")}
                    disabled={!appointmentStatus.virtual}
                    className={`flex-1 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all text-emerald-700 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm ${
                      appointmentStatus.virtual
                        ? "bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 hover:bg-opacity-30"
                        : "bg-gray-500 bg-opacity-20 backdrop-blur-sm border border-gray-400 border-opacity-30 cursor-not-allowed"
                    }`}
                  >
                    <Video className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                    <span className="font-medium">Video Call</span>
                  </button>
                  <button
                    onClick={() => handleAppointmentTypeSelect("personal")}
                    disabled={!appointmentStatus.inPerson}
                    className={`flex-1 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all text-emerald-700 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm ${
                      appointmentStatus.inPerson
                        ? "bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 hover:bg-opacity-30"
                        : "bg-gray-500 bg-opacity-20 backdrop-blur-sm border border-gray-400 border-opacity-30 cursor-not-allowed"
                    }`}
                  >
                    <Users className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                    <span className="font-medium">In-Person</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg sm:rounded-xl">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-blue-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                  Contact Info
                </h3>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg sm:rounded-xl">
                  <div className="p-1.5 sm:p-2 bg-emerald-500 rounded-lg">
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      Phone
                    </div>
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">
                      {doctor.phone || "+91 98765 43210"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg sm:rounded-xl">
                  <div className="p-1.5 sm:p-2 bg-blue-500 rounded-lg">
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      Email
                    </div>
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">
                      {doctor.email || "doctor@clinic.com"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg sm:rounded-xl">
                  <div className="p-1.5 sm:p-2 bg-purple-500 rounded-lg">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      Location
                    </div>
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">
                      {doctor.city}, {doctor.state}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl max-w-2xl w-full mx-auto shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 lg:p-8">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
                <div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    Book Appointment
                  </h3>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">
                    Schedule your consultation with Dr. {doctor.fullName}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    setBookingStep(1);
                    setSelectedDate("");
                    setSelectedTime("");
                    setAvailableSlots([]);
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1 sm:p-2 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-colors"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </button>
              </div>

              {/* Progress Indicator */}
              <div className="mb-4 sm:mb-6 lg:mb-8">
                <div className="flex items-center justify-center space-x-4 sm:space-x-6 lg:space-x-8">
                  {/* Step 1 */}
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm ${
                        bookingStep >= 1
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      1
                    </div>
                    <span
                      className={`ml-1 sm:ml-2 text-xs sm:text-sm font-medium ${
                        bookingStep >= 1 ? "text-emerald-600" : "text-gray-500"
                      }`}
                    >
                      Type & Date
                    </span>
                  </div>

                  {/* Connector */}
                  <div
                    className={`flex-1 h-1 mx-2 sm:mx-4 rounded ${
                      bookingStep >= 2 ? "bg-emerald-500" : "bg-gray-200"
                    }`}
                  ></div>

                  {/* Step 2 */}
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm ${
                        bookingStep >= 2
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      2
                    </div>
                    <span
                      className={`ml-1 sm:ml-2 text-xs sm:text-sm font-medium ${
                        bookingStep >= 2 ? "text-emerald-600" : "text-gray-500"
                      }`}
                    >
                      Time & Details
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 1: Appointment Type and Date */}
              {bookingStep === 1 && (
                <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                  <div>
                    <label className="block text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4 lg:mb-6">
                      Choose Appointment Type
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                      <button
                        onClick={() => handleAppointmentTypeSelect("virtual")}
                        disabled={!appointmentStatus.virtual}
                        className={`group p-4 sm:p-6 lg:p-8 border-2 rounded-xl sm:rounded-2xl text-center transition-all duration-300 transform ${
                          appointmentStatus.virtual
                            ? "hover:scale-105"
                            : "cursor-not-allowed"
                        } ${
                          appointmentType === "virtual"
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg"
                            : appointmentStatus.virtual
                            ? "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                            : "border-gray-200 bg-gray-100 text-gray-400"
                        }`}
                      >
                        <div
                          className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto mb-2 sm:mb-3 lg:mb-4 rounded-xl sm:rounded-2xl flex items-center justify-center ${
                            appointmentType === "virtual"
                              ? "bg-emerald-500 text-white"
                              : appointmentStatus.virtual
                              ? "bg-gray-100 text-gray-600 group-hover:bg-emerald-100 group-hover:text-emerald-600"
                              : "bg-gray-300 text-gray-400"
                          }`}
                        >
                          <Video className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                        </div>
                        <div className="font-bold text-base sm:text-lg lg:text-xl mb-1 sm:mb-2">
                          Virtual Consultation
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                          Secure video call from home
                        </div>
                        <div
                          className={`inline-block px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium ${
                            appointmentType === "virtual"
                              ? "bg-emerald-100 text-emerald-700"
                              : appointmentStatus.virtual
                              ? "bg-gray-100 text-gray-600"
                              : "bg-gray-200 text-gray-400"
                          }`}
                        >
                          ₹{doctor.consultationFee}
                        </div>
                        {!appointmentStatus.virtual && (
                          <div className="mt-1 sm:mt-2 text-red-500 text-xs">
                            Currently unavailable
                          </div>
                        )}
                      </button>

                      <button
                        onClick={() => handleAppointmentTypeSelect("personal")}
                        disabled={!appointmentStatus.inPerson}
                        className={`group p-4 sm:p-6 lg:p-8 border-2 rounded-xl sm:rounded-2xl text-center transition-all duration-300 transform ${
                          appointmentStatus.inPerson
                            ? "hover:scale-105"
                            : "cursor-not-allowed"
                        } ${
                          appointmentType === "personal"
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg"
                            : appointmentStatus.inPerson
                            ? "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                            : "border-gray-200 bg-gray-100 text-gray-400"
                        }`}
                      >
                        <div
                          className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto mb-2 sm:mb-3 lg:mb-4 rounded-xl sm:rounded-2xl flex items-center justify-center ${
                            appointmentType === "personal"
                              ? "bg-emerald-500 text-white"
                              : appointmentStatus.inPerson
                              ? "bg-gray-100 text-gray-600 group-hover:bg-emerald-100 group-hover:text-emerald-600"
                              : "bg-gray-300 text-gray-400"
                          }`}
                        >
                          <MapPin className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                        </div>
                        <div className="font-bold text-base sm:text-lg lg:text-xl mb-1 sm:mb-2">
                          In-Person Visit
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                          Visit the clinic personally
                        </div>
                        <div
                          className={`inline-block px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium ${
                            appointmentType === "personal"
                              ? "bg-emerald-100 text-emerald-700"
                              : appointmentStatus.inPerson
                              ? "bg-gray-100 text-gray-600"
                              : "bg-gray-200 text-gray-400"
                          }`}
                        >
                          ₹{doctor.consultationFee}
                        </div>
                        {!appointmentStatus.inPerson && (
                          <div className="mt-1 sm:mt-2 text-red-500 text-xs">
                            Currently unavailable
                          </div>
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4 lg:mb-6">
                      Select Preferred Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                      <input
                        type="date"
                        min={getMinDate()}
                        value={selectedDate}
                        onChange={(e) => handleDateSelect(e.target.value)}
                        className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg border border-gray-300 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      />
                    </div>
                    <div className="mt-2 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                      {isTodayAvailable
                        ? "Same-day appointments available"
                        : "Check availability for today"}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Time Selection */}
              {bookingStep === 2 && (
                <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                  {/* Date Summary */}
                  <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-emerald-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-emerald-800 text-sm sm:text-base">
                          Selected Date
                        </h4>
                        <p className="text-emerald-600 text-xs sm:text-sm">
                          {new Date(selectedDate).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-emerald-600 font-medium mt-1 text-xs sm:text-sm">
                          {appointmentType === "virtual"
                            ? "Virtual Consultation"
                            : "In-Person Visit"}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setBookingStep(1);
                          setSelectedTime("");
                          setAvailableSlots([]);
                        }}
                        className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                      >
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        Change
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4 lg:mb-6">
                      Choose Time Slot
                    </label>
                    {availableSlots.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                        {availableSlots.map((slot, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              slot.available && setSelectedTime(slot.time)
                            }
                            disabled={!slot.available}
                            className={`group p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl border-2 text-center transition-all duration-300 ${
                              selectedTime === slot.time
                                ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg transform scale-105"
                                : slot.available
                                ? "border-green-200 bg-green-50 text-green-700 hover:border-green-300 hover:bg-green-100 hover:transform hover:scale-105"
                                : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            <div
                              className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 mx-auto mb-1 sm:mb-2 rounded-full flex items-center justify-center ${
                                selectedTime === slot.time
                                  ? "bg-emerald-500 text-white"
                                  : slot.available
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-400 text-gray-200"
                              }`}
                            >
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                            </div>
                            <div className="font-semibold text-xs sm:text-sm">
                              {formatTime(slot.time)}
                            </div>
                            {!slot.available && (
                              <div className="text-xs text-gray-500 mt-1">
                                Booked
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 sm:py-8 lg:py-12">
                        <Clock className="h-8 w-8 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                        <p className="text-gray-500 text-sm sm:text-base lg:text-lg">
                          No available slots for this date
                        </p>
                        <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
                          Please select a different date or appointment type
                        </p>
                        <button
                          onClick={() => {
                            setBookingStep(1);
                            setSelectedTime("");
                            setAvailableSlots([]);
                          }}
                          className="text-emerald-600 hover:text-emerald-700 font-medium text-sm sm:text-base"
                        >
                          Choose a different date
                        </button>
                      </div>
                    )}
                  </div>

                  {selectedTime && (
                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl sm:rounded-2xl p-2 sm:p-3 lg:p-4 border border-green-200">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                        <span className="text-green-700 font-medium text-sm sm:text-base">
                          Selected: {formatTime(selectedTime)} on{" "}
                          {new Date(selectedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Patient Notes */}
                  <div>
                    <label className="block text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 lg:mb-4">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={patientNotes}
                      onChange={(e) => setPatientNotes(e.target.value)}
                      rows="3"
                      placeholder="Describe your symptoms, medical history, or any specific concerns you'd like to discuss..."
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 lg:py-4 border border-gray-300 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none text-sm sm:text-base"
                    />
                  </div>

                  {/* Booking Summary */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-200">
                    <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 lg:mb-4">
                      Booking Summary
                    </h4>

                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between items-center py-1 sm:py-2">
                        <span className="text-gray-600 text-sm sm:text-base">
                          Doctor
                        </span>
                        <span className="font-medium text-gray-900 text-sm sm:text-base">
                          Dr. {doctor.fullName}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1 sm:py-2">
                        <span className="text-gray-600 text-sm sm:text-base">
                          Consultation Type
                        </span>
                        <span className="font-medium text-gray-900 text-sm sm:text-base">
                          {appointmentType === "virtual"
                            ? "Virtual Consultation"
                            : "In-Person Visit"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1 sm:py-2">
                        <span className="text-gray-600 text-sm sm:text-base">
                          Date & Time
                        </span>
                        <span className="font-medium text-gray-900 text-sm sm:text-base">
                          {selectedDate &&
                            selectedTime &&
                            `${new Date(
                              selectedDate
                            ).toLocaleDateString()} at ${formatTime(
                              selectedTime
                            )}`}
                        </span>
                      </div>

                      <div className="border-t border-gray-300 pt-2 sm:pt-3 mt-2 sm:mt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-sm sm:text-base">
                            Consultation Fee
                          </span>
                          <span className="text-base sm:text-lg font-semibold text-gray-900">
                            ₹{doctor.consultationFee}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-1 sm:mt-2">
                          <span className="text-lg sm:text-xl font-bold text-gray-900">
                            Total Amount
                          </span>
                          <span className="text-xl sm:text-2xl font-bold text-emerald-600">
                            ₹{doctor.consultationFee}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 sm:gap-3 lg:gap-4">
                    <button
                      onClick={() => {
                        setBookingStep(1);
                        setSelectedTime("");
                        setAvailableSlots([]);
                      }}
                      className="flex-1 py-2 sm:py-3 lg:py-4 px-3 sm:px-4 lg:px-6 rounded-xl sm:rounded-2xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base"
                    >
                      Back
                    </button>
                    
                    <button
                      onClick={handleProceedToPayment}
                      disabled={!selectedTime}
                      className={`flex-1 py-2 sm:py-3 lg:py-4 px-3 sm:px-4 lg:px-6 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 ${
                        selectedTime
                          ? "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {selectedTime
                        ? "Proceed to Payment"
                        : "Select a Time Slot"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      <Elements stripe={stripePromise}>
        <PaymentModal
          show={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={doctor.consultationFee}
          doctor={doctor}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          appointmentType={appointmentType}
          patientNotes={patientNotes}
          currentUser={currentUser}
          onSuccess={handlePaymentSuccess}
        />
      </Elements>
    </div>
  );
}