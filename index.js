<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mreedo Atelier | Luxury Streetwear</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: #fafafa; color: #111; }
    header { display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; background: #fff; border-bottom: 1px solid #eee; position: sticky; top: 0; z-index: 100; }
    .logo { font-size: 22px; font-weight: 900; letter-spacing: 2px; }
    .nav-actions { display: flex; align-items: center; gap: 15px; }
    .user-tag { font-size: 13px; font-weight: 600; background: #eee; padding: 6px 12px; border-radius: 20px; }
    .container { max-width: 1100px; margin: 40px auto; padding: 0 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 50px; }
    @media (max-width: 768px) { .container { grid-template-columns: 1fr; } header { padding: 15px 20px; } }
    .product-image img { width: 100%; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); background: #eee; min-height: 400px; object-fit: cover; }
    .product-details h1 { font-size: 28px; margin-bottom: 8px; }
    .price { font-size: 24px; font-weight: 700; margin-bottom: 20px; }
    .label { font-size: 13px; text-transform: uppercase; font-weight: 700; color: #666; margin: 15px 0 8px; }
    .color-picker { display: flex; gap: 12px; margin-bottom: 20px; }
    .color-btn { width: 34px; height: 34px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; }
    .color-btn.active { border-color: #000; transform: scale(1.1); }
    .size-picker { display: flex; gap: 10px; margin-bottom: 25px; }
    .size-btn { padding: 10px 18px; border: 1px solid #ddd; background: #fff; cursor: pointer; border-radius: 6px; font-weight: 600; }
    .size-btn.active { background: #000; color: #fff; border-color: #000; }
    .buy-btn { width: 100%; padding: 16px; background: #000; color: #fff; border: none; border-radius: 8px; font-size: 16px; font-weight: 700; cursor: pointer; }
    .referral-box { margin-top: 25px; padding: 15px; background: #f0fdf4; border: 1px dashed #22c55e; border-radius: 8px; display: none; }
    
    /* Modal Styles */
    .modal { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
    .modal-content { background: #fff; border-radius: 12px; max-width: 440px; width: 100%; padding: 30px; max-height: 90vh; overflow-y: auto; position: relative; }
    .modal-content h2 { margin-bottom: 15px; }
    .input-box { width: 100%; padding: 12px; margin-bottom: 12px; border: 1px solid #ddd; border-radius: 6px; }
    .camera-box { background: #000; border-radius: 8px; overflow: hidden; margin-bottom: 12px; text-align: center; }
    video, canvas { width: 100%; max-height: 200px; object-fit: cover; }
    .action-btn { width: 100%; padding: 12px; background: #000; color: #fff; border: none; border-radius: 6px; font-weight: 700; cursor: pointer; margin-top: 5px; }
  </style>
</head>
<body>

  <header>
    <div class="logo">MREEDO</div>
    <div class="nav-actions">
      <div id="userDisplay" class="user-tag" style="display:none;"></div>
      <button id="authHeaderBtn" class="size-btn" onclick="openAuth('login')">Sign In</button>
    </div>
  </header>

  <div class="container">
    <div class="product-image">
      <img id="mainImg" src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80" alt="Mreedo Shirt">
    </div>

    <div class="product-details">
      <h1>MREEDO Signature Heavyweight Tee</h1>
      <div class="price">₹1,499</div>

      <div class="label">Select Color</div>
      <div class="color-picker">
        <button class="color-btn active" style="background:#111;" onclick="changeColor('#111', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80', this)"></button>
        <button class="color-btn" style="background:#f4f4f4; border: 1px solid #ccc;" onclick="changeColor('White', 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80', this)"></button>
        <button class="color-btn" style="background:#8b5a2b;" onclick="changeColor('Mocha', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80', this)"></button>
      </div>

      <div class="label">Select Size</div>
      <div class="size-picker">
        <button class="size-btn active" onclick="setSize('S', this)">S</button>
        <button class="size-btn" onclick="setSize('M', this)">M</button>
        <button class="size-btn" onclick="setSize('L', this)">L</button>
        <button class="size-btn" onclick="setSize('XL', this)">XL</button>
      </div>

      <button class="buy-btn" onclick="handleBuyNow()">BUY NOW</button>

      <div id="referralCard" class="referral-box">
        <b>Your Referral Code:</b> <span id="refCodeTxt"></span><br>
        <small>Share with friends to give discounts!</small>
      </div>
    </div>
  </div>

  <!-- AUTH MODAL (SIGN IN / SIGN UP WITH CAMERA) -->
  <div id="authModal" class="modal">
    <div class="modal-content">
      <h2 id="modalTitle">Sign In</h2>
      <div id="signupFields" style="display:none;">
        <input type="text" id="regName" class="input-box" placeholder="Full Name">
        <input type="tel" id="regPhone" class="input-box" placeholder="Phone Number">
        <input type="email" id="regEmail" class="input-box" placeholder="Email Address">
        
        <div class="camera-box">
          <video id="videoFeed" autoplay playsinline></video>
          <canvas id="faceCanvas" style="display:none;"></canvas>
          <img id="facePreview" style="display:none; width:100%; max-height:200px; object-fit:cover;">
        </div>
        <button type="button" class="size-btn" style="width:100%; margin-bottom:12px;" onclick="captureFace()">📸 Click Live Face Photo</button>
      </div>

      <input type="text" id="authLoginId" class="input-box" placeholder="Email or Phone">
      <input type="password" id="authPassword" class="input-box" placeholder="Password">

      <button class="action-btn" id="modalSubmitBtn" onclick="submitAuth()">Continue</button>
      <p style="margin-top:15px; font-size:13px; text-align:center;">
        <span id="switchAuthTxt">New to Mreedo? <a href="#" onclick="toggleAuthMode(true)">Create Account</a></span>
      </p>
    </div>
  </div>

  <!-- CHECKOUT MODAL -->
  <div id="checkoutModal" class="modal">
    <div class="modal-content">
      <h2>Complete Delivery Details</h2>
      <input type="text" id="shipAddress" class="input-box" placeholder="Street / House Address">
      <input type="text" id="shipPincode" class="input-box" placeholder="Pincode">
      <input type="text" id="shipPromo" class="input-box" placeholder="Referral / Promo Code (Optional)">
      <button class="action-btn" onclick="placeOrderFinal()">Place Order & Open WhatsApp</button>
    </div>
  </div>

  <script>
    let selectedColor = 'Black';
    let selectedSize = 'S';
    let isSignup = false;
    let faceImageBase64 = null;
    let stream = null;

    let currentUser = JSON.parse(localStorage.getItem('mreedo_user') || 'null');
    updateUserState();

    function changeColor(name, imgUrl, btn) {
      selectedColor = name;
      document.getElementById('mainImg').src = imgUrl;
      document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }

    function setSize(sz, btn) {
      selectedSize = sz;
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }

    function updateUserState() {
      if (currentUser) {
        document.getElementById('userDisplay').style.display = 'block';
        document.getElementById('userDisplay').innerText = `👤 ${currentUser.name}`;
        document.getElementById('authHeaderBtn').innerText = 'Logout';
        document.getElementById('authHeaderBtn').onclick = logout;
        document.getElementById('referralCard').style.display = 'block';
        document.getElementById('refCodeTxt').innerText = currentUser.referralCode;
      } else {
        document.getElementById('userDisplay').style.display = 'none';
        document.getElementById('authHeaderBtn').innerText = 'Sign In';
        document.getElementById('authHeaderBtn').onclick = () => openAuth('login');
        document.getElementById('referralCard').style.display = 'none';
      }
    }

    function logout() {
      localStorage.removeItem('mreedo_user');
      currentUser = null;
      updateUserState();
    }

    function openAuth(mode) {
      document.getElementById('authModal').style.display = 'flex';
      toggleAuthMode(mode === 'signup');
    }

    async function toggleAuthMode(toSignup) {
      isSignup = toSignup;
      document.getElementById('signupFields').style.display = isSignup ? 'block' : 'none';
      document.getElementById('authLoginId').style.display = isSignup ? 'none' : 'block';
      document.getElementById('modalTitle').innerText = isSignup ? 'Create Account' : 'Sign In';
      document.getElementById('modalSubmitBtn').innerText = isSignup ? 'Sign Up with Face' : 'Sign In';
      
      if (isSignup) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          document.getElementById('videoFeed').srcObject = stream;
        } catch(e) {
          alert('Please allow camera access for face registration.');
        }
      } else if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    }

    function captureFace() {
      const video = document.getElementById('videoFeed');
      const canvas = document.getElementById('faceCanvas');
      canvas.width = video.videoWidth || 300;
      canvas.height = video.videoHeight || 200;
      canvas.getContext('2d').drawImage(video, 0, 0);
      faceImageBase64 = canvas.toDataURL('image/jpeg');
      document.getElementById('facePreview').src = faceImageBase64;
      document.getElementById('facePreview').style.display = 'block';
      video.style.display = 'none';
    }

    async function submitAuth() {
      if (isSignup) {
        const name = document.getElementById('regName').value;
        const phone = document.getElementById('regPhone').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('authPassword').value;

        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ name, phone, email, password, faceImage: faceImageBase64 })
        });
        const data = await res.json();
        if (data.success) {
          currentUser = data.user;
          localStorage.setItem('mreedo_user', JSON.stringify(currentUser));
          closeModals();
          updateUserState();
        } else alert(data.message);
      } else {
        const loginId = document.getElementById('authLoginId').value;
        const password = document.getElementById('authPassword').value;
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ loginId, password })
        });
        const data = await res.json();
        if (data.success) {
          currentUser = data.user;
          localStorage.setItem('mreedo_user', JSON.stringify(currentUser));
          closeModals();
          updateUserState();
        } else alert(data.message);
      }
    }

    function handleBuyNow() {
      if (!currentUser) {
        openAuth('signup');
      } else {
        document.getElementById('checkoutModal').style.display = 'flex';
      }
    }

    async function placeOrderFinal() {
      const address = document.getElementById('shipAddress').value;
      const pincode = document.getElementById('shipPincode').value;
      const promo = document.getElementById('shipPromo').value;

      if (!address || !pincode) return alert('Address and Pincode are required');

      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          userId: currentUser.userId,
          customer: { name: currentUser.name, email: currentUser.email, phone: currentUser.phone, address, pincode },
          item: 'Mreedo Signature Heavyweight Tee',
          color: selectedColor,
          size: selectedSize,
          total: 1499,
          referralCodeUsed: promo
        })
      });

      const data = await res.json();
      if (data.success) {
        closeModals();
        alert('Order placed successfully! Confirmation email has been sent.');
        
        // Auto-redirect to WhatsApp
        const waMsg = encodeURIComponent(
          `*New Order on Mreedo Atelier*\n` +
          `Order ID: ${data.order.orderId}\n` +
          `Name: ${currentUser.name}\n` +
          `Item: ${data.order.item} (${selectedSize})\n` +
          `Total: ₹${data.order.total}\n` +
          `Address: ${address}, ${pincode}\n\n` +
          `Store link: https://mreedo-atelier.onrender.com`
        );
        window.open(`https://wa.me/919105324871?text=${waMsg}`, '_blank');
      }
    }

    function closeModals() {
      document.getElementById('authModal').style.display = 'none';
      document.getElementById('checkoutModal').style.display = 'none';
      if (stream) stream.getTracks().forEach(t => t.stop());
    }
  </script>
</body>
</html>