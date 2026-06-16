const mongoose =
require("mongoose")


const inventorySchema =
new mongoose.Schema({

 productName:{
  type:String,
  required:true,
 },


 brand:{
  type:String,
  default:"",
 },


 tyreSize:{
  type:String,
  default:"",
 },


category:{
 type:String,
 enum:[
  "Tyres",
  "Oil",
  "Accessories",
  "Cleaning",
  "Service"
 ],
 default:"Tyres"
},


 quantity:{
  type:Number,
  default:0,
 },


 purchasePrice:{
  type:Number,
  default:0,
 },


 sellingPrice:{
  type:Number,
  default:0,
 },


 minStock:{
  type:Number,
  default:5
 },


 // NEW
 supplier:{
  type:String,
  default:""
 },


 // NEW
 description:{
  type:String,
  default:""
 },


},
{
 timestamps:true
})


module.exports =
mongoose.model(
 "Inventory",
 inventorySchema
)