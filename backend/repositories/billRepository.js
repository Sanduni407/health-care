import Bill from "../models/billModel.js";

// Get all bills for a patient
export const getBillsByPatient = (patientId, status = null) => {
  const filter = { patient: patientId };
  if (status) filter.status = status;
  return Bill.find(filter)
    .populate({
      path: 'appointments',
      populate: {
        path: 'doctor',
        populate: { path: 'user', select: 'name email' }
      }
    })
    .sort({ createdAt: -1 });
};

// Get pending bills for a patient
export const getPendingBillsByPatient = (patientId) => {
  return Bill.find({ 
    patient: patientId, 
    status: { $in: ['pending', 'partially_paid'] } 
  })
    .populate({
      path: 'appointments',
      populate: {
        path: 'doctor',
        populate: { path: 'user', select: 'name email' }
      }
    })
    .sort({ createdAt: -1 });
};

// Create a new bill
export const createBill = (data) => new Bill(data).save();

// Get bill by ID
export const getBillById = (billId) => 
  Bill.findById(billId).populate({
    path: 'appointments',
    populate: {
      path: 'doctor',
      populate: { path: 'user', select: 'name email' }
    }
  });

// Update bill
export const updateBill = (billId, data) => 
  Bill.findByIdAndUpdate(billId, { $set: data }, { new: true });

// Mark bill as paid
export const markBillAsPaid = (billId, paymentData) => 
  Bill.findByIdAndUpdate(
    billId, 
    { 
      $set: { 
        status: 'paid', 
        paidAmount: paymentData.amount,
        paymentMethod: paymentData.method,
        transactionId: paymentData.transactionId,
        paidAt: new Date() 
      } 
    }, 
    { new: true }
  );

// Get all bills (admin)
export const getAllBills = () => 
  Bill.find()
    .populate('patient', 'name email')
    .populate({
      path: 'appointments',
      populate: {
        path: 'doctor',
        populate: { path: 'user', select: 'name email' }
      }
    })
    .sort({ createdAt: -1 });