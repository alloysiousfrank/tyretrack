const mongoose = require("mongoose")

const invoiceSchema = new mongoose.Schema({

 invoiceId:{
  type:String,
  unique:true
 },

 invoiceNumber:Number,

 bookingId:{
  type:String,
  default:""
 },

 customerName:String,

 email:String,

 phone:String,

 vehicleNumber:String,

 vehicleType:String,

 vehicleKm:{
 type:String,
 default:""
},

 services:[String],

 customServices:[

 {

  serviceName:String,

  quantity:Number,

  amount:Number,

  total:Number

 }

],

 tyreBrand:{
 type:String,
 default:""
},

tyreQuantity:{
 type:Number,
 default:0
},

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

 ],

 subtotal:Number,

 gst:Number,

 totalAmount:Number,

 status:{
  type:String,
  default:"Draft"
 },

 pdfUrl:{
  type:String,
  default:""
 }

},{
 timestamps:true
})

module.exports =
mongoose.model(
  "Invoice",
  invoiceSchema
)