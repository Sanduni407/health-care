import * as availabilityRepo from "../repositories/availabilityRepository.js";
import * as slotRepo from "../repositories/slotRepository.js";
import * as appointmentRepo from "../repositories/appointmentRepository.js";
import Doctor from "../models/doctorModel.js";
import Slot from "../models/slotModel.js";
import Appointment from "../models/appointmentModel.js";
import AvailabilityTemplate from "../models/availabilityTemplateModel.js";
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

    // Get the template details BEFORE deleting
    const template = await AvailabilityTemplate.findById(req.params.id);
    
    if (!template) {
      return res.json({ success: false, message: "Template not found" });
    }

    console.log(`🗑️ Deleting template for day ${template.dayOfWeek} (${getDayName(template.dayOfWeek)})`);

    // Find all future dates matching this day of week
    const today = new Date();
    const futureDates = [];
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);
      
      if (checkDate.getDay() === template.dayOfWeek) {
        futureDates.push(new Date(checkDate.setHours(0, 0, 0, 0)));
      }
    }

    console.log(`📅 Found ${futureDates.length} future dates for this day of week`);

    let totalSlotsDeleted = 0;
    let totalAppointmentsCancelled = 0;

    // For each matching date, delete slots and cancel appointments
    for (const date of futureDates) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // Find and cancel appointments for this date
      const appointments = await Appointment.find({
        doctor: doctor._id,
        start: { $gte: startOfDay, $lte: endOfDay },
        status: 'booked'
      });

      console.log(`   ${date.toDateString()}: Found ${appointments.length} appointments`);

      // Cancel each appointment and notify patient
      for (const appointment of appointments) {
        await appointmentRepo.cancelAppointment(appointment._id);
        totalAppointmentsCancelled++;
      }

      // Notify affected patients for this date
      if (appointments.length > 0) {
        await notifyAffectedPatients(doctor._id, date);
      }

      // Delete ALL slots for this date
      const deletedCount = await slotRepo.deleteSlotsForDate(doctor._id, date);
      totalSlotsDeleted += deletedCount;
      console.log(`   Deleted ${deletedCount} slots for ${date.toDateString()}`);
    }

    // Delete the template
    await availabilityRepo.deleteTemplate(req.params.id);

    console.log(`✅ Template deleted: ${totalAppointmentsCancelled} appointments cancelled, ${totalSlotsDeleted} slots deleted`);

    res.json({ 
      success: true, 
      message: `Template deleted. ${totalAppointmentsCancelled} appointment(s) cancelled, ${totalSlotsDeleted} slot(s) deleted, patients notified.` 
    });
  } catch (err) {
    console.error("❌ Error in deleteTemplate:", err);
    res.json({ success: false, message: err.message });
  }
};

// Helper function to get day name
function getDayName(dayNum) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayNum];
}

// One-off availability
export const createOneOff = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    const data = { doctor: doctor._id, ...req.body };
    const oneOff = await availabilityRepo.createOneOff(data);

    // If marking as unavailable, DELETE SLOTS and cancel appointments
    if (oneOff.type === 'unavailable') {
      const startOfDay = new Date(oneOff.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(oneOff.date);
      endOfDay.setHours(23, 59, 59, 999);

      console.log(`🚫 Marking date as unavailable: ${oneOff.date}`);

      // Step 1: Find all appointments for this date
      const appointments = await Appointment.find({
        doctor: doctor._id,
        start: { $gte: startOfDay, $lte: endOfDay },
        status: 'booked'
      });

      console.log(`   Found ${appointments.length} booked appointments`);

      // Step 2: Cancel each appointment
      for (const appointment of appointments) {
        await appointmentRepo.cancelAppointment(appointment._id);
        console.log(`   ✅ Cancelled appointment ${appointment._id}`);
      }

      // Step 3: Notify all affected patients
      const affectedCount = await notifyAffectedPatients(doctor._id, oneOff.date);
      console.log(`   📢 Notified ${affectedCount} patients`);

      // Step 4: DELETE ALL SLOTS for this date (do this ONCE, not in loop)
      const deletedCount = await slotRepo.deleteSlotsForDate(doctor._id, oneOff.date);
      console.log(`   🗑️ Deleted ${deletedCount} slots`);

      res.json({ 
        success: true, 
        oneOff, 
        message: `${affectedCount} appointment(s) cancelled, ${deletedCount} slot(s) deleted, and patients notified` 
      });
    } else {
      // For 'available' type, regenerate slots
      try {
        await generateSlotsForNextDays(doctor._id, 1);
        console.log(`✅ Slots regenerated for doctor ${doctor._id}`);
      } catch (slotErr) {
        console.error("⚠️ Error regenerating slots:", slotErr.message);
      }

      res.json({ success: true, oneOff });
    }
  } catch (err) {
    console.error("❌ Error in createOneOff:", err);
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
    
    // Regenerate slots for next 30 days
    try {
      await generateSlotsForNextDays(doctor._id, 30);
      console.log(`✅ Slots regenerated after deleting one-off`);
    } catch (slotErr) {
      console.error("⚠️ Error regenerating slots:", slotErr.message);
    }

    res.json({ success: true, message: "One-off availability deleted and slots regenerated" });
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
    // Only return dates with unbooked slots
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