import cron from 'node-cron';
import Doctor from '../models/doctorModel.js';
import { generateSlotsForNextDays } from '../services/slotGenerationService.js';

export const startSlotCron = () => {
  cron.schedule('0 0 * * *', async () => { // runs daily at midnight
    console.log('Slot generation cron running...');
    try {
      const doctors = await Doctor.find({});
      for (let doctor of doctors) {
        await generateSlotsForNextDays(doctor._id, 30);
      }
      console.log('Slot generation completed');
    } catch (err) {
      console.error('Slot generation error:', err);
    }
  });
};
