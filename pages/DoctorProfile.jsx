"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
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
  Building2
} from "lucide-react";

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
          
          // Check today's availability after doctor data is loaded
          checkTodaysAvailability(doctorDataObj);
        } else {
          toast.error("Doctor not found");
          router.push("/");
          return;
        }
        
        if (doctorData.exists()) {
          const userData = { id: doctorData.id, ...doctorData.data() };
          setDoctorUser(userData);
          if(userData.role !== "doctor"){
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

  // Check if today is available for appointments
  const checkTodaysAvailability = (doctorData) => {
    const today = new Date();
    const todayDay = today.toLocaleDateString('en-US', { weekday: 'long' });
    
    let todayAvailability = null;

    // Check schedule settings first
    if (doctorData.scheduleSettings) {
      if (doctorData.scheduleSettings.virtual?.enabled) {
        todayAvailability = doctorData.scheduleSettings.virtual.availability?.find(
          avail => avail.day === todayDay
        );
      }
      if (!todayAvailability && doctorData.scheduleSettings.inPerson?.enabled) {
        todayAvailability = doctorData.scheduleSettings.inPerson.availability?.find(
          avail => avail.day === todayDay
        );
      }
    }

    // Fallback to old availability structure
    if (!todayAvailability && doctorData.availability) {
      todayAvailability = doctorData.availability.find(avail => avail.day === todayDay);
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

    // Check schedule settings first
    if (doctor.scheduleSettings) {
      if (type === "virtual" && doctor.scheduleSettings.virtual?.enabled) {
        return doctor.scheduleSettings.virtual.availability?.find(
          avail => avail.day === dayOfWeek
        );
      } else if (type === "personal" && doctor.scheduleSettings.inPerson?.enabled) {
        return doctor.scheduleSettings.inPerson.availability?.find(
          avail => avail.day === dayOfWeek
        );
      }
    }

    // Fallback to old availability structure
    if (doctor.availability) {
      return doctor.availability.find(avail => avail.day === dayOfWeek);
    }

    return null;
  };

  // Generate available time slots based on doctor's availability and schedule settings
  const generateTimeSlots = (date, type) => {
    if (!doctor || !date) return [];

    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    
    const dayAvailability = getDayAvailability(dayOfWeek, type);
    if (!dayAvailability) return [];

    let slotDuration = 30; // default

    // Get slot duration from schedule settings
    if (type === "virtual" && doctor.scheduleSettings?.virtual) {
      slotDuration = doctor.scheduleSettings.virtual.slotDuration || 30;
    } else if (type === "personal" && doctor.scheduleSettings?.inPerson) {
      slotDuration = doctor.scheduleSettings.inPerson.slotDuration || 30;
    }

    const slots = [];
    const startTime = new Date(`${date}T${dayAvailability.startTime}`);
    const endTime = new Date(`${date}T${dayAvailability.endTime}`);
    
    // Generate slots based on slot duration
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
    
    // Check if selected appointment type is enabled
    if (!isAppointmentTypeEnabled(appointmentType)) {
      toast.error(`${
        appointmentType === "virtual" ? "Virtual" : "In-person"
      } appointments are currently not available for this doctor`);
      return;
    }

    // Check if the selected date has availability
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    const dayAvailability = getDayAvailability(dayOfWeek, appointmentType);
    
    if (!dayAvailability) {
      toast.error(`No ${appointmentType} appointments available for ${dayOfWeek}`);
      setAvailableSlots([]);
      return;
    }

    const slots = generateTimeSlots(date, appointmentType);
    
    if (slots.length === 0) {
      setAvailableSlots([]);
      return;
    }

    // Check which slots are available
    const availableSlotsWithStatus = await Promise.all(
      slots.map(async (slot) => {
        const isBooked = await isSlotBooked(date, slot);
        return {
          time: slot,
          available: !isBooked
        };
      })
    );
    
    setAvailableSlots(availableSlotsWithStatus);
    setBookingStep(2);
  };

  // Handle appointment type selection
  const handleAppointmentTypeSelect = (type) => {
    if (!isAppointmentTypeEnabled(type)) {
      toast.error(`${
        type === "virtual" ? "Virtual" : "In-person"
      } appointments are currently not available for this doctor`);
      return;
    }
    setAppointmentType(type);
    setSelectedDate("");
    setSelectedTime("");
    setAvailableSlots([]);
  };

  // Generate ZegoCloud room data
  const generateZegoCloudRoom = async (appointmentId) => {
    try {
      // Generate a unique room ID based on appointment ID
      const roomID = `appointment_${appointmentId}`;
      
      // Your ZegoCloud credentials (store these in environment variables)
      const appID = process.env.NEXT_PUBLIC_ZEGOCLOUD_APP_ID;
      const serverSecret = process.env.NEXT_PUBLIC_ZEGOCLOUD_SERVER_SECRET;
      
      if (!appID || !serverSecret) {
        throw new Error('ZegoCloud credentials not configured');
      }

      return {
        roomID,
        appID,
        serverSecret
      };
    } catch (error) {
      console.error('Error generating ZegoCloud room:', error);
      throw error;
    }
  };

  // Update the bookAppointment function
  const bookAppointment = async () => {
    if (!currentUser) {
      toast.error("Please sign in to book an appointment");
      router.push("/sign-in");
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error("Please select date and time");
      return;
    }

    // Final check if appointment type is enabled
    if (!isAppointmentTypeEnabled(appointmentType)) {
      toast.error(`${appointmentType === "virtual" ? "Virtual" : "In-person"} appointments are currently not available for this doctor`);
      return;
    }

    try {
      let appointmentRef;
      let appointmentData = {
        doctorId: doctorId,
        doctorName: doctor.fullName,
        doctorSpecialization: doctor.specialization,
        patientId: currentUser.id,
        patientName: `${currentUser.firstName} ${currentUser.lastName}`,
        patientEmail: currentUser.primaryEmailAddress?.emailAddress,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        appointmentType: appointmentType,
        status: "confirmed",
        patientNotes: patientNotes,
        consultationFee: doctor.consultationFee,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      if (appointmentType === "virtual") {
        // Generate ZegoCloud room data first
        const zegoCloudData = await generateZegoCloudRoom(`temp_${Date.now()}`);
        appointmentData.zegoCloudData = zegoCloudData;
        
        // Create appointment in appointments collection
        appointmentRef = await addDoc(collection(db, "appointments"), appointmentData);
        
        // Update the appointment with the correct room ID using the actual appointment ID
        const finalZegoCloudData = await generateZegoCloudRoom(appointmentRef.id);
        await updateDoc(appointmentRef, {
          zegoCloudData: finalZegoCloudData
        });

        // Update the local appointment data with the final ZegoCloud data
        appointmentData.zegoCloudData = finalZegoCloudData;
      } else {
        // For in-person appointments, create without video data
        appointmentRef = await addDoc(collection(db, "appointments"), appointmentData);
      }

      // Update doctor's appointments subcollection
      const doctorAppointmentsRef = collection(db, "doctors", doctorId, "appointments");
      await addDoc(doctorAppointmentsRef, {
        ...appointmentData,
        appointmentId: appointmentRef.id
      });

      // Update user's appointments
      const userAppointmentsRef = collection(db, "users", currentUser.id, "appointments");
      await addDoc(userAppointmentsRef, {
        ...appointmentData,
        appointmentId: appointmentRef.id,
        doctorId: doctorId
      });

      // Create daily appointment document if it doesn't exist
      const dailyAppointmentRef = doc(db, "doctors", doctorId, "dailyAppointments", selectedDate);
      const dailyAppointmentDoc = await getDoc(dailyAppointmentRef);

      if (dailyAppointmentDoc.exists()) {
        await updateDoc(dailyAppointmentRef, {
          appointments: [...dailyAppointmentDoc.data().appointments, appointmentRef.id],
          updatedAt: serverTimestamp()
        });
      } else {
        await setDoc(dailyAppointmentRef, {
          date: selectedDate,
          appointments: [appointmentRef.id],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      toast.success("Appointment booked successfully!");
      setShowBookingModal(false);
      setBookingStep(1);
      setSelectedDate("");
      setSelectedTime("");
      setPatientNotes("");

      // Refresh available slots
      if (selectedDate) {
        handleDateSelect(selectedDate);
      }

    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Failed to book appointment. Please try again.");
    }
  };

  // Format time for display
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
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
      noneEnabled: !virtualEnabled && !inPersonEnabled
    };
  };

  // Get minimum date for date input (today)
  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Doctor Not Found</h2>
          <p className="text-gray-600 mb-4">The doctor you're looking for doesn't exist.</p>
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

  return (
    <div className="mt-10 min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Navigation Bar */}
      <div className="pt-20 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Search
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-emerald-600 to-emerald-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Doctor Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 lg:w-40 lg:h-40 bg-white bg-opacity-20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30">
                {doctorUser?.profileImage ? (
                  <img 
                    src={doctorUser.profileImage} 
                    alt={doctorUser.fullName}
                    className="w-full h-full rounded-3xl object-cover"
                  />
                ) : (
                  <User className="h-16 w-16 lg:h-20 lg:w-20 text-white opacity-80" />
                )}
              </div>
              {/* Verified Badge */}
              <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-2">
                <Shield className="h-5 w-5 text-white" />
              </div>
            </div>

            {/* Doctor Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="mb-4">
                <h1 className="text-4xl lg:text-5xl font-bold mb-2">Dr. {doctor.fullName}</h1>
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                  <Stethoscope className="h-6 w-6" />
                  <span className="text-xl font-semibold">{doctor.specialization}</span>
                </div>
                
                {/* Rating */}
                {doctor.rating? (
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-5 w-5 ${
                            i < Math.floor(doctor.rating) 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-lg">{doctor.rating}</span>
                    {doctor.reviewCount && (
                      <span className="opacity-80">({doctor.reviewCount} reviews)</span>
                    )}
                  </div>
                ): null}

                {/* Appointment Type Availability */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
                  {appointmentStatus.virtual && (
                    <div className="flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Monitor className="h-4 w-4" />
                      <span className="text-sm">Virtual Available</span>
                    </div>
                  )}
                  {appointmentStatus.inPerson && (
                    <div className="flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Building2 className="h-4 w-4" />
                      <span className="text-sm">In-Person Available</span>
                    </div>
                  )}
                  {appointmentStatus.noneEnabled && (
                    <div className="flex items-center gap-2 bg-red-500 bg-opacity-20 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">No Appointments Available</span>
                    </div>
                  )}
                </div>

                {/* Quick Info */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{doctor.city}, {doctor.state}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{doctor.experience} years experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    <span>Verified Doctor</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button
                    onClick={() => setShowBookingModal(true)}
                    disabled={appointmentStatus.noneEnabled}
                    className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                      appointmentStatus.noneEnabled
                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                        : "bg-white text-emerald-600 hover:bg-gray-50"
                    }`}
                  >
                    {appointmentStatus.noneEnabled ? "No Appointments Available" : "Book Appointment"}
                  </button>
                  <div className="flex gap-3">
                    <button className="bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 p-4 rounded-2xl hover:bg-opacity-30 transition-all">
                      <Heart className="h-6 w-6" />
                    </button>
                    <button className="bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 p-4 rounded-2xl hover:bg-opacity-30 transition-all">
                      <Video className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex lg:flex-col gap-6 lg:gap-4">
              <div className="text-center bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 border border-white border-opacity-30">
                <div className="text-2xl font-bold">₹{doctor.consultationFee}</div>
                <div className="text-sm opacity-80">Consultation</div>
              </div>
              <div className="text-center bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 border border-white border-opacity-30">
                <div className="text-2xl font-bold">98%</div>
                <div className="text-sm opacity-80">Success Rate</div>
              </div>
              <div className="text-center bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 border border-white border-opacity-30">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm opacity-80">Patients</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-8 text-white">
            <path fill="currentColor" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Doctor Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-xl">
                  <User className="h-6 w-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">About Dr. {doctor.fullName}</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <GraduationCap className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">Qualifications</h3>
                    </div>
                    <p className="text-gray-700">{doctor.qualifications || 'MBBS, MD - Internal Medicine'}</p>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-gray-900">Medical License</h3>
                    </div>
                    <p className="text-gray-700">{doctor.licenseNumber || 'Licensed Medical Practitioner'}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Building className="h-5 w-5 text-purple-600" />
                      <h3 className="font-semibold text-gray-900">Clinic Information</h3>
                    </div>
                    <p className="text-gray-700 font-medium">{doctor.clinicName}</p>
                    <p className="text-gray-600 text-sm mt-1">{doctor.clinicAddress}</p>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Award className="h-5 w-5 text-amber-600" />
                      <h3 className="font-semibold text-gray-900">Specialization</h3>
                    </div>
                    <p className="text-gray-700">{doctor.specialization}</p>
                    <p className="text-gray-600 text-sm mt-1">{doctor.experience} years of expertise</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Services Offered */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-xl">
                  <Stethoscope className="h-6 w-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Services Offered</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
                  appointmentStatus.virtual 
                    ? "bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200" 
                    : "bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 opacity-60"
                }`}>
                  <div className={`p-2 rounded-lg ${
                    appointmentStatus.virtual ? "bg-emerald-500" : "bg-gray-400"
                  }`}>
                    <Video className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Virtual Consultation</h3>
                    <p className="text-gray-600 text-sm">Video call appointments</p>
                    {!appointmentStatus.virtual && (
                      <p className="text-red-500 text-xs mt-1">Currently unavailable</p>
                    )}
                  </div>
                </div>
                
                <div className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
                  appointmentStatus.inPerson 
                    ? "bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200" 
                    : "bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 opacity-60"
                }`}>
                  <div className={`p-2 rounded-lg ${
                    appointmentStatus.inPerson ? "bg-blue-500" : "bg-gray-400"
                  }`}>
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">In-Person Visit</h3>
                    <p className="text-gray-600 text-sm">Clinic consultations</p>
                    {!appointmentStatus.inPerson && (
                      <p className="text-red-500 text-xs mt-1">Currently unavailable</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Follow-up Sessions</h3>
                    <p className="text-gray-600 text-sm">Continuous care support</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl border border-amber-200">
                  <div className="p-2 bg-amber-500 rounded-lg">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Same Day Booking</h3>
                    <p className="text-gray-600 text-sm">Quick appointments</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability Schedule */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-xl">
                  <Calendar className="h-6 w-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Weekly Schedule</h2>
              </div>
              
              <div className="grid gap-4">
                {doctor.availability && doctor.availability.length > 0 ? (
                  doctor.availability.map((slot, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-emerald-50 hover:to-emerald-100 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                        <span className="font-semibold text-gray-900 text-lg">{slot.day}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-emerald-600" />
                        <span className="text-emerald-600 font-bold text-lg">
                          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No availability schedule provided.</p>
                  </div>
                )}
              </div>
              
              {/* Quick availability indicator */}
              <div className={`mt-6 p-4 rounded-xl border ${
                isTodayAvailable 
                  ? "bg-gradient-to-r from-green-50 to-green-100 border-green-200" 
                  : "bg-gradient-to-r from-red-50 to-red-100 border-red-200"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    isTodayAvailable ? "bg-green-500 animate-pulse" : "bg-red-500"
                  }`}></div>
                  <span className={`font-medium ${
                    isTodayAvailable ? "text-green-700" : "text-red-700"
                  }`}>
                    {isTodayAvailable 
                      ? "Available for appointments today" 
                      : "Not available for appointments today"
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Info */}
          <div className="space-y-6">
            {/* Quick Action Card */}
            <div className="sticky top-22">
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl shadow-xl p-6 text-white">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold mb-2">₹{doctor.consultationFee}</div>
                  <p className="opacity-90">Consultation Fee</p>
                </div>
                
                <button
                  onClick={() => setShowBookingModal(true)}
                  disabled={appointmentStatus.noneEnabled}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg mb-4 ${
                    appointmentStatus.noneEnabled
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-white text-emerald-600 hover:bg-gray-50"
                  }`}
                >
                  {appointmentStatus.noneEnabled ? "Not Available" : "Book Appointment Now"}
                </button>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleAppointmentTypeSelect("virtual")}
                    disabled={!appointmentStatus.virtual}
                    className={`flex-1 py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
                      appointmentStatus.virtual
                        ? "bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 hover:bg-opacity-30"
                        : "bg-gray-500 bg-opacity-20 backdrop-blur-sm border border-gray-400 border-opacity-30 cursor-not-allowed"
                    }`}
                  >
                    <Video className="h-5 w-5" />
                    <span className="text-sm font-medium">Video Call</span>
                  </button>
                  <button 
                    onClick={() => handleAppointmentTypeSelect("personal")}
                    disabled={!appointmentStatus.inPerson}
                    className={`flex-1 py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
                      appointmentStatus.inPerson
                        ? "bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 hover:bg-opacity-30"
                        : "bg-gray-500 bg-opacity-20 backdrop-blur-sm border border-gray-400 border-opacity-30 cursor-not-allowed"
                    }`}
                  >
                    <Users className="h-5 w-5" />
                    <span className="text-sm font-medium">In-Person</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Contact Info</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl">
                  <div className="p-2 bg-emerald-500 rounded-lg">
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Phone</div>
                    <div className="font-semibold text-gray-900">{doctor.phone || '+91 98765 43210'}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Mail className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-semibold text-gray-900">{doctor.email || 'doctor@clinic.com'}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Location</div>
                    <div className="font-semibold text-gray-900">{doctor.city}, {doctor.state}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Reviews */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-yellow-100 rounded-xl">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Patient Reviews</h3>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-900 mb-2">{doctor.rating || '4.8'}</div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${
                        i < Math.floor(doctor.rating || 4.8) 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <p className="text-gray-600">{doctor.reviewCount || '128'} patient reviews</p>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">S</div>
                    <span className="font-medium text-gray-900">Sarah M.</span>
                    <div className="flex gap-1 ml-auto">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">"Excellent doctor! Very professional and caring."</p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">R</div>
                    <span className="font-medium text-gray-900">Raj K.</span>
                    <div className="flex gap-1 ml-auto">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">"Great experience with virtual consultation."</p>
                </div>
              </div>
              
              <button className="w-full mt-4 text-emerald-600 font-medium hover:text-emerald-700 transition-colors">
                View All Reviews
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full mx-auto shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">Book Appointment</h3>
                  <p className="text-gray-600 mt-1">Schedule your consultation with Dr. {doctor.fullName}</p>
                </div>
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    setBookingStep(1);
                    setSelectedDate("");
                    setSelectedTime("");
                    setAvailableSlots([]);
                  }}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Progress Indicator */}
              <div className="mb-8">
                <div className="flex items-center justify-center space-x-8">
                  {/* Step 1 */}
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      bookingStep >= 1 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      1
                    </div>
                    <span className={`ml-2 text-sm font-medium ${
                      bookingStep >= 1 ? 'text-emerald-600' : 'text-gray-500'
                    }`}>
                      Type & Date
                    </span>
                  </div>

                  {/* Connector */}
                  <div className={`flex-1 h-1 mx-4 rounded ${
                    bookingStep >= 2 ? 'bg-emerald-500' : 'bg-gray-200'
                  }`}></div>

                  {/* Step 2 */}
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      bookingStep >= 2 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      2
                    </div>
                    <span className={`ml-2 text-sm font-medium ${
                      bookingStep >= 2 ? 'text-emerald-600' : 'text-gray-500'
                    }`}>
                      Time & Details
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 1: Appointment Type and Date */}
              {bookingStep === 1 && (
                <div className="space-y-8">
                  <div>
                    <label className="block text-xl font-semibold text-gray-900 mb-6">Choose Appointment Type</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <button
                        onClick={() => handleAppointmentTypeSelect("virtual")}
                        disabled={!appointmentStatus.virtual}
                        className={`group p-8 border-2 rounded-2xl text-center transition-all duration-300 transform ${
                          appointmentStatus.virtual ? 'hover:scale-105' : 'cursor-not-allowed'
                        } ${
                          appointmentType === "virtual"
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg"
                            : appointmentStatus.virtual
                            ? "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                            : "border-gray-200 bg-gray-100 text-gray-400"
                        }`}
                      >
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                          appointmentType === "virtual" 
                            ? "bg-emerald-500 text-white" 
                            : appointmentStatus.virtual
                            ? "bg-gray-100 text-gray-600 group-hover:bg-emerald-100 group-hover:text-emerald-600"
                            : "bg-gray-300 text-gray-400"
                        }`}>
                          <Video className="w-8 h-8" />
                        </div>
                        <div className="font-bold text-lg mb-2">Virtual Consultation</div>
                        <div className="text-sm text-gray-600 mb-3">Secure video call from home</div>
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          appointmentType === "virtual" 
                            ? "bg-emerald-100 text-emerald-700" 
                            : appointmentStatus.virtual
                            ? "bg-gray-100 text-gray-600"
                            : "bg-gray-200 text-gray-400"
                        }`}>
                          ₹{doctor.consultationFee}
                        </div>
                        {!appointmentStatus.virtual && (
                          <div className="mt-2 text-red-500 text-xs">Currently unavailable</div>
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleAppointmentTypeSelect("personal")}
                        disabled={!appointmentStatus.inPerson}
                        className={`group p-8 border-2 rounded-2xl text-center transition-all duration-300 transform ${
                          appointmentStatus.inPerson ? 'hover:scale-105' : 'cursor-not-allowed'
                        } ${
                          appointmentType === "personal"
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg"
                            : appointmentStatus.inPerson
                            ? "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                            : "border-gray-200 bg-gray-100 text-gray-400"
                        }`}
                      >
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                          appointmentType === "personal" 
                            ? "bg-emerald-500 text-white" 
                            : appointmentStatus.inPerson
                            ? "bg-gray-100 text-gray-600 group-hover:bg-emerald-100 group-hover:text-emerald-600"
                            : "bg-gray-300 text-gray-400"
                        }`}>
                          <MapPin className="w-8 h-8" />
                        </div>
                        <div className="font-bold text-lg mb-2">In-Person Visit</div>
                        <div className="text-sm text-gray-600 mb-3">Visit the clinic personally</div>
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          appointmentType === "personal" 
                            ? "bg-emerald-100 text-emerald-700" 
                            : appointmentStatus.inPerson
                            ? "bg-gray-100 text-gray-600"
                            : "bg-gray-200 text-gray-400"
                        }`}>
                          ₹{doctor.consultationFee}
                        </div>
                        {!appointmentStatus.inPerson && (
                          <div className="mt-2 text-red-500 text-xs">Currently unavailable</div>
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xl font-semibold text-gray-900 mb-6">Select Preferred Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="date"
                        min={getMinDate()}
                        value={selectedDate}
                        onChange={(e) => handleDateSelect(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      />
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {isTodayAvailable ? "Same-day appointments available" : "Check availability for today"}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Time Selection */}
              {bookingStep === 2 && (
                <div className="space-y-8">
                  {/* Date Summary */}
                  <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-emerald-800">Selected Date</h4>
                        <p className="text-emerald-600">{new Date(selectedDate).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</p>
                        <p className="text-emerald-600 font-medium mt-1">
                          {appointmentType === 'virtual' ? 'Virtual Consultation' : 'In-Person Visit'}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setBookingStep(1);
                          setSelectedTime("");
                          setAvailableSlots([]);
                        }}
                        className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2"
                      >
                        <Calendar className="h-4 w-4" />
                        Change
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xl font-semibold text-gray-900 mb-6">Choose Time Slot</label>
                    {availableSlots.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {availableSlots.map((slot, index) => (
                          <button
                            key={index}
                            onClick={() => slot.available && setSelectedTime(slot.time)}
                            disabled={!slot.available}
                            className={`group p-4 rounded-2xl border-2 text-center transition-all duration-300 ${
                              selectedTime === slot.time
                                ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg transform scale-105"
                                : slot.available
                                ? "border-green-200 bg-green-50 text-green-700 hover:border-green-300 hover:bg-green-100 hover:transform hover:scale-105"
                                : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                              selectedTime === slot.time
                                ? "bg-emerald-500 text-white"
                                : slot.available
                                ? "bg-green-500 text-white"
                                : "bg-gray-400 text-gray-200"
                            }`}>
                              <Clock className="w-4 h-4" />
                            </div>
                            <div className="font-semibold">{formatTime(slot.time)}</div>
                            {!slot.available && (
                              <div className="text-xs text-gray-500 mt-1">Booked</div>
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No available slots for this date</p>
                        <p className="text-gray-400 text-sm mb-4">Please select a different date or appointment type</p>
                        <button
                          onClick={() => {
                            setBookingStep(1);
                            setSelectedTime("");
                            setAvailableSlots([]);
                          }}
                          className="text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                          Choose a different date
                        </button>
                      </div>
                    )}
                  </div>

                  {selectedTime && (
                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-4 border border-green-200">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-green-700 font-medium">
                          Selected: {formatTime(selectedTime)} on {new Date(selectedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Patient Notes */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-4">Additional Notes (Optional)</label>
                    <textarea
                      value={patientNotes}
                      onChange={(e) => setPatientNotes(e.target.value)}
                      rows="4"
                      placeholder="Describe your symptoms, medical history, or any specific concerns you'd like to discuss..."
                      className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none text-base"
                    />
                  </div>

                  {/* Booking Summary */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Doctor</span>
                        <span className="font-medium text-gray-900">Dr. {doctor.fullName}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Consultation Type</span>
                        <span className="font-medium text-gray-900">
                          {appointmentType === 'virtual' ? 'Virtual Consultation' : 'In-Person Visit'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Date & Time</span>
                        <span className="font-medium text-gray-900">
                          {selectedDate && selectedTime && 
                            `${new Date(selectedDate).toLocaleDateString()} at ${formatTime(selectedTime)}`
                          }
                        </span>
                      </div>
                      
                      <div className="border-t border-gray-300 pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Consultation Fee</span>
                          <span className="text-lg font-semibold text-gray-900">₹{doctor.consultationFee}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xl font-bold text-gray-900">Total Amount</span>
                          <span className="text-2xl font-bold text-emerald-600">₹{doctor.consultationFee}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setBookingStep(1);
                        setSelectedTime("");
                        setAvailableSlots([]);
                      }}
                      className="flex-1 py-4 px-6 rounded-2xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={bookAppointment}
                      disabled={!selectedTime}
                      className={`flex-1 py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 ${
                        selectedTime
                          ? "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {selectedTime ? 'Confirm Booking' : 'Select a Time Slot'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}