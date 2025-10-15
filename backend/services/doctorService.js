import * as doctorRepo from '../repositories/doctorRepository.js';

// For logged-in doctor (by userId)
export const upsertProfile = async (userId, profileData) => {
  const allowed = ['title','bio','education','experienceYears','specializations','consultationDuration','fees','image'];
  const data = {};
  allowed.forEach(k => { if (profileData[k] !== undefined) data[k] = profileData[k]; });
  return doctorRepo.createOrUpdateByUserId(userId, data);
};

// Admin: update by doctor _id
export const upsertProfileByDoctorId = async (doctorId, profileData) => {
  const allowed = ['title','bio','education','experienceYears','specializations','consultationDuration','fees','image'];
  const data = {};
  allowed.forEach(k => { if (profileData[k] !== undefined) data[k] = profileData[k]; });
  return doctorRepo.findByIdAndUpdate(doctorId, data);
};

// Get profile
export const getByUserId = (userId) => doctorRepo.findByUserId(userId);
export const getByDoctorId = (doctorId) => doctorRepo.findById(doctorId);

export const search = (params) => doctorRepo.searchDoctors(params);
