import rateLimit from "express-rate-limit";

// Rate limiter for login
export const loginLimiter = rateLimit({
    windowMs : 60 * 1000, // Rate limit set per 1 minute
    limit: 5,

    standardHeaders: "draft-8",
    legacyHeaders: false,

    message: {
        message: "Too many login attempts. Please try again later.",
    },
});

// Rate limiter for register
export const registerLimiter = rateLimit({
    windowMs : 60* 1000, // rate limit set per 1 minute again
    limit : 3,

    standardHeaders: "draft-8",
    legacyHeaders:false,

    message: {
        message : "Too many registration attempts. Please try again later."
    },
});