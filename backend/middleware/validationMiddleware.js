const validateTask = (req, res, next) => {
  const { title } = req.body || {};

  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      message: "Title is required",
      error: "Validation failed"
    });
  }

  next();
};

module.exports = validateTask;
