import * as notificationRepo from "../repositories/notificationRepository.js";
import Appointment from "../models/appointmentModel.js";
import * as appointmentRepo from "../repositories/appointmentRepository.js";

export const createAppointmentCancelledNotification = async (appointment, reason = "Doctor unavailability") => {
  await notificationRepo.createNotification({
    user: appointment.patient,
    type: 'appointment_cancelled',
    title: '❌ Appointment Cancelled',
    message: `Your appointment on ${new Date(appointment.start).toLocaleString()} has been cancelled due to ${reason}.`,
    appointmentId: appointment._id
  });
};

export const createAppointmentConfirmedNotification = async (appointment) => {
  await notificationRepo.createNotification({
    user: appointment.patient,
    type: 'appointment_confirmed',
    title: '✅ Appointment Confirmed',
    message: `Your appointment has been confirmed for ${new Date(appointment.start).toLocaleString()}.`,
    appointmentId: appointment._id
  });
};

export const notifyAffectedPatients = async (doctorId, date) => {
  // Find all booked appointments for this doctor on this date
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const appointments = await Appointment.find({
    doctor: doctorId,
    start: { $gte: startOfDay, $lte: endOfDay },
    status: 'cancelled'  //this has as booked
  }).populate('patient');

  // Create notifications for each affected patient
  for (const appointment of appointments) {
    await createAppointmentCancelledNotification(appointment, "doctor marked this date as unavailable");
    //await appointmentRepo.cancelAppointment(appointment._id);
  }

  return appointments.length;
};