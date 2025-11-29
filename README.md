# Luxora - Premium Watch E-commerce Platform

A modern, feature-rich e-commerce platform for Luxora, a premium watch retailer. Built with the **MERN stack** (MongoDB, Express.js, React, Node.js) with **Vite** and **Tailwind CSS** for an exceptional user experience.

## ✨ Key Features

### 👥 Customer Features
- **Dark Theme Design** - Premium black/dark grey interface with elegant gold accents
- **Mobile Responsive** - Fully optimized for desktop, tablet, and mobile devices
- **Watch Catalog** - Beautiful grid layout with advanced filtering
- **Interactive Watch Modal** - Detailed product view with color variant selection
- **WhatsApp Integration** - Seamless one-click ordering via WhatsApp
- **Order Tracking** - Real-time order status updates
- **User Authentication** - Secure customer login and profile management
- **Fast Performance** - Optimized images, lazy loading, and caching

### 🔐 Admin Features
- **Secure Admin Dashboard** - JWT-based authentication
- **Watch Management** - Complete CRUD operations for inventory
- **Image Upload** - Multi-image support for main display and color variants
- **Order Management** - Track and update customer orders
- **Invoice Generation** - Automatic PDF invoice creation
- **User Management** - Monitor customer registrations
- **Real-time Updates** - Instant synchronization across the platform

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18.2, Vite, Tailwind CSS 3.3, Axios |
| **Backend** | Node.js, Express.js 4.18 |
| **Database** | MongoDB Atlas |
| **Authentication** | JWT (JSON Web Tokens) |
| **File Upload** | Multer |
| **PDF Generation** | PDFKit |
| **Styling** | Tailwind CSS with custom theme |
| **UI Components** | Lucide React Icons |
| **Notifications** | React Hot Toast |

## 📋 Project Structure

```
luxora/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components (Home, Admin, Login)
│   │   ├── context/        # React Context (Auth, Customer)
│   │   ├── config/         # Axios configuration
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json
│
├── backend/                 # Node.js/Express backend
│   ├── controllers/        # Business logic
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth, file upload middleware
│   ├── services/          # Database services
│   ├── scripts/           # Setup scripts
│   ├── server.js          # Express server entry point
│   └── package.json
│
└── README.md

```

## 🚀 Quick Start

### Prerequisites
- **Node.js** v16 or higher
- **npm** or **yarn**
- **MongoDB Atlas** account (cloud database)
- **Git**

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Pabodasl/Luxora_Watch
   cd luxora
   ```

2. **Install All Dependencies**
   ```bash
   npm run install-all
   ```
   This installs dependencies for root, backend, and frontend.

3. **Setup Environment Variables**
   
   Create `.env` in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://chandrasenapaboda_db_user:9BykkTLBM048OXGf@cluster0.c3sikg3.mongodb.net/luxora
   JWT_SECRET=your_super_secret_jwt_key_12345
   ADMIN_EMAIL=admin@luxora.com
   ADMIN_PASSWORD=Luxora@2025!
   ADMIN_NAME=Luxora Admin
   WHATSAPP_NUMBER=94713697553
   NODE_ENV=development
   ```

4. **Initialize Admin Account**
   ```bash
   cd backend
   node scripts/setupAdmin.js
   cd ..
   ```

5. **Start Development Servers**
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:5173 (Vite)
   - Backend API: http://localhost:5000

## 🔐 Authentication

### Admin Login
- **Route**: `/admin/login`
- **Default Credentials**:
  - Email: `admin@luxora.com`
  - Password: `admin123`
- **Token Storage**: JWT stored in localStorage

### Customer Login
- **Route**: `/login`
- **Features**: Email/Password registration and login

## 📚 API Endpoints

### Watches
- `GET /api/watches` - Get all watches
- `GET /api/watches/:id` - Get watch by ID
- `POST /api/watches` - Create watch (Admin)
- `PUT /api/watches/:id` - Update watch (Admin)
- `DELETE /api/watches/:id` - Delete watch (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/:orderId` - Get order details
- `GET /api/orders/:orderId/invoice` - Generate PDF invoice
- `PUT /api/orders/:orderId/status` - Update order status (Admin)

### Auth
- `POST /api/auth/register` - Customer registration
- `POST /api/auth/login` - Customer login
- `POST /api/auth/admin-login` - Admin login

## 🎨 Customization

### Theme Colors
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: {
    50: '#fff7ed',
    400: '#fb923c',
    600: '#ea580c',
  }
}
```

### WhatsApp Integration
Update WhatsApp number in `.env`:
```env
WHATSAPP_NUMBER=94713697553
```

## 📱 Usage Guide

### For Customers
1. Browse watches on homepage
2. Click on a watch card to view details
3. Select color variant if available
4. Click **"I'm Interested"** button
5. Fill contact form and send via WhatsApp
6. Track order status in order page

### For Admins
1. Navigate to `/admin/login`
2. Enter admin credentials
3. Access admin panel at `/admin`
4. **Add Watch**: Click "Add New Watch", fill details, upload images
5. **Edit Watch**: Click edit icon, modify details, save
6. **Delete Watch**: Click delete icon to remove
7. **Manage Orders**: View customer orders and update status
8. **Download Invoice**: Generate and download PDF invoices

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Verify MongoDB URI in `.env` |
| Port 5000 already in use | Change PORT in `.env` |
| Images not uploading | Check `backend/uploads` folder permissions |
| JWT errors | Clear localStorage and login again |
| Frontend not connecting to backend | Verify backend is running on port 5000 |

## 📦 Available Scripts

```bash
# Root directory
npm run dev              # Start both frontend and backend
npm run server          # Start only backend
npm run client          # Start only frontend
npm run install-all     # Install all dependencies
npm run build           # Build frontend for production

# Backend (cd backend)
npm run dev             # Start with nodemon
npm start               # Start production server

# Frontend (cd frontend)
npm run dev             # Start Vite dev server
npm run build           # Build for production
npm run preview         # Preview production build
```

## 🔄 Database Models

### Watch Model
```javascript
{
  watchId: String (unique),
  name: String,
  category: String,
  price: Number,
  description: String,
  mainImage: String,
  color: String,
  colorVariants: [{ color, image }],
  availability: String,
  customerName: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model
```javascript
{
  orderId: String (unique),
  customerName: String,
  phoneNumber: String,
  deliveryAddress: String,
  watch: Object,
  deliveryCharges: Number,
  paymentMethod: String,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🌐 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy 'dist' folder
```

### Backend (Heroku/Railway)
```bash
# Set environment variables
# Deploy 'backend' folder
```

## 📞 Contact & Support

- **Email**: info@luxora.com
- **WhatsApp**: +94 71 369 7553
- **Address**: Colombo, Sri Lanka

## 📄 License

This project is licensed under the **MIT License** - see LICENSE file for details.

## 👨‍💻 Author

**Luxora Team**

---

**Last Updated**: November 2025  
**Version**: 1.0.0

## 🎨 Design Features

- **Dark Theme**: Black and dark grey backgrounds with gold accents
- **Modern Typography**: Inter and Poppins fonts
- **Smooth Animations**: Hover effects and transitions
- **Responsive Grid**: Adaptive layout for all screen sizes
- **Premium Feel**: Elegant design matching luxury watch aesthetics

## 📞 Contact Integration

- **WhatsApp**: +94 71 369 7553
- **Auto-generated Messages**: Pre-filled with watch details
- **Customer Information**: Name, phone, address collection
- **Direct Communication**: Opens WhatsApp chat with shop owner

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy the dist folder
```

### Backend (Railway/Heroku)
```bash
cd backend
# Deploy with environment variables
```

### Database
- MongoDB Atlas (already configured)
- No additional setup required

## 📁 Project Structure

```
zyra-deals-lk/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   ├── uploads/         # Image uploads
│   └── scripts/         # Setup scripts
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   └── App.jsx      # Main app component
│   └── public/          # Static assets
└── package.json         # Root package.json
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- File upload restrictions
- CORS configuration

## 📈 Performance Optimizations

- Image lazy loading
- Optimized bundle size with Vite
- Efficient database queries
- Responsive image serving
- Minimal dependencies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support or questions:
- WhatsApp: +94 71 369 7553
- 

---

**Zyra Deals LK** - Timeless Style. Modern Deals. 🕰️
