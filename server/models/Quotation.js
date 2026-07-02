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

  vehicleType: {
    type: String,
    default: ""
  },

  vehicleNumber: {
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

  /* -------------------------
     ADMIN SECTION
  ------------------------- */

  tyrePrice: {
    type: Number,
    default: 0
  },

  tyreQuantity: {
    type: Number,
    default: 1
  },

  serviceCharge: {
    type: Number,
    default: 0
  },

  accessoriesCharge: {
    type: Number,
    default: 0
  },

  labourCharge: {
    type: Number,
    default: 0
  },

  discount: {
    type: Number,
    default: 0
  },

  subtotal: {
    type: Number,
    default: 0
  },

  includeGST: {
    type: Boolean,
    default: true
  },

  gst: {
    type: Number,
    default: 0
  },

  totalAmount: {
    type: Number,
    default: 0
  },

  adminRemarks: {
    type: String,
    default: ""
  },

  /* -------------------------
     STATUS
  ------------------------- */

  quoteStatus: {

    type: String,

    enum: [

      "Pending",

      "Draft",

      "Published",

      "Accepted",

      "Rejected",

      "Expired"

    ],

    default: "Pending"

  },

  isPublished: {

    type: Boolean,

    default: false

  },

  pdfUrl: {

    type: String,

    default: ""

  },

  validTill: {

    type: Date,

    default: null

  },

  publishedAt: {

    type: Date,

    default: null

  },

  acceptedAt: {

    type: Date,

    default: null

  },

  rejectedAt: {

    type: Date,

    default: null

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