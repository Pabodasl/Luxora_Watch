const Order = require('../models/Order');
const PDFDocument = require('pdfkit');

// Get all orders (Admin only) - with better error handling
const getAllOrders = async (req, res) => {
  try {
    console.log('Attempting to fetch orders from database...');
    
    // Check if MongoDB is connected
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database not connected. Please try again.' 
      });
    }

    const orders = await Order.find().sort({ createdAt: -1 }).maxTimeMS(30000);
    console.log(`Successfully fetched ${orders.length} orders`);
    
    res.json(orders);
  } catch (error) {
    console.error('Get orders error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    if (error.name === 'MongooseError' && error.message.includes('buffering timed out')) {
      return res.status(503).json({ 
        message: 'Database connection timeout. Please check your MongoDB connection and try again.' 
      });
    }
    
    if (error.name === 'MongoNetworkError') {
      return res.status(503).json({ 
        message: 'Cannot connect to database. Please check if MongoDB is running.' 
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to fetch orders',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Generate invoice PDF - Single Page Professional Design
const generateInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId }).maxTimeMS(15000);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Create PDF document with optimized margins for single page
    const doc = new PDFDocument({ 
      size: 'A4',
      margins: { top: 40, bottom: 40, left: 40, right: 40 }
    });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.orderId}.pdf`);

    // Pipe PDF to response
    doc.pipe(res);

    let yPos = 40;

    // ========== 1. HEADER SECTION ==========
    // Company name and branding
    doc.fontSize(24)
       .font('Helvetica-Bold')
       .fillColor('#000000')
       .text('LUXORA', 40, yPos);
    
    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#999999')
       .text('Every second speaks style.', 40, yPos + 25);

    // Invoice title on the right
    doc.fontSize(20)
       .font('Helvetica-Bold')
       .fillColor('#000000')
       .text('INVOICE', 400, yPos, { align: 'right' });
    
    // Company contact info
    doc.fontSize(8)
       .font('Helvetica')
       .fillColor('#666666')
       .text('Colombo, Sri Lanka', 400, yPos + 25, { align: 'right' })
       .text('Tel: +94 70 433 8147', 400, yPos + 35, { align: 'right' })
       .text('Email: info@luxora.com', 400, yPos + 45, { align: 'right' })
       .text('www.luxora.com', 400, yPos + 55, { align: 'right' });
    
    // Divider line
    yPos += 80;
    doc.moveTo(40, yPos)
       .lineTo(555, yPos)
       .strokeColor('#E0E0E0')
       .lineWidth(1)
       .stroke();

    // ========== 2. ORDER & CUSTOMER SECTION ==========
    yPos += 20;
    
    // Order Details (Left side)
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .fillColor('#000000')
       .text('Order Details', 40, yPos);
    
    doc.fontSize(9)
       .font('Helvetica')
       .fillColor('#666666')
       .text('Order ID:', 40, yPos + 20)
       .font('Helvetica-Bold')
       .fillColor('#000000')
       .text(order.orderId, 100, yPos + 20);
    
    const invoiceDate = new Date(order.orderDate);
    const formattedDate = invoiceDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    doc.font('Helvetica')
       .fillColor('#666666')
       .text('Order Date:', 40, yPos + 35)
       .font('Helvetica-Bold')
       .fillColor('#000000')
       .text(formattedDate, 100, yPos + 35);

    // Customer Details (Right side)
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .fillColor('#000000')
       .text('Customer Details', 300, yPos);
    
    doc.fontSize(9)
       .font('Helvetica')
       .fillColor('#666666')
       .text('Name:', 300, yPos + 20)
       .font('Helvetica-Bold')
       .fillColor('#000000')
       .text(order.customerName, 340, yPos + 20);
    
    doc.font('Helvetica')
       .fillColor('#666666')
       .text('Phone:', 300, yPos + 35)
       .font('Helvetica-Bold')
       .fillColor('#000000')
       .text(order.phoneNumber, 340, yPos + 35);
    
    doc.font('Helvetica')
       .fillColor('#666666')
       .text('Address:', 300, yPos + 50)
       .font('Helvetica-Bold')
       .fillColor('#000000')
       .text(order.deliveryAddress, 340, yPos + 50, { width: 200 });

    // ========== 3. PRODUCT DETAILS SECTION ==========
    yPos += 90;
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .fillColor('#000000')
       .text('Product Details', 40, yPos);
    
    yPos += 25;
    
    // Product table header
    doc.rect(40, yPos, 515, 20)
       .fillColor('#F8F8F8')
       .fill()
       .strokeColor('#D0D0D0')
       .lineWidth(1)
       .stroke();
    
    doc.fontSize(10)
       .font('Helvetica-Bold')
       .fillColor('#000000')
       .text('Description', 45, yPos + 5)
       .text('Category', 200, yPos + 5)
       .text('Color', 300, yPos + 5)
       .text('Watch ID', 350, yPos + 5)
       .text('Price', 470, yPos + 5, { align: 'right' });
    
    yPos += 20;
    
    // Product details row
    doc.rect(40, yPos, 515, 25)
       .strokeColor('#E8E8E8')
       .lineWidth(0.5)
       .stroke();
    
    doc.fontSize(9)
       .font('Helvetica')
       .fillColor('#000000')
       .text(order.watch.name, 45, yPos + 8, { width: 150 })
       .text(order.watch.category || 'N/A', 200, yPos + 8, { width: 90 })
       .text(order.watch.color || 'N/A', 300, yPos + 8, { width: 45 })
       .text(order.watch.watchId, 350, yPos + 8, { width: 115 })
       .text(`Rs. ${order.watch.price.toLocaleString()}`, 470, yPos + 8, { align: 'right', width: 80 });

    // ========== 4. PAYMENT SUMMARY SECTION ==========
    yPos += 40;
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .fillColor('#000000')
       .text('Payment Summary', 40, yPos);
    
    yPos += 25;
    
    const deliveryCharges = order.deliveryCharges || 0;
    const subtotal = order.watch.price;
    const total = subtotal + deliveryCharges;
    
    // Payment details table - LEFT ALIGNED
    const paymentBoxY = yPos;
    const paymentBoxHeight = 60; // Reduced height since we removed some content
    
    doc.rect(40, paymentBoxY, 515, paymentBoxHeight)
       .fillColor('#F8F8F8')
       .fill()
       .strokeColor('#D0D0D0')
       .lineWidth(1)
       .stroke();
    
    // Internal dividers
    doc.moveTo(40, paymentBoxY + 25)
       .lineTo(555, paymentBoxY + 25)
       .strokeColor('#E8E8E8')
       .lineWidth(0.5)
       .stroke();
    
    let paymentY = yPos + 5;
    
    // Product Price - LEFT ALIGNED
    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#666666')
       .text('Product Price:', 45, paymentY)
       .font('Helvetica-Bold')
       .fillColor('#000000')
       .text(`Rs. ${subtotal.toLocaleString()}`, 150, paymentY);
    
    paymentY += 25;
    
    // Delivery Charges - LEFT ALIGNED
    doc.font('Helvetica')
       .fillColor('#666666')
       .text('Delivery Charges:', 45, paymentY)
       .font('Helvetica-Bold')
       .fillColor('#000000')
       .text(`Rs. ${deliveryCharges.toLocaleString()}`, 150, paymentY);
    
    paymentY += 25;
    
    // Total Amount - LEFT ALIGNED
    doc.fontSize(11)
       .font('Helvetica-Bold')
       .fillColor('#000000')
       .text('Total Amount:', 45, paymentY)
       .fillColor('#FF6B35')
       .text(`Rs. ${total.toLocaleString()}`, 150, paymentY);

    // ========== 5. PAYMENT METHOD SECTION ==========
    yPos += 70; // Add space after payment summary
    
    doc.fontSize(9)
       .font('Helvetica')
       .fillColor('#666666')
       .text('Payment Method:', 40, yPos)
       .font('Helvetica-Bold')
       .fillColor('#000000')
       .text(order.paymentMethod || 'Cash on Delivery', 140, yPos);

    // ========== 6. FOOTER SECTION ==========
    const pageHeight = doc.page.height;
    let footerY = pageHeight - 40; // Reduced footer space
    
    // Divider line
    doc.moveTo(40, footerY)
       .lineTo(555, footerY)
       .strokeColor('#E0E0E0')
       .lineWidth(1)
       .stroke();
    
    footerY += 15;
    
    // Final copyright only - removed other messages
    doc.fontSize(7)
       .font('Helvetica')
       .fillColor('#999999')
       .text(`© ${new Date().getFullYear()} LUXORA. All rights reserved.`, 
             40, footerY, { width: 515, align: 'center' });

    // Finalize PDF - Ensure only one page
    doc.end();

  } catch (error) {
    console.error('Generate invoice error:', error);
    res.status(500).json({ message: 'Error generating invoice', error: error.message });
  }
};

// Create new order
const createOrder = async (req, res) => {
  try {
    const { customerName, phoneNumber, deliveryAddress, additionalMessage, watch, deliveryCharges = 0 } = req.body;

    // Validate required fields
    if (!customerName || !phoneNumber || !deliveryAddress || !watch) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create order
    const order = new Order({
      customerName,
      phoneNumber,
      deliveryAddress,
      additionalMessage: additionalMessage || '',
      watch: {
        watchId: watch.watchId || watch._id,
        name: watch.name,
        category: watch.category || null,
        price: watch.price,
        color: watch.color || null,
        image: watch.image || null
      },
      deliveryCharges: deliveryCharges || 0,
      paymentMethod: 'Cash on Delivery',
      status: 'Pending'
    });

    await order.save();

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single order
const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId }).maxTimeMS(15000);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findOneAndUpdate(
      { orderId },
      { status, updatedAt: Date.now() },
      { new: true, maxTimeMS: 15000 }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createOrder,
  generateInvoice,
  getAllOrders,
  getOrder,
  updateOrderStatus
};