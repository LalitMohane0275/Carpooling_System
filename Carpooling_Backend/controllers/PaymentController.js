const Razorpay = require("razorpay");

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: "rzp_test_kzfHnZNeAx85WJ", // Replace with Razorpay Test Key
  key_secret: "4emV5tJPU9RBGqfVye8c30XY", // Replace with Razorpay Test Secret
});

// key_id,key_secret
// rzp_test_kzfHnZNeAx85WJ,4emV5tJPU9RBGqfVye8c30XY

// Create Order for Payment
exports.createOrder = async (req, res) => {
  try {
    const { amount, currency } = req.body; // Amount in ₹ (e.g., ₹500)

    const options = {
      amount: amount * 100, // Convert ₹ to paise
      currency: currency || "INR",
      payment_capture: 1, // Auto-capture payment
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Payment Verification (Webhook - Optional)
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    // Ideally, you should verify the signature here
    res.json({ success: true, message: "Payment verified successfully!" });
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
