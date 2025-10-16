import * as billService from "../services/billService.js";
import Appointment from "../models/appointmentModel.js";

// TEST ENDPOINT - Check appointments
export const testAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id });
    res.json({ 
      success: true, 
      total: appointments.length,
      pending: appointments.filter(a => a.paymentStatus === 'pending').length,
      appointments: appointments.map(a => ({
        id: a._id,
        status: a.status,
        paymentStatus: a.paymentStatus,
        reason: a.reason
      }))
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Get outstanding bills for logged-in patient
export const getOutstandingBills = async (req, res) => {
  try {
    const result = await billService.getOutstandingBills(req.user.id);
    res.json({ success: true, ...result });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Process payment for selected appointments
export const makePayment = async (req, res) => {
  try {
    const { appointmentIds, paymentMethod, transactionId } = req.body;
    
    if (!appointmentIds || !Array.isArray(appointmentIds) || appointmentIds.length === 0) {
      return res.json({ success: false, message: "Please select at least one appointment" });
    }

    const bill = await billService.processPayment({
      patientId: req.user.id,
      appointmentIds,
      paymentMethod: paymentMethod || 'cash',
      transactionId
    });

    res.json({ success: true, message: "Payment successful", bill });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Get payment history
export const getPaymentHistory = async (req, res) => {
  try {
    const bills = await billService.getPaymentHistory(req.user.id);
    res.json({ success: true, bills });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Get bill details
export const getBillDetails = async (req, res) => {
  try {
    const bill = await billService.getBillDetails(req.params.id);
    if (!bill) {
      return res.json({ success: false, message: "Bill not found" });
    }
    res.json({ success: true, bill });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Get all bills (admin only)
export const getAllBills = async (req, res) => {
  try {
    const bills = await billService.getAllBills();
    res.json({ success: true, bills });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Cancel bill (admin only)
export const cancelBill = async (req, res) => {
  try {
    const bill = await billService.cancelBill(req.params.id);
    res.json({ success: true, message: "Bill cancelled", bill });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};