import Doctor from '../models/doctorModel.js';

// Update/create by userId
export const createOrUpdateByUserId = (userId, data) => 
  Doctor.findOneAndUpdate({ user: userId }, { $set: data }, { upsert: true, new: true });

// Update by doctor _id
export const findByIdAndUpdate = (doctorId, data) => 
  Doctor.findByIdAndUpdate(doctorId, { $set: data }, { new: true });

export const findByUserId = (userId) => Doctor.findOne({ user: userId }).populate('user', '-password');
export const findById = (doctorId) => Doctor.findById(doctorId).populate('user', '-password');

export const searchDoctors = ({ q, specialization }) => {
  const filter = {};
  if (specialization) filter.specializations = { $in: [specialization] };
  if (q) filter.$or = [
    { bio: { $regex: q, $options: 'i' } },
    { specializations: { $regex: q, $options: 'i' } }
  ];
  return Doctor.find(filter).populate('user', '-password').sort({ createdAt: -1 });
};
