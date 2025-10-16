import * as appointmentRepo from "../repositories/appointmentRepository.js";
import * as slotRepo from "../repositories/slotRepository.js";
import * as notificationRepo from "../repositories/notificationRepository.js";

export const bookAppointment = async ({ patientId, slotId, reason, phone }) => {
  // Step 1: Check if slot exists and is available
  const slot = await slotRepo.findSlotById(slotId);
  if (!slot || slot.isBooked) {
    throw new Error("Slot not available");
  }

  // Step 2: Check for time conflicts with other appointments
  const conflictingAppointment = await appointmentRepo.findConflictingAppointment(
    patientId,
    slot.start,
    slot.end
  );

  if (conflictingAppointment) {
    const conflictDate = new Date(conflictingAppointment.start).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const doctorName = conflictingAppointment.doctor?.user?.name || 'another doctor';
    
    throw new Error(
      `You already have an appointment with ${doctorName} at ${conflictDate}. Please choose a different time slot.`
    );
  }

  // Step 3: Check pending payment limit (max 3)
  const pendingCount = await appointmentRepo.countPendingPayments(patientId);
  if (pendingCount >= 3) {
    throw new Error(
      `You have ${pendingCount} appointments with pending payments. Please complete payment for existing appointments before booking new ones.`
    );
  }

  // Step 4: Create the appointment
  const appointment = await appointmentRepo.createAppointment({
    patient: patientId,
    doctor: slot.doctor,
    slot: slot._id,
    start: slot.start,
    end: slot.end,
    reason,
    phone,
  });

  // Step 5: Mark slot as booked
  await slotRepo.markSlotBooked(slotId, appointment._id);

  // Step 6: Create confirmation notification
  try {
    await notificationRepo.createNotification({
      user: patientId,
      type: 'appointment_confirmed',
      title: '✅ Appointment Confirmed',
      message: `Your appointment has been confirmed for ${new Date(slot.start).toLocaleString()}.`,
      appointmentId: appointment._id
    });
    console.log(`✅ Confirmation notification created for patient ${patientId}`);
  } catch (notifErr) {
    console.error('❌ Failed to create confirmation notification:', notifErr.message);
    // Don't fail the booking if notification fails
  }

  return appointment;
};

export const cancelAppointment = async (appointmentId) => {
  const appointment = await appointmentRepo.cancelAppointment(appointmentId);
  
  if (appointment) {
    // Free up the slot
    await slotRepo.markSlotAvailable(appointment.slot);

    // Create cancellation notification for patient
    try {
      await notificationRepo.createNotification({
        user: appointment.patient,
        type: 'appointment_cancelled',
        title: '❌ Appointment Cancelled',
        message: `Your appointment on ${new Date(appointment.start).toLocaleString()} has been cancelled.`,
        appointmentId: appointment._id
      });
      console.log(`✅ Cancellation notification created for patient ${appointment.patient}`);
    } catch (notifErr) {
      console.error('❌ Failed to create cancellation notification:', notifErr.message);
    }
  }

  return appointment;
};