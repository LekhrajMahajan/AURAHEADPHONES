import User from './user.model.js';

// ─── GET /api/users/profile ───────────────────────────────────
export const getProfile = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── PUT /api/users/profile ───────────────────────────────────
export const updateProfile = async (req, res) => {
  try {
    const allowedFields = ['name', 'phone', 'address', 'city', 'state', 'pincode'];
    const updates = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true } 
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
