import * as appointmentRepo from "../repositories/appointmentRepository.js";
import * as slotRepo from "../repositories/slotRepository.js";
import * as notificationRepo from "../repositories/notificationRepository.js";

export const bookAppointment = async ({ patientId, slotId, reason, phone }) => {
  const slot = await slotRepo.findSlotById(slotId);
  if (!slot || slot.isBooked) throw new Error("Slot not available");

  const appointment = await appointmentRepo.createAppointment({
    patient: patientId,
    doctor: slot.doctor,
    slot: slot._id,
    start: slot.start,
    end: slot.end,
    reason,
    phone,
  });

  await slotRepo.markSlotBooked(slotId, appointment._id);

  // Create confirmation notification
  await notificationRepo.createNotification({
    user: patientId,
    type: 'appointment_confirmed',
    title: '✅ Appointment Confirmed',
    message: `Your appointment has been confirmed for ${new Date(slot.start).toLocaleString()}.`,
    appointmentId: appointment._id
  });

  return appointment;
};

export const cancelAppointment = async (appointmentId) => {
  const appointment = await appointmentRepo.cancelAppointment(appointmentId);
  
  if (appointment) {
    // Free up the slot
    await slotRepo.markSlotAvailable(appointment.slot);

    // Create cancellation notification for patient
    await notificationRepo.createNotification({
      user: appointment.patient,
      type: 'appointment_cancelled',
      title: '❌ Appointment Cancelled',
      message: `Your appointment on ${new Date(appointment.start).toLocaleString()} has been cancelled.`,
      appointmentId: appointment._id
    });
  }

  return appointment;
};