import * as feedbackRepo from "../repositories/feedbackRepository.js";
import * as authRepo from "../repositories/authRepository.js";
import * as notificationService from "./notificationService.js";  // ADD THIS IMPORT

// Create feedback
export const createFeedback = async (feedbackData) => {
  return await feedbackRepo.createFeedback(feedbackData);
};

// Get feedbacks for doctor
export const getDoctorFeedbacks = async (doctorId, status, tag) => {
  return await feedbackRepo.getFeedbacksByDoctor(doctorId, status, tag);
};

// Get single feedback
export const getFeedbackDetails = async (feedbackId) => {
  const feedback = await feedbackRepo.getFeedbackById(feedbackId);
  if (!feedback) throw new Error("Feedback not found");
  return feedback;
};

// Send urgent response - UPDATED WITH NOTIFICATION
export const sendUrgentResponse = async (feedbackId, doctorId, reply) => {
  const feedback = await feedbackRepo.getFeedbackById(feedbackId);
  if (!feedback) throw new Error("Feedback not found");
  if (feedback.tag !== "urgent") throw new Error("Can only respond to urgent feedbacks");

  // Get doctor info
  const doctor = await authRepo.findUserById(doctorId);

  // Create urgent response
  const response = await feedbackRepo.createUrgentResponse({
    feedback: feedbackId,
    doctor: doctorId,
    patient: feedback.patient._id,
    reply,
    feedbackTitle: feedback.title
  });

  // Mark feedback as reviewed
  await feedbackRepo.updateFeedbackStatus(feedbackId, "reviewed");

  // ✅ CREATE NOTIFICATION FOR PATIENT
  await notificationService.createUrgentResponseNotification(
    response,
    feedback.title,
    doctor.name
  );

  return response;
};

// Flag concern - UPDATED WITH NOTIFICATION
export const flagConcern = async (feedbackId, doctorId, concern) => {
  const feedback = await feedbackRepo.getFeedbackById(feedbackId);
  if (!feedback) throw new Error("Feedback not found");
  if (feedback.tag !== "concern") throw new Error("Can only flag concern feedbacks");

  // Get doctor and patient info
  const doctor = await authRepo.findUserById(doctorId);
  const patient = await authRepo.findUserById(feedback.patient._id);

  // Create flagged concern
  const flagged = await feedbackRepo.createFlaggedConcern({
    feedback: feedbackId,
    doctor: doctorId,
    patient: feedback.patient._id,
    concern,
    feedbackTitle: feedback.title
  });

  // Mark feedback as reviewed
  await feedbackRepo.updateFeedbackStatus(feedbackId, "reviewed");

  // ✅ CREATE NOTIFICATION FOR ALL ADMINS
  await notificationService.createConcernFlaggedNotification(
    flagged,
    feedback.title,
    doctor.name,
    patient.name
  );

  return flagged;
};

// Mark remark as reviewed
export const markRemarkReviewed = async (feedbackId) => {
  const feedback = await feedbackRepo.getFeedbackById(feedbackId);
  if (!feedback) throw new Error("Feedback not found");
  if (feedback.tag !== "remark") throw new Error("Can only mark remark feedbacks");

  return await feedbackRepo.updateFeedbackStatus(feedbackId, "reviewed");
};

// Get urgent responses for patient
export const getPatientUrgentResponses = async (patientId) => {
  return await feedbackRepo.getUrgentResponsesByPatient(patientId);
};

// Get urgent response details
export const getUrgentResponseDetails = async (responseId) => {
  const response = await feedbackRepo.getUrgentResponseById(responseId);
  if (!response) throw new Error("Response not found");
  return response;
};

// Get all flagged concerns (for admin)
export const getAllFlaggedConcerns = async () => {
  return await feedbackRepo.getAllFlaggedConcerns();
};

// Get flagged concern details
export const getFlaggedConcernDetails = async (concernId) => {
  const concern = await feedbackRepo.getFlaggedConcernById(concernId);
  if (!concern) throw new Error("Concern not found");
  return concern;
};

// Get all doctors for dropdown
export const getAllDoctors = async () => {
  const doctors = await authRepo.getAllUsers();
  return doctors.filter(user => user.role === "doctor");
};