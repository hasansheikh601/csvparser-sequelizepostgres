import { Queue } from "bullmq";
import Redis from "ioredis";

const connection = new Redis();

export const emailQueue = new Queue("emailQueue", { connection });
