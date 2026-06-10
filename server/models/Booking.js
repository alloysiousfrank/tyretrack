const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema(
{
  bookingId: {
    type: String,
    required: true,
    unique: true,
  },

  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    index: true,
  },

  phone: {
    type: String,
    required: true,
  },

  vehicleNumber: {
    type: String,
    default: "",
  },

  vehicleType: {
    type: String,
    default: "",
  },

  service: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  time: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    default: 0,
  },

  invoiceGenerated: {
    type: Boolean,
    default: false,
  },

  invoiceId: {
    type: String,
    default: "",
  },

  status: {
    type: String,
    default: "Booking Confirmed",
  },

  currentStage: {
    type: Number,
    default: 0,
  },

  cancelled: {
    type: Boolean,
    default: false,
  },

  completed: {
    type: Boolean,
    default: false,
  },
},
{
  timestamps: true,
}
)

module.exports =
mongoose.model(
  "Booking",
  bookingSchema
)