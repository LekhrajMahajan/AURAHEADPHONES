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

import Order from '../order/order.model.js';

// ─── GET /api/users/admin/all (Admin) ─────────
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 }).select('-firebaseUid');
    // Attach order count and total spending per user
    const enriched = await Promise.all(users.map(async (u) => {
      const orders = await Order.find({ user: u._id });
      const totalSpending = orders.reduce((acc, o) => acc + o.total, 0);
      return { ...u.toObject(), orderCount: orders.length, totalSpending };
    }));
    res.status(200).json(enriched);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── PUT /api/users/admin/:id/block (Admin) ──────
export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.status(200).json({ isBlocked: user.isBlocked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET /api/users/admin/stats (Admin) ───────
export const getAdminStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [totalCustomers, totalOrders, pendingOrders, todayOrders, monthOrders] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ status: 1 }),
      Order.find({ createdAt: { $gte: today } }),
      Order.find({ createdAt: { $gte: monthStart } }),
    ]);

    const todayRevenue = todayOrders.reduce((a, o) => a + o.total, 0);
    const monthRevenue = monthOrders.reduce((a, o) => a + o.total, 0);

    // Sales for last 7 days
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    const recentOrders = await Order.find({ createdAt: { $gte: sevenDaysAgo } });

    const salesByDay = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
      salesByDay[key] = 0;
    }
    recentOrders.forEach(o => {
      const key = new Date(o.createdAt).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
      if (salesByDay[key] !== undefined) salesByDay[key] += o.total;
    });

    // Top products
    const allOrders = await Order.find({});
    const productSales = {};
    allOrders.forEach(o => {
      o.items.forEach(item => {
        if (!productSales[item.name]) productSales[item.name] = { name: item.name, img: item.img, qty: 0, revenue: 0 };
        productSales[item.name].qty += item.quantity;
        productSales[item.name].revenue += item.price * item.quantity;
      });
    });
    const topProducts = Object.values(productSales).sort((a, b) => b.qty - a.qty).slice(0, 5);

    res.status(200).json({
      totalCustomers, totalOrders, pendingOrders,
      todayRevenue, monthRevenue,
      salesGraph: Object.entries(salesByDay).map(([day, revenue]) => ({ day, revenue })),
      topProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
