import * as slotRepo from "../repositories/slotRepository.js";

export const getSlotsForDoctor = async (doctorId, start = null, end = null) => {
  return slotRepo.findSlotsByDoctor(doctorId, start, end);
};
