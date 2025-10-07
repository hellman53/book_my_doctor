import { NextResponse } from 'next/server';
import { doc, setDoc, collection, addDoc, serverTimestamp, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/config';

export async function POST(request) {
  try {
    const { 
      paymentIntentId, 
      doctorId, 
      selectedDate, 
      selectedTime, 
      appointmentType, 
      patientNotes,
      currentUser,
      doctor
    } = await request.json();

    // Create appointment in Firebase
    const appointmentData = {
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
      paymentStatus: "paid",
      paymentIntentId: paymentIntentId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const appointmentRef = await addDoc(collection(db, "appointments"), appointmentData);
    
    // Update doctor's appointments
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

    // Update daily appointments
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

    return NextResponse.json({ 
      success: true, 
      appointmentId: appointmentRef.id 
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    return NextResponse.json(
      { error: 'Error confirming payment' },
      { status: 500 }
    );
  }
}