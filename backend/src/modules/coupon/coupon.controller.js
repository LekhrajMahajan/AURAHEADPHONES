import Coupon from './coupon.model.js';

// GET all coupons (Admin)
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST create coupon (Admin)
export const createCoupon = async (req, res) => {
  try {
    const coupon = new Coupon(req.body);
    coupon.code = coupon.code.toUpperCase();
    const saved = await coupon.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Coupon code already exists.' });
    res.status(500).json({ message: err.message });
  }
};

// DELETE a coupon (Admin)
export const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coupon deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST validate coupon (Public — for checkout)
export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ message: 'Invalid or inactive coupon.' });

    const now = new Date();
    if (coupon.expiryDate < now) return res.status(400).json({ message: 'Coupon has expired.' });
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit)
      return res.status(400).json({ message: 'Coupon usage limit reached.' });

    // Increment usage
    coupon.usedCount += 1;
    await coupon.save();

    res.json({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
