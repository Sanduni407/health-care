import Feedback from "../models/feedbackModel.js";
import UrgentResponse from "../models/urgentResponseModel.js";
import FlaggedConcern from "../models/flaggedConcernModel.js";

// Feedback operations
export const createFeedback = (feedbackData) => new Feedback(feedbackData).save();

export const getFeedbacksByDoctor = (doctorId, status = null, tag = null) => {
  const query = { doctor: doctorId };
  if (status) query.status = status;
  if (tag) query.tag = tag;
  return Feedback.find(query)
    .populate("patient", "name email")
    .sort({ createdAt: -1 });
};

export const getFeedbackById = (id) => 
  Feedback.findById(id).populate("patient", "name email").populate("doctor", "name");

export const updateFeedbackStatus = (id, status) => 
  Feedback.findByIdAndUpdate(id, { status }, { new: true });

// Urgent Response operations
export const createUrgentResponse = (responseData) => new UrgentResponse(responseData).save();

export const getUrgentResponsesByPatient = (patientId) => 
  UrgentResponse.find({ patient: patientId })
    .populate("doctor", "name")
    .populate("feedback")
    .sort({ createdAt: -1 });

export const getUrgentResponseById = (id) => 
  UrgentResponse.findById(id).populate("doctor", "name");

// Flagged Concern operations
export const createFlaggedConcern = (concernData) => new FlaggedConcern(concernData).save();

export const getAllFlaggedConcerns = () => 
  FlaggedConcern.find()
    .populate("patient", "name email")
    .populate("doctor", "name")
    .populate("feedback")
    .sort({ createdAt: -1 });

export const getFlaggedConcernById = (id) => 
  FlaggedConcern.findById(id)
    .populate("patient", "name email")
    .populate("doctor", "name");