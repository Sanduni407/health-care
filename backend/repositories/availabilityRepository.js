import AvailabilityTemplate from "../models/availabilityTemplateModel.js";
import OneOffAvailability from "../models/oneOffAvailabilityModel.js";

export const createTemplate = (data) => new AvailabilityTemplate(data).save();
export const getTemplatesByDoctor = (doctorId) => AvailabilityTemplate.find({ doctor: doctorId }).sort({ dayOfWeek: 1, startTime: 1 });
export const deleteTemplate = (templateId) => AvailabilityTemplate.findByIdAndDelete(templateId);

export const createOneOff = (data) => new OneOffAvailability(data).save();
export const getOneOffsByDoctor = (doctorId, date = null) => {
  const query = { doctor: doctorId };
  if (date) query.date = date;
  return OneOffAvailability.find(query).sort({ date: 1, startTime: 1 });
};
export const deleteOneOff = (oneOffId) => OneOffAvailability.findByIdAndDelete(oneOffId);