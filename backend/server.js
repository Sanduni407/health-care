import "dotenv/config";
import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import { startSlotCron } from './cron/slotCron.js';
import authRoutes from "./routes/authRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

//app config
const app = express()
const port = process.env.PORT || 4000;

// middleware
app.use(express.json())
app.use(cors())

//db connection 
connectDB();
startSlotCron();

app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/notifications", notificationRoutes);

app.use("/uploads", express.static("uploads"));

app.get('/' , (req, res) =>{
    res.send("API Working")
})

app.listen(port, ()=>{
    console.log(`Server started on http://localhost:${port}`)
})