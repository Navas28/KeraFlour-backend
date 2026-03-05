import rateLimit from "express-rate-limit";

// Max 100 requests per 15 minutes
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

//  Max 20 attempts per hour
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: {
    message: "Too many login attempts, please try again after an hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
