import AvailabilityTemplate from '../models/availabilityTemplateModel.js';
import OneOffAvailability from '../models/oneOffAvailabilityModel.js';
import Slot from '../models/slotModel.js';
import Doctor from '../models/doctorModel.js';
import { addMinutes, setHours, setMinutes, startOfDay, isSameDay } from 'date-fns';

export const generateSlotsForDate = async (doctorId, date) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) throw new Error('Doctor not found');

  const consultationDuration = doctor.consultationDuration || 15;

  const dayOfWeek = date.getDay();
  const templates = await AvailabilityTemplate.find({ doctor: doctorId, dayOfWeek });
  const oneOffs = await OneOffAvailability.find({ doctor: doctorId, date });

  const slotsToCreate = [];

  for (let template of templates) {
    let [startHour, startMin] = template.startTime.split(':').map(Number);
    let [endHour, endMin] = template.endTime.split(':').map(Number);

    let slotStart = setMinutes(setHours(startOfDay(date), startHour), startMin);
    let slotEnd = setMinutes(setHours(startOfDay(date), endHour), endMin);

    while (slotStart < slotEnd) {
      const slotFinish = addMinutes(slotStart, consultationDuration);

      const blocked = oneOffs.some(o => o.type === 'unavailable' &&
        o.startTime && o.endTime &&
        slotStart >= setMinutes(setHours(startOfDay(o.date), ...o.startTime.split(':').map(Number))) &&
        slotFinish <= setMinutes(setHours(startOfDay(o.date), ...o.endTime.split(':').map(Number)))
      );

      if (!blocked) {
        slotsToCreate.push({
          doctor: doctorId,
          start: slotStart,
          end: slotFinish,
          source: 'template'
        });
      }
      slotStart = slotFinish;
    }
  }

  const existingSlots = await Slot.find({
    doctor: doctorId,
    start: { $gte: startOfDay(date), $lt: addMinutes(startOfDay(date), 24*60) }
  }).select('start');

  const existingStarts = existingSlots.map(s => s.start.getTime());
  const filteredSlots = slotsToCreate.filter(s => !existingStarts.includes(s.start.getTime()));

  if (filteredSlots.length) await Slot.insertMany(filteredSlots);

  return filteredSlots;
};

export const generateSlotsForNextDays = async (doctorId, days = 30) => {
  const today = new Date();
  const generatedSlots = [];

  for (let i = 0; i < days; i++) {
    const date = addMinutes(today, i * 24 * 60);
    const slots = await generateSlotsForDate(doctorId, date);
    generatedSlots.push(...slots);
  }

  return generatedSlots;
};
