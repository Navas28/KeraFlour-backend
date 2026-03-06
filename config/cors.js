const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://keraflour.vercel.app",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

export default corsOptions;
