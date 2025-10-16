import Appointment from "../models/appointmentModel.js";

export const createAppointment = (data) => new Appointment(data).save();

export const getAppointmentsByPatient = (patientId) => 
  Appointment.find({ patient: patientId }).populate('doctor slot');

export const getAppointmentsByDoctor = (doctorId) => 
  Appointment.find({ doctor: doctorId }).populate('patient slot');

export const cancelAppointment = (appointmentId) =>
  Appointment.findByIdAndUpdate(appointmentId, { status: "cancelled",paymentStatus: "cancelled", cancelledAt: new Date() }, { new: true });

export const completeAppointment = (appointmentId) =>
  Appointment.findByIdAndUpdate(appointmentId, { status: "completed" }, { new: true });

// Check if patient has conflicting appointment
export const findConflictingAppointment = async (patientId, newStart, newEnd) => {
  return Appointment.findOne({
    patient: patientId,
    status: 'booked',
    $or: [
      // New appointment starts during existing appointment
      { start: { $lte: newStart }, end: { $gt: newStart } },
      // New appointment ends during existing appointment
      { start: { $lt: newEnd }, end: { $gte: newEnd } },
      // New appointment completely covers existing appointment
      { start: { $gte: newStart }, end: { $lte: newEnd } },
      // Existing appointment completely covers new appointment
      { start: { $lte: newStart }, end: { $gte: newEnd } }
    ]
  }).populate('doctor');
};

// Count pending payment appointments for a patient
export const countPendingPayments = async (patientId) => {
  return Appointment.countDocuments({
    patient: patientId,
    status: 'booked',
    paymentStatus: 'pending'
  });
};