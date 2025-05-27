import { Worker } from "bullmq";
import Redis from "ioredis";
import sendEmail from "../utils/sendEmail.js";

const connection = new Redis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});

const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    try {
      await sendEmail(job.data);
      console.log(`✅ Email sent to ${job.data.to}`);
    } catch (error) {
      console.error(`❌ Failed to send email to ${job.data.to}:`, err.message);
      throw err;
    }
  },
  { connection }
);
