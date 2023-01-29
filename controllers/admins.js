import User from '../models/User';

export const createSuperadmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return res
        .status(400)
        .json({ success: false, message: 'Email already exists' });
    }

    const superadmin = new User({
      username,
      password,
      email,
      role: 'superadmin',
      avatar: req.file.path,
      isActive: true,
      isAdmin: true,
      permissions: ['view', 'create', 'edit', 'delete'],
    });

    await superadmin.save();

    const token = superadmin.generateToken();

    return res.status(201).json({
      success: true,
      message: 'Superadmin created successfully',
      data: {
        superadmin,
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createAdmin = async (req, res) => {
  //check if the user is a superadmin
  const user = req.user;
  if (user.role !== 'superadmin') {
    return res.status(401).json({
      error: 'You are not authorized to create an admin',
    });
  }

  const { username, password, email, role, permissions } = req.body;
  try {
    //check if the admin already exists
    let admin = await User.findOne({ email });
    if (admin) {
      return res.status(400).json({
        error: 'Admin already exists',
      });
    }

    //create the admin
    admin = new User({
      username,
      password,
      email,
      role: 'admin',
      isActive: true,
      isAdmin: true,
      lastLogin: Date.now(),
      permissions: ['view', 'create', 'edit', 'delete'],
    });

    await admin.save();
    return res.status(201).json({
      message: 'Admin created successfully',
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Error creating admin. Please try again later.',
    });
  }
};

const loginAdmin = async (req, res) => {
  try {
    // Find admin by email
    const admin = await User.findOne({ email: req.body.email });
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(req.body.password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token and send it to client
    const token = await admin.generateAuthToken();
    return res.status(200).json({
      message: 'Admin logged in successfully',
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

const getAdmin = async (req, res) => {
  try {
    const adminId = req.params.id;
    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json({ admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving admin' });
  }
};

const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({
      role: { $in: ['admin', 'manager', 'superadmin', 'moderator'] },
    });
    if (req.user.role === 'superadmin') {
      return res.status(200).json({
        success: true,
        data: admins,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

const updateAdmin = async (req, res) => {
  const { username, email, password, role, permissions, isActive, avatar } =
    req.body;
  const adminId = req.params.id;
  const admin = await User.findById(adminId);

  // Check if admin exists
  if (!admin) return res.status(404).send('Admin not found');

  // Check if admin is a superadmin and has the ability to change role and permissions
  if (req.admin.role === 'superadmin') {
    admin.role = role;
    admin.permissions = permissions;
    admin.isActive = isActive;
  }

  // Check if admin is updating their own account
  if (req.admin._id === adminId) {
    admin.username = username;
    admin.email = email;
    admin.avatar = avatar;
    if (password) admin.password = await bcrypt.hash(password, SALT_I);
  }

  await admin.save();
  res.status(200).send('Admin updated successfully');
};

const deleteAdmin = async (id) => {
  // check if the user trying to delete the admin is a superadmin
  const currentUser = await User.findById(req.user.id);
  if (currentUser.role !== 'superadmin') {
    throw new Error('Only superadmins can delete other admins');
  }

  // find the admin to be deleted by their id
  const admin = await User.findById(id);
  if (!admin) {
    throw new Error('Admin not found');
  }

  // remove the admin from the database
  await admin.remove();
  return { message: 'Admin deleted successfully' };
};

const logoutAdmin = async (req, res) => {
  try {
    req.session.destroy();
    res.status(200).json({
      message: 'Admin logged out successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error logging out admin',
      error: error.message,
    });
  }
};

export {
  createAdmin,
  loginAdmin,
  deleteAdmin,
  getAdmin,
  getAdmins,
  updateAdmin,
  logoutAdmin,
};
