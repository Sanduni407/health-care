import * as availabilityRepo from "../repositories/availabilityRepository.js";
import * as slotRepo from "../repositories/slotRepository.js";
import * as appointmentRepo from "../repositories/appointmentRepository.js";
import Doctor from "../models/doctorModel.js";
import Slot from "../models/slotModel.js";
import Appointment from "../models/appointmentModel.js";
import { generateSlotsForNextDays } from "../services/slotGenerationService.js";
import { notifyAffectedPatients } from "../services/notificationService.js";

// Weekly Templates
export const createTemplate = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    const data = { doctor: doctor._id, ...req.body };
    const template = await availabilityRepo.createTemplate(data);

    try {
      await generateSlotsForNextDays(doctor._id, 30);
      console.log(`✅ Slots generated immediately for doctor ${doctor._id}`);
    } catch (slotErr) {
      console.error("⚠️ Error generating slots immediately:", slotErr.message);
    }

    res.json({ success: true, template });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// List templates
export const listTemplates = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    const templates = await availabilityRepo.getTemplatesByDoctor(doctor._id);
    res.json({ success: true, templates });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Delete template
export const deleteTemplate = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    await availabilityRepo.deleteTemplate(req.params.id);
    
    // Regenerate slots
    try {
      await generateSlotsForNextDays(doctor._id, 30);
    } catch (slotErr) {
      console.error("⚠️ Error regenerating slots:", slotErr.message);
    }

    res.json({ success: true, message: "Template deleted" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// One-off availability
export const createOneOff = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    const data = { doctor: doctor._id, ...req.body };
    const oneOff = await availabilityRepo.createOneOff(data);

    // If marking as unavailable, cancel existing appointments and notify patients
    if (oneOff.type === 'unavailable') {
      const startOfDay = new Date(oneOff.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(oneOff.date);
      endOfDay.setHours(23, 59, 59, 999);

      // Cancel appointments for this date
      const appointments = await Appointment.find({
        doctor: doctor._id,
        start: { $gte: startOfDay, $lte: endOfDay },
        status: 'booked'
      });

      // for (const appointment of appointments) {
      //   await appointmentRepo.cancelAppointment(appointment._id);
      //   await slotRepo.markSlotAvailable(appointment.slot);
      // }

       for (const appointment of appointments) {
        await slotRepo.deleteSlotsForDate(doctor._id,oneOff.date);
      }

      // Notify affected patients
      const affectedCount = await notifyAffectedPatients(doctor._id, oneOff.date);
      
      res.json({ 
        success: true, 
        oneOff, 
        message: `${affectedCount} appointment(s) cancelled and patients notified` 
      });
    } else {
      // Regenerate slots for affected date
      try {
        await generateSlotsForNextDays(doctor._id, 1);
        console.log(`✅ Slots regenerated for doctor ${doctor._id}`);
      } catch (slotErr) {
        console.error("⚠️ Error regenerating slots:", slotErr.message);
      }

      res.json({ success: true, oneOff });
    }
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const listOneOffs = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    const oneOffs = await availabilityRepo.getOneOffsByDoctor(doctor._id);
    res.json({ success: true, oneOffs });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Delete one-off
export const deleteOneOff = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    await availabilityRepo.deleteOneOff(req.params.id);
    
    // Regenerate slots
    try {
      await generateSlotsForNextDays(doctor._id, 30);
    } catch (slotErr) {
      console.error("⚠️ Error regenerating slots:", slotErr.message);
    }

    res.json({ success: true, message: "One-off availability deleted" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const getDoctorSlots = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    const { date, start, end } = req.query;

    let startDate = null, endDate = null;

    if (date) {
      const d = new Date(date);
      startDate = new Date(d.setHours(0, 0, 0, 0));
      endDate = new Date(d.setHours(23, 59, 59, 999));
    }

    if (start && end) {
      startDate = new Date(start);
      endDate = new Date(end);
    }

    const slots = await slotRepo.findSlotsByDoctor(doctor._id, startDate, endDate);

    res.json({ success: true, count: slots.length, slots });
  } catch (err) {
    console.error("Error fetching doctor slots:", err);
    res.json({ success: false, message: err.message });
  }
};

export const getDoctorAvailableDates = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const slots = await Slot.find({ doctor: doctorId, isBooked: false });
    const uniqueDates = [...new Set(slots.map(s => s.start.toISOString().split('T')[0]))];
    res.json({ success: true, dates: uniqueDates });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const getDoctorSlotsByDate = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;
    const start = new Date(`${date}T00:00:00.000Z`);
    const end = new Date(`${date}T23:59:59.999Z`);
    const slots = await Slot.find({
      doctor: doctorId,
      isBooked: false,
      start: { $gte: start, $lte: end }
    }).sort({ start: 1 });
    res.json({ success: true, count: slots.length, slots });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};