import Doctor from "../models/doctorModel.js";
import * as appointmentService from "../services/appointmentService.js";
import * as appointmentRepo from "../repositories/appointmentRepository.js";

// Book a slot
export const bookAppointment = async (req, res) => {
  try {
    const appointment = await appointmentService.bookAppointment({
      patientId: req.user.id,
      ...req.body
    });
    res.json({ success: true, appointment });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Cancel appointment
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await appointmentService.cancelAppointment(req.params.id);
    res.json({ success: true, appointment });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Get my appointments
export const getMyAppointments = async (req, res) => {
  try {
    if (req.user.role === "doctor") {
      const doctor = await Doctor.findOne({ user: req.user.id });
      if (!doctor) return res.json({ success: false, message: "Doctor not found" });
      const appointments = await appointmentRepo.getAppointmentsByDoctor(doctor._id);
      return res.json({ success: true, appointments });
    }
    const appointments = await appointmentRepo.getAppointmentsByPatient(req.user.id);
    res.json({ success: true, appointments });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};