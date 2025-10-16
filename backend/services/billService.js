import * as billRepo from "../repositories/billRepository.js";
import Appointment from "../models/appointmentModel.js";
import Doctor from "../models/doctorModel.js";

// Get outstanding bills for a patient (auto-generated from unpaid appointments)
export const getOutstandingBills = async (patientId) => {
  // Find all booked/completed appointments with pending payment
  const appointments = await Appointment.find({
    patient: patientId,
    status: { $in: ['booked', 'completed'] },
    paymentStatus: 'pending'
  }).populate({
    path: 'doctor',
    populate: { path: 'user', select: 'name email' }
  });

  console.log('Found appointments:', appointments.length); // Debug log

  // Group and calculate bills
  const bills = await Promise.all(
    appointments.map(async (appointment) => {
      const doctor = await Doctor.findById(appointment.doctor);
      console.log('Doctor fees:', doctor?.fees); // Debug log
      return {
        appointmentId: appointment._id,
        patientId: appointment.patient,
        doctorName: doctor?.user?.name || 'Unknown Doctor',
        doctorSpecialization: doctor?.specializations?.[0] || 'General',
        appointmentDate: appointment.start,
        reason: appointment.reason || 'Consultation',
        amount: doctor?.fees || 0,
        status: appointment.paymentStatus,
        appointmentStatus: appointment.status
      };
    })
  );

  const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);

  console.log('Bills generated:', bills); // Debug log
  console.log('Total amount:', totalAmount); // Debug log

  return {
    bills,
    totalAmount,
    count: bills.length
  };
};

// Process payment for selected appointments
export const processPayment = async ({ patientId, appointmentIds, paymentMethod, transactionId }) => {
  if (!appointmentIds || appointmentIds.length === 0) {
    throw new Error("No appointments selected");
  }

  // Fetch appointments and calculate total
  const appointments = await Appointment.find({
    _id: { $in: appointmentIds },
    patient: patientId,
    paymentStatus: 'pending'
  }).populate('doctor');

  if (appointments.length === 0) {
    throw new Error("No valid appointments found");
  }

  let totalAmount = 0;
  for (const appointment of appointments) {
    const doctor = await Doctor.findById(appointment.doctor);
    totalAmount += doctor?.fees || 0;
  }

  // Create bill record
  const bill = await billRepo.createBill({
    patient: patientId,
    appointments: appointmentIds,
    totalAmount,
    paidAmount: totalAmount,
    status: 'paid',
    paymentMethod,
    transactionId,
    paidAt: new Date()
  });

  // Update appointment: payment status AND appointment status
  await Appointment.updateMany(
    { _id: { $in: appointmentIds } },
    { 
      $set: { 
        paymentStatus: 'paid',
        status: 'completed'  // Mark appointment as completed after payment
      } 
    }
  );

  return bill;
};

// Get payment history
export const getPaymentHistory = async (patientId) => {
  return billRepo.getBillsByPatient(patientId, 'paid');
};

// Get specific bill details
export const getBillDetails = async (billId) => {
  return billRepo.getBillById(billId);
};

// Cancel bill (admin only)
export const cancelBill = async (billId) => {
  const bill = await billRepo.getBillById(billId);
  if (!bill) throw new Error("Bill not found");
  
  if (bill.status === 'paid') {
    throw new Error("Cannot cancel paid bill");
  }

  return billRepo.updateBill(billId, { status: 'cancelled' });
};

// Get all bills (admin)
export const getAllBills = async () => {
  return billRepo.getAllBills();
};