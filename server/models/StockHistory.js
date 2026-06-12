const mongoose =
require("mongoose")


const stockHistorySchema =
new mongoose.Schema({

 productId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Inventory"
 },


 action:{
  type:String
 },


 quantity:Number,


 invoiceId:String,


 date:{
  type:Date,
  default:Date.now
 }


})


module.exports =
mongoose.model(
 "StockHistory",
 stockHistorySchema
)