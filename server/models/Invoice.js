const mongoose = require("mongoose")

const invoiceSchema =
new mongoose.Schema({

  invoiceId: {
    type: String,
    unique: true,
  },

  invoiceNumber: {
 type:Number
},

  bookingId: {
 type:String,
 default:""
},

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

items:[
 {
   productId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Inventory"
   },

   productName:String,

   quantity:Number,

   price:Number,

   total:Number
 }
]

module.exports =
mongoose.model(
  "Invoice",
  invoiceSchema
)