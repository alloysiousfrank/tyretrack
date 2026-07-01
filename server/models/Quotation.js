const mongoose = require("mongoose")

const quotationSchema = new mongoose.Schema({

  quoteId: {
    type: String,
    unique: true
  },

  quoteNumber: {
    type: Number,
    default: 0
  },

  financialYear: {
    type: String,
    default: ""
  },

  customerName: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  email: {
    type: String,
    default: ""
  },

  vehicleNumber: {
    type: String,
    default: ""
  },

  vehicleType: {
    type: String,
    default: ""
  },

  vehicleBrand: {
    type: String,
    default: ""
  },

  vehicleModel: {
    type: String,
    default: ""
  },

  tyreSize: {
    type: String,
    default: ""
  },

  preferredBrand: {
    type: String,
    default: ""
  },

  notes: {
    type: String,
    default: ""
  },

  quotationItems: [

    {

      itemName: String,

      quantity: Number,

      amount: Number,

      total: Number

    }

  ],

  subtotal: {
    type: Number,
    default: 0
  },

  gst: {
    type: Number,
    default: 0
  },

  totalAmount: {
    type: Number,
    default: 0
  },

  includeGST: {
    type: Boolean,
    default: false
  },

  status: {
    type: String,
    default: "Pending"
  },

  isPublished: {
    type: Boolean,
    default: false
  },

  publishedAt: {
    type: Date,
    default: null
  },

  pdfUrl: {
    type: String,
    default: ""
  }

},
{
  timestamps: true
})

module.exports =
mongoose.model(
  "Quotation",
  quotationSchema
)