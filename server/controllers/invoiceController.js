const Invoice = require("../models/Invoice")
const Booking = require("../models/Booking")
const Inventory = require("../models/Inventory")
exports.createInvoice = async (req,res)=>{

 try{

const lastInvoice =
await Invoice
.findOne()
.sort({
 createdAt:-1
})

let nextNumber = 1

if(lastInvoice){

 nextNumber =
 (
  lastInvoice.invoiceNumber || 0
 ) + 1

}

const invoiceId =
`INV-${String(
 nextNumber
).padStart(6,"0")}`

const invoice =
await Invoice.create({

 ...req.body,

 invoiceId,

 invoiceNumber:
 nextNumber

})


// AUTO INVENTORY DEDUCTION

if(req.body.items){

 for(const item of req.body.items){

  await Inventory.findByIdAndUpdate(

   item.productId,

   {
    $inc:{
     quantity:
     -item.quantity
    }
   }

  )

 }

}

await Booking.findOneAndUpdate(
 {
  bookingId:
  req.body.bookingId
 },
 {
  invoiceGenerated:true,

  invoiceId,

  status:"Completed",

  currentStage:4,

  completed:true
 }
)

   res.json({
    success:true,
    invoice
   })

 }catch(error){

  console.log(error)

  res.status(500).json({
   success:false
  })

 }

}

exports.getInvoices =
async(req,res)=>{

 try{

  const invoices =
   await Invoice.find()
   .sort({
    createdAt:-1
   })

  res.json({
   success:true,
   invoices
  })

 }catch(error){

  res.status(500).json({
   success:false
  })

 }

}


exports.getInvoicesByVehicle =
async (req,res)=>{

 try{

  const invoices =
   await Invoice.find({
    vehicleNumber:
    req.params.vehicleNumber
   })
   .sort({
    createdAt:-1
   })

  res.json({
   success:true,
   invoices
  })

 }catch(error){

  console.log(error)

  res.status(500).json({
   success:false
  })

 }

}

exports.getInvoiceById =
async(req,res)=>{

 try{

  const invoice =
   await Invoice.findById(
    req.params.id
   )

  res.json({
   success:true,
   invoice
  })

 }catch(error){

  console.log(error)

  res.status(500).json({
   success:false
  })

 }

  }

exports.getInvoicesByCustomer =
async (req,res)=>{

 try{

  const invoices =
   await Invoice.find({

    email:
    req.params.email

   })

   .sort({
    createdAt:-1
   })

  res.json({

   success:true,

   invoices

  })

 }catch(error){

  console.log(error)

  res.status(500).json({

   success:false

  })

 }

}

