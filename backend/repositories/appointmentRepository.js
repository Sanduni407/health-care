import Appointment from "../models/appointmentModel.js";

export const createAppointment = (data) => new Appointment(data).save();

export const getAppointmentsByPatient = (patientId) => 
  Appointment.find({ patient: patientId }).populate('doctor slot');

export const getAppointmentsByDoctor = (doctorId) => 
  Appointment.find({ doctor: doctorId }).populate('patient slot');

export const cancelAppointment = (appointmentId) =>
  Appointment.findByIdAndUpdate(appointmentId, { status: "cancelled", cancelledAt: new Date() }, { new: true });

export const completeAppointment = (appointmentId) =>
  Appointment.findByIdAndUpdate(appointmentId, { status: "completed" }, { new: true });
