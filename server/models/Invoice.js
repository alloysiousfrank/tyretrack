const mongoose = require("mongoose")

const invoiceSchema =
new mongoose.Schema({

  invoiceId: {
    type: String,
    unique: true,
  },

  bookingId: String,

  customerName: String,

  email: String,

  phone: String,

  vehicleNumber: String,

  vehicleType: String,

  services: [String],

  subtotal: Number,

  gst: Number,

  totalAmount: Number,

  status: {
    type: String,
    default: "Draft",
  },

  pdfUrl: {
    type: String,
    default: "",
  },

},
{
  timestamps: true,
})

module.exports =
mongoose.model(
  "Invoice",
  invoiceSchema
)