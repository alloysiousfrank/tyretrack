const mongoose = require("mongoose")

const bookingSchema =
  new mongoose.Schema(
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
      },

      phone: {
        type: String,
        required: true,
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

      status: {
        type: String,
        default: "Booking Confirmed",
      },

      currentStage: {
        type: Number,
        default: 0,
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