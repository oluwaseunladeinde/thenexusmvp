import winston from "winston";
import fs from "fs";

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Ensure logs directory exists
if (!fs.existsSync("logs")) {
    fs.mkdirSync("logs", { recursive: true });
}

// Define custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`
})

// Build transports array based on environment
const transports: winston.transport[] = [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" })
];

// Add console transport only in non-production environments
if (process.env.NODE_ENV !== "production") {
    transports.push(new winston.transports.Console({
        format: combine(
            colorize(),
            timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            errors({ stack: true }),
            logFormat
        )
    }));
}

const logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        errors({ stack: true }), // log stack trace for errors
        logFormat
    ),
    transports
})


export default logger;
