import Slot from "../models/slotModel.js";

export const createSlots = (slots) => Slot.insertMany(slots);

export const findSlotsByDoctor = (doctorId, start = null, end = null) => {
  const query = { doctor: doctorId };
  if (start && end) query.start = { $gte: start, $lt: end };
  return Slot.find(query).sort({ start: 1 });
};

export const findSlotById = (id) => Slot.findById(id);

export const markSlotBooked = (slotId, appointmentId) => 
  Slot.findByIdAndUpdate(slotId, { isBooked: true, appointmentId }, { new: true });

export const markSlotAvailable = (slotId) =>
  Slot.findByIdAndUpdate(slotId, { isBooked: false, appointmentId: null }, { new: true });

// Delete all slots for a doctor on a specific date
export const deleteSlotsForDate = async (doctorId, date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const result = await Slot.deleteMany({
    doctor: doctorId,
    start: { $gte: startOfDay, $lte: endOfDay }
  });

  return result.deletedCount;
};