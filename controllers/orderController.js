
// import Order from "../models/Order.js"
// import generateOrderNumber from "../Utils/generateOrderNumber.js"

// // @desc    Create new order
// // @route   POST /api/orders
// // @access  Private
// export const createOrder = async (req, res) => {
//   try {
//     const { shippingInfo, orderItems, paymentMethod, paymentDetails, subtotal, shippingPrice, taxPrice, totalPrice } =
//       req.body

//     console.log("Received order data:", req.body)
//     console.log("User data:", req.user)

//     // Validate required fields
//     if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Order items are required and must be a non-empty array",
//       })
//     }

//     if (!shippingInfo) {
//       return res.status(400).json({
//         success: false,
//         message: "Shipping information is required",
//       })
//     }

//     // Generate order number
//     const orderNumber = generateOrderNumber()

//     // Create order object matching your exact schema
//     const orderData = {
//       orderNumber,
//       user: {
//         _id: req.user._id,
//         name: req.user.name,
//         email: req.user.email,
//       },
//       shippingInfo: {
//         fullName: shippingInfo.fullName,
//         address: shippingInfo.address,
//         city: shippingInfo.city,
//         postalCode: shippingInfo.postalCode,
//         country: shippingInfo.country,
//         email: shippingInfo.email,
//         phone: shippingInfo.phone,
//       },
//       items: orderItems.map((item) => ({
//         product: {
//           _id: item.product,
//           name: item.name,
//           price: item.price,
//           quantity: item.quantity,
//         },
//         quantity: item.quantity,
//         price: item.price,
//         image: item.image,
//       })),
//       paymentMethod: paymentMethod, // Keep original value since we added 'cod' to enum
//       paymentDetails:
//         paymentMethod === "credit-card"
//           ? {
//               cardLastFour: paymentDetails?.cardLastFour,
//               cardBrand: paymentDetails?.cardBrand,
//               cardholderName: paymentDetails?.cardholderName,
//             }
//           : paymentMethod === "cod"
//             ? {
//                 codAmount: totalPrice,
//               }
//             : paymentDetails,
//       subtotal: subtotal || 0,
//       shipping: shippingPrice || 0,
//       tax: taxPrice || 0,
//       total: totalPrice || 0,
//       status: "processing",
//     }

//     console.log("Creating order with data:", orderData)

//     const order = new Order(orderData)
//     const savedOrder = await order.save()

//     console.log("Order created successfully:", savedOrder._id)

//     res.status(201).json({
//       success: true,
//       message: "Order created successfully",
//       order: savedOrder,
//       orderNumber: savedOrder.orderNumber,
//       _id: savedOrder._id,
//     })
//   } catch (error) {
//     console.error("Error creating order:", error)
//     res.status(500).json({
//       success: false,
//       message: "Server error while creating order",
//       error: error.message,
//     })
//   }
// }

// // @desc    Get order by ID
// // @route   GET /api/orders/:id
// // @access  Private
// export const getOrderById = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id)

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       })
//     }

//     // Check if user owns this order or is admin
//     if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
//       return res.status(401).json({
//         success: false,
//         message: "Not authorized to view this order",
//       })
//     }

//     res.json({
//       success: true,
//       data: order,
//     })
//   } catch (error) {
//     console.error("Error fetching order:", error)
//     res.status(500).json({
//       success: false,
//       message: "Server error while fetching order",
//     })
//   }
// }

// // @desc    Get logged in user orders
// // @route   GET /api/orders/myorders
// // @access  Private
// export const getMyOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ "user._id": req.user._id }).sort({ createdAt: -1 })

//     res.json({
//       success: true,
//       data: orders,
//     })
//   } catch (error) {
//     console.error("Error fetching user orders:", error)
//     res.status(500).json({
//       success: false,
//       message: "Server error while fetching user orders",
//     })
//   }
// }

// // @desc    Get all orders (admin)
// // @route   GET /api/orders
// // @access  Private/Admin
// export const getOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({}).sort({ createdAt: -1 })

//     res.json({
//       success: true,
//       data: orders,
//     })
//   } catch (error) {
//     console.error("Error fetching all orders:", error)
//     res.status(500).json({
//       success: false,
//       message: "Server error while fetching all orders",
//     })
//   }
// }

// // @desc    Update order status
// // @route   PUT /api/orders/:id/status
// // @access  Private/Admin
// export const updateOrderStatus = async (req, res) => {
//   try {
//     const { status } = req.body

//     const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid status",
//       })
//     }

//     const order = await Order.findById(req.params.id)

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       })
//     }

//     order.status = status

//     if (status === "delivered") {
//       order.deliveredAt = Date.now()
//     }

//     const updatedOrder = await order.save()

//     res.json({
//       success: true,
//       message: "Order status updated successfully",
//       data: updatedOrder,
//     })
//   } catch (error) {
//     console.error("Error updating order:", error)
//     res.status(500).json({
//       success: false,
//       message: "Server error while updating order",
//     })
//   }
// }

// // @desc    Update order to delivered
// // @route   PUT /api/orders/:id/deliver
// // @access  Private/Admin
// export const updateOrderToDelivered = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id)

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       })
//     }

//     order.status = "delivered"
//     order.deliveredAt = Date.now()

//     const updatedOrder = await order.save()

//     res.json({
//       success: true,
//       message: "Order marked as delivered",
//       data: updatedOrder,
//     })
//   } catch (error) {
//     console.error("Error updating order:", error)
//     res.status(500).json({
//       success: false,
//       message: "Server error while updating order",
//     })
//   }
// }
import Order from '../models/Order.js';
import generateOrderNumber from '../Utils/generateOrderNumber.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { shippingInfo, orderItems, paymentMethod, paymentDetails, subtotal, shippingPrice, taxPrice, totalPrice } = req.body;

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Order items are required' });
    }

    if (!shippingInfo) {
      return res.status(400).json({ success: false, message: 'Shipping info is required' });
    }

    const orderNumber = generateOrderNumber();

    const orderData = {
      orderNumber,
      user: { _id: req.user._id, name: req.user.name, email: req.user.email },
      shippingInfo,
      items: orderItems.map(item => ({
        product: { _id: item.product, name: item.name, price: item.price, quantity: item.quantity },
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      })),
      paymentMethod,
      paymentDetails:
        paymentMethod === 'credit-card'
          ? {
              cardLastFour: paymentDetails?.cardLastFour,
              cardBrand: paymentDetails?.cardBrand,
              cardholderName: paymentDetails?.cardholderName,
            }
          : paymentMethod === 'cod'
          ? { codAmount: totalPrice }
          : paymentDetails,
      subtotal: subtotal || 0,
      shipping: shippingPrice || 0,
      tax: taxPrice || 0,
      total: totalPrice || 0,
    };

    const order = new Order(orderData);
    const savedOrder = await order.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: savedOrder,
      orderNumber: savedOrder.orderNumber,
      _id: savedOrder._id,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 'user._id': req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status' });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = status;
    if (status === 'delivered') order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json({ success: true, message: 'Order status updated', data: updatedOrder });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Mark order as delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = 'delivered';
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json({ success: true, message: 'Order delivered', data: updatedOrder });
  } catch (error) {
    console.error('Error marking delivered:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};