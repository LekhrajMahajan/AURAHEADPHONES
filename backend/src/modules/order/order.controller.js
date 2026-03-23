import Order from './order.model.js';

// ─── POST /api/orders ─────────────────────────────────────────
export const createOrder = async (req, res) => {
  try {
    const { items, total, paymentMethod, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order items cannot be empty' });
    }
    if (!total || total <= 0) {
      return res.status(400).json({ message: 'Invalid order total' });
    }

    const cleanItems = items.map(item => {
      const cleanItem = {
        name: item.name,
        img: item.img || '',
        price: item.price,
        quantity: item.quantity || 1,
      };
      if (item.product && String(item.product).length === 24) {
        cleanItem.product = item.product;
      }
      return cleanItem;
    });

    const order = await Order.create({
      user: req.user._id,
      items: cleanItems,
      total: Math.round(total),
      paymentMethod: paymentMethod || 'card',
      shippingAddress: shippingAddress || {},
    });

    res.status(201).json(order);

  } catch (error) {
    console.error('Create Order Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// ─── GET /api/orders/myorders ─────────────────────────────────
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
