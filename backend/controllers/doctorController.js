import * as doctorService from '../services/doctorService.js';
import path from 'path';

// Doctor update own profile
export const createOrUpdateProfile = async (req, res) => {
  try {
    const callerRole = req.user.role;
    const targetUserId = (callerRole === 'admin' && req.body.userId) ? req.body.userId : req.user.id;
    const profile = await doctorService.upsertProfile(targetUserId, req.body);
    res.json({ success: true, profile });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Get profile
export const getProfile = async (req, res) => {
  try {
    const doctorId = req.params.id || req.user.id; // id = doctor _id for admin, or logged-in doctor
    let profile;
    if (req.params.id) profile = await doctorService.getByDoctorId(doctorId);
    else profile = await doctorService.getByUserId(doctorId);

    if (!profile) return res.json({ success: false, message: 'Doctor profile not found' });
    res.json({ success: true, profile });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// List doctors
export const listDoctors = async (req, res) => {
  try {
    const { q, specialization } = req.query;
    const doctors = await doctorService.search({ q, specialization });
    res.json({ success: true, doctors });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Upload image for logged-in doctor
export const uploadMyImage = async (req, res) => {
  try {
    if (!req.file) return res.json({ success: false, message: 'No file uploaded' });
    const imagePath = `/uploads/doctors/${req.file.filename}`;
    const profile = await doctorService.upsertProfile(req.user.id, { image: imagePath });
    res.json({ success: true, image: imagePath, profile });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Upload image by doctorId (admin only)
export const uploadImageById = async (req, res) => {
  try {
    if (!req.file) return res.json({ success: false, message: 'No file uploaded' });
    const doctorId = req.params.id;
    const imagePath = `/uploads/doctors/${req.file.filename}`;
    const profile = await doctorService.upsertProfileByDoctorId(doctorId, { image: imagePath });
    res.json({ success: true, image: imagePath, profile });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};


export const getDoctorPublicProfile = async (req, res) => {
  try {
    const doctor = await doctorService.getByDoctorId(req.params.id);
    if (!doctor) return res.json({ success: false, message: "Doctor not found" });
    res.json({ success: true, doctor });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

