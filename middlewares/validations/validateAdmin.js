import pkg from "validator";
const { check, validationResult } = pkg;

const validateCreateSuperadmin = (req, res, next) => {
  const { username, email, password } = req.body;

  // Check for valid username
  check(username, "Username is required").notEmpty();
  check(username, "Username must be at least 4 characters long").isLength({
    min: 4,
  });

  // Check for valid email
  check(email, "Email is required").notEmpty();
  check(email, "Please enter a valid email").isEmail();

  // Check for valid password
  check(password, "Password is required").notEmpty();
  check(password, "Password must be at least 8 characters long").isLength({
    min: 8,
  });

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export { validateCreateSuperadmin };
