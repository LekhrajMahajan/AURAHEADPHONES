import jwt from 'jsonwebtoken';
import Admin from './admin.model.js';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'aura_admin_fallback_secret', {
    expiresIn: '7d',
  });
};

// @desc    Auth admin & get token
// @route   POST /api/admin/auth/login
// @access  Public
export const authAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if initial admin needs to be created
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      if (email === process.env.ADMIN_INITIAL_EMAIL && password === process.env.ADMIN_INITIAL_PASSWORD) {
        const admin = await Admin.create({ email, password, role: 'superadmin' });
        return res.json({
          _id: admin._id,
          email: admin.email,
          role: admin.role,
          token: generateToken(admin._id, admin.role),
        });
      }
    }

    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin._id, admin.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update admin credentials
// @route   PUT /api/admin/auth/update
// @access  Private (Admin)
export const updateAdminCredentials = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);

    if (admin) {
      admin.email = req.body.email || admin.email;
      if (req.body.password) {
        admin.password = req.body.password;
      }

      const updatedAdmin = await admin.save();

      res.json({
        _id: updatedAdmin._id,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
        token: generateToken(updatedAdmin._id, updatedAdmin.role),
      });
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
