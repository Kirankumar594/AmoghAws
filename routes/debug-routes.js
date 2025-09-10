// Add this temporarily to your orderRoutes.js to debug
import express from "express"

const router = express.Router()

// Debug route - add this at the top of your orderRoutes.js
router.get('/debug', (req, res) => {
  res.json({
    success: true,
    message: 'Order routes are working!',
    availableRoutes: [
      'GET /api/orders/debug',
      'GET /api/orders',
      'GET /api/orders/myorders', 
      'GET /api/orders/:id',
      'POST /api/orders',
      'PUT /api/orders/:id/status',
      'PUT /api/orders/:id/deliver'
    ]
  })
})

// Test this route first: http://localhost:5000/api/orders/debug
export default router
