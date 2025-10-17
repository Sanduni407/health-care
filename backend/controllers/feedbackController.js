import * as feedbackService from "../services/feedbackService.js";

// Create feedback
export const createFeedback = async (req, res) => {
  try {
    const feedbackData = {
      ...req.body,
      patient: req.user.id,
      attachment: req.file ? `/uploads/feedbacks/${req.file.filename}` : undefined
    };
    const feedback = await feedbackService.createFeedback(feedbackData);
    res.json({ success: true, feedback });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Get doctor's feedbacks
export const getDoctorFeedbacks = async (req, res) => {
  try {
    const { status, tag } = req.query;
    const feedbacks = await feedbackService.getDoctorFeedbacks(
      req.user.id,
      status,
      tag
    );
    res.json({ success: true, feedbacks });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Get feedback details
export const getFeedbackDetails = async (req, res) => {
  try {
    const feedback = await feedbackService.getFeedbackDetails(req.params.id);
    res.json({ success: true, feedback });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Send urgent response
export const sendUrgentResponse = async (req, res) => {
  try {
    const { reply } = req.body;
    const response = await feedbackService.sendUrgentResponse(
      req.params.id,
      req.user.id,
      reply
    );
    res.json({ success: true, response });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Flag concern
export const flagConcern = async (req, res) => {
  try {
    const { concern } = req.body;
    const flagged = await feedbackService.flagConcern(
      req.params.id,
      req.user.id,
      concern
    );
    res.json({ success: true, flagged });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Mark remark as reviewed
export const markRemarkReviewed = async (req, res) => {
  try {
    const feedback = await feedbackService.markRemarkReviewed(req.params.id);
    res.json({ success: true, feedback });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Get patient's urgent responses
export const getPatientUrgentResponses = async (req, res) => {
  try {
    const responses = await feedbackService.getPatientUrgentResponses(req.user.id);
    res.json({ success: true, responses });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Get urgent response details
export const getUrgentResponseDetails = async (req, res) => {
  try {
    const response = await feedbackService.getUrgentResponseDetails(req.params.id);
    res.json({ success: true, response });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Get all flagged concerns (admin only)
export const getAllFlaggedConcerns = async (req, res) => {
  try {
    const concerns = await feedbackService.getAllFlaggedConcerns();
    res.json({ success: true, concerns });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Get flagged concern details
export const getFlaggedConcernDetails = async (req, res) => {
  try {
    const concern = await feedbackService.getFlaggedConcernDetails(req.params.id);
    res.json({ success: true, concern });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Get all doctors (for dropdown)
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await feedbackService.getAllDoctors();
    res.json({ success: true, doctors });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};