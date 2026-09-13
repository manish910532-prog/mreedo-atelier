const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = 5000;
const DB_FILE = path.join(__dirname, 'orders.json');

// Ensure permanent DB file exists
function loadOrders() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify([]));
      return [];
    }
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
}

function saveOrders(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Database save failed:", e);
  }
}

// Single Hero Product with Exact 4 Colors
const products = [
  {
    id: 1,
    name: "240 GSM Atelier Drop-Shoulder Heavy Tee",
    category: "Atelier Knitwear",
    tag_mrp: 1649,
    retail_price: 599,
    images: [
      { url: "/tee1.jpg", colorName: "Onyx Black", hex: "#171717" },
      { url: "/tee2.jpg", colorName: "Chalk White", hex: "#f5f5f0" },
      { url: "/tee3.jpg", colorName: "Deep Navy", hex: "#1f293d" },
      { url: "/tee4.jpg", colorName: "Imperial Maroon", hex: "#5e1d24" }
    ],
    rating: 4.9,
    ratingCount: 148,
    likes: 412,
    specs: "240-250 GSM Heavy French Terry, 100% Super-Combed Compact Cotton, Bio-Polished",
    description: "Architecturally cut drop-shoulder heavyweight t-shirt crafted from 240+ GSM dense combed French Terry cotton. Features zero-sag micro-ribbed collar, reinforced high-tensile stitching, and signature MREEDO gold crest insignia.",
    sizes: ["S (38)", "M (40)", "L (42)", "XL (44)"],
    reviews: [
      { user: "Vikram R.", stars: 5, comment: "The 240 GSM density is phenomenal. Fits like European couture streetwear.", date: "Yesterday" },
      { user: "Sahil K.", stars: 5, comment: "All 4 colors look royal. Pure heavy cotton zero see-through.", date: "3 days ago" }
    ]
  }
];

app.get('/api/products', (req, res) => {
  res.json({ success: true, count: products.length, data: products });
});

// Create Order (Permanent Storage)
app.post('/api/orders', (req, res) => {
  const { customer, items, itemsSubtotal, shippingFee, totalAmount, paymentMethod, advancePaid, balanceDue, paymentId } = req.body;

  if (!customer || !items || items.length === 0) {
    return res.status(400).json({ success: false, message: "Cart is empty" });
  }

  const orders = loadOrders();
  const newOrder = {
    orderId: "MRD-" + Math.floor(100000 + Math.random() * 900000),
    timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    customer,
    items,
    itemsSubtotal,
    shippingFee,
    totalAmount,
    paymentMethod,
    advancePaid: advancePaid || 0,
    balanceDue: balanceDue || 0,
    paymentId: paymentId || ("PAY_DIRECT_" + Date.now()),
    status: "Confirmed",
    cancellationDate: null,
    tracking: {
      courier: "Pending Atelier Allocation",
      awbNumber: null,
      trackingUrl: null
    }
  };

  orders.unshift(newOrder);
  saveOrders(orders);

  console.log("--> PERMANENT ORDER CREATED:", newOrder.orderId);
  res.json({ success: true, orderId: newOrder.orderId, order: newOrder });
});

// Customer Orders Fetch
app.get('/api/customer/orders', (req, res) => {
  const orders = loadOrders();
  const phone = req.query.phone;
  if (phone) {
    const filtered = orders.filter(o => o.customer && o.customer.phone === phone);
    return res.json({ success: true, data: filtered });
  }
  res.json({ success: true, data: orders });
});

// Customer Cancel
app.post('/api/orders/cancel', (req, res) => {
  const { orderId } = req.body;
  const orders = loadOrders();
  const order = orders.find(o => o.orderId === orderId);
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });

  order.status = "Cancelled";
  order.cancellationDate = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  saveOrders(orders);

  res.json({ success: true, order });
});

// Admin Orders
app.get('/api/admin/orders', (req, res) => {
  const orders = loadOrders();
  res.json({ success: true, count: orders.length, data: orders });
});

// Admin Status & Tracking Update
app.post('/api/admin/order-status', (req, res) => {
  const { orderId, status, courier, awbNumber, trackingUrl } = req.body;
  const orders = loadOrders();
  const order = orders.find(o => o.orderId === orderId);

  if (!order) return res.status(404).json({ success: false, message: "Order not found" });

  if (status) order.status = status;
  if (courier || awbNumber) {
    order.tracking = {
      courier: courier || order.tracking?.courier || "Express Dispatch",
      awbNumber: awbNumber || order.tracking?.awbNumber,
      trackingUrl: trackingUrl || (awbNumber ? `https://www.delhivery.com/track/package/${awbNumber}` : null)
    };
  }

  saveOrders(orders);
  res.json({ success: true, message: "Status & Tracking updated", order });
});

app.listen(PORT, () => {
  console.log(`Mreedo Server live on: http://localhost:${PORT}`);
});