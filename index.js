const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const ORDERS_FILE = path.join(__dirname, 'orders.json');
const USERS_FILE = path.join(__dirname, 'users.json');

if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, JSON.stringify([]));
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, JSON.stringify([]));

function loadData(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (err) { return []; }
}
function saveData(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Nodemailer Gmail SMTP Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'manish910532@gmail.com',
    pass: 'emneilnsrwkpwmgf'
  }
});

async function sendOrderEmail(customerEmail, order) {
  const mailOptions = {
    from: '"Mreedo Atelier" <manish910532@gmail.com>',
    to: customerEmail,
    subject: `Order Confirmed #${order.orderId} - Mreedo Atelier`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #111; max-width: 600px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="margin-top:0; border-bottom: 2px solid #000; padding-bottom: 10px;">MREEDO ATELIER</h2>
        <p>Hi <b>${order.customer.name}</b>,</p>
        <p>Aapka order successfully confirm ho gaya hai!</p>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <tr style="background:#f7f7f7;"><td style="padding: 10px; border: 1px solid #ddd;"><b>Order ID</b></td><td style="padding: 10px; border: 1px solid #ddd;">${order.orderId}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #ddd;"><b>Product</b></td><td style="padding: 10px; border: 1px solid #ddd;">${order.item} (${order.color}, Size: ${order.size})</td></tr>
          <tr style="background:#f7f7f7;"><td style="padding: 10px; border: 1px solid #ddd;"><b>Total Paid</b></td><td style="padding: 10px; border: 1px solid #ddd;">₹${order.total}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #ddd;"><b>Delivery Address</b></td><td style="padding: 10px; border: 1px solid #ddd;">${order.customer.address}, ${order.customer.pincode}</td></tr>
        </table>
        <p><a href="https://mreedo-atelier.onrender.com" style="background:#000; color:#fff; padding:10px 18px; text-decoration:none; border-radius:4px; display:inline-block; font-weight:bold;">Visit Mreedo Store</a></p>
        <p style="font-size: 12px; color: #666; margin-top: 25px;">Support Helpline: +91 9105324871</p>
      </div>
    `
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Order email sent to ${customerEmail}`);
  } catch (err) {
    console.error('Email send error:', err);
  }
}

// User Signup API with Face & Referral
app.post('/api/auth/signup', (req, res) => {
  const { name, email, phone, password, faceImage, referredBy } = req.body;
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
  }

  const users = loadData(USERS_FILE);
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase() || u.phone === phone)) {
    return res.status(400).json({ success: false, message: 'Email or phone already registered.' });
  }

  const refCode = `${name.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const newUser = {
    userId: 'USR-' + Date.now(),
    name,
    email: email.toLowerCase(),
    phone,
    password,
    faceImage: faceImage || null,
    referralCode: refCode,
    referredBy: referredBy || null,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveData(USERS_FILE, users);
  res.json({ success: true, user: newUser });
});

// User Login API
app.post('/api/auth/login', (req, res) => {
  const { loginId, password } = req.body;
  const users = loadData(USERS_FILE);
  const user = users.find(u => 
    (u.email.toLowerCase() === loginId.toLowerCase() || u.phone === loginId) && 
    u.password === password
  );

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials.' });
  }
  res.json({ success: true, user });
});

// Order Creation API
app.post('/api/orders/create', (req, res) => {
  const { customer, item, color, size, total, userId, referralCodeUsed } = req.body;
  const orders = loadData(ORDERS_FILE);

  const newOrder = {
    orderId: 'MRD-' + Math.floor(100000 + Math.random() * 900000),
    userId: userId || 'GUEST',
    item: item || 'Mreedo Signature Heavyweight Tee',
    color,
    size,
    total,
    customer,
    referralCodeUsed: referralCodeUsed || null,
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };

  orders.unshift(newOrder);
  saveData(ORDERS_FILE, orders);

  if (customer && customer.email) {
    sendOrderEmail(customer.email, newOrder);
  }

  res.json({ success: true, order: newOrder });
});

app.get('/api/admin/orders', (req, res) => {
  res.json({ success: true, data: loadData(ORDERS_FILE) });
});

app.listen(PORT, () => {
  console.log(`Mreedo Server live on: http://localhost:${PORT}`);
});