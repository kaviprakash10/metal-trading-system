# Luna Gold Platform (GoldVault)

Luna Gold is a premium, secure, and modern digital platform for trading and investing in precious metals like Gold and Silver. Built with a focus on institutional-grade security and a sleek, dynamic user experience.

## 🚀 Features

### **For Users**

- **Digital Metal Trading**: Buy and sell Gold/Silver in real-time at market rates.
- **SIP (Systematic Investment Plan)**: Automate your investments with structured periodic plans.
- **Secure Wallet**: Manage funds with integrated Razorpay for seamless deposits.
- **Portfolio Tracking**: Real-time visualization of your asset growth and transaction history.
- **Multi-Auth Flow**: Sign up/in via local credentials or **Google OAuth**.
- **Security First**: Mandatory phone verification via **Twilio OTP** for sensitive actions.

### **For Staff & Admin**

- **Identity Management**: Comprehensive directory of platform participants with KYC auditing.
- **Security Clearance**: Multi-tier role management (Admin, Staff, User).
- **Market Control**: Real-time price management for metals.
- **Product Registry**: Advanced inventory management with image uploads via **Cloudinary**.
- **Audit Ledger**: Complete oversight of all platform-wide transactions.

## 🛠 Tech Stack

### **Frontend**

- **React 19** with **Vite** for blazing fast performance.
- **Redux Toolkit** for robust state management.
- **Tailwind CSS** for premium, responsive design.
- **Framer Motion** for smooth, high-end micro-animations.
- **Lucide React** for consistent, modern iconography.

### **Backend**

- **Node.js** & **Express** for a scalable API architecture.
- **MongoDB** with **Mongoose** for flexible data modeling.
- **JWT (JSON Web Tokens)** for secure, stateless authentication.

### **Integrations**

- **Google Cloud Console**: OAuth2 Identity Services.
- **Razorpay**: Enterprise-grade payment gateway.
- **Twilio**: SMS and OTP verification services.
- **Cloudinary**: Cloud-based media management.

## ⚙️ Installation & Setup

### **Prerequisites**

- Node.js (v18+)
- MongoDB (Local or Atlas)

### **Backend Setup**

1. Navigate to the `BackEnd` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and populate the following:
   ```env
   PORT=1010
   DB_URL=your_mongodb_url
   JWT_SECRET=your_secret
   GOLD_API_KEY=your_gold_api_key
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   CLOUDINARY_CLOUD_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   TWILIO_SID=your_sid
   TWILIO_AUTH_TOKEN=your_token
   TWILIO_PHONE=your_twilio_number
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### **Frontend Setup**

1. Navigate to the `FrontEnd` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🛡 Security Note

Ensure that all API keys and secrets are kept confidential. Never commit `.env` files to public repositories.

---

_Built with passion for the future of digital assets._
