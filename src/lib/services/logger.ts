import winston from "winston";

const { combine, timestamp, printf, colorize, errors } = winston.format

// Define custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`
})

// Create the logger instance
const logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: combine(
        colorize(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        errors({ stack: true }), // log stack trace for errors
        logFormat
    ),
    transports: [
        new winston.transports.Console(), // log to console
        new winston.transports.File({ filename: "logs/error.log", level: "error" }),
        new winston.transports.File({ filename: "logs/combined.log" })
    ]
})

// In production, log only to files (optional)
if (process.env.NODE_ENV === "production") {
    logger.remove(new winston.transports.Console())
}

export default logger;
