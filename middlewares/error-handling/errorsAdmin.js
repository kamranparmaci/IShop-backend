const handleCreateSuperadminErrors = (err, req, res, next) => {
  let errors = [];

  // Check for validation errors
  if (err.name === 'ValidationError') {
    Object.values(err.errors).forEach((val) => errors.push(val.message));
    return res.status(400).json({ success: false, errors });
  }

  // Check for MongoDB errors
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      errors: [
        {
          message: 'A superadmin with this username already exists.',
        },
      ],
    });
  }

  // Internal server error
  return res
    .status(500)
    .json({ success: false, errors: [{ message: 'Internal server error' }] });
};

export default handleCreateSuperadminErrors;
