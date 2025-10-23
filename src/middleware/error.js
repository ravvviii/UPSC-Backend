export const notFound = (req, res, next) => {
  next({ status: 404, message: "Not found" });
};

export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Server error";
  const details = err.details || null;

  if (process.env.NODE_ENV !== "production") {
    console.error("❌ Error:", err);
  }

  res.status(status).json({
    error: {
      message,
      ...(details && { details }),
    },
  });
};
