import User from '../user/user.model.js';

// ─── POST /api/auth/sync ──────────────────────────────────────
export const syncUser = async (req, res) => {
  try {
    const { uid, email, name } = req.firebaseUser;

    let user = await User.findOne({ firebaseUid: uid });

    if (user) {
      return res.status(200).json(user);
    }

    user = await User.create({
      firebaseUid: uid,
      name:        name || 'Aura User',
      email:       email.toLowerCase(),
    });

    console.log(`New user synced: ${email}`);
    res.status(201).json(user);

  } catch (error) {
    if (error.code === 11000) {
      const existingUser = await User.findOne({
        email: req.firebaseUser?.email
      });
      if (existingUser) return res.status(200).json(existingUser);
    }
    console.error('Sync Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};