const Invoice = require("../models/Invoice")
const Booking = require("../models/Booking")
const Inventory = require("../models/Inventory")
exports.createInvoice = async (req,res)=>{

 try{

  const lastInvoice =
  await Invoice.findOne()
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

  // =====================
// STOCK VALIDATION
// =====================

if(
 req.body.tyreBrand &&
 Number(req.body.tyreQuantity) > 0
){

 const tyreProduct =
 await Inventory.findOne({

  brand:req.body.tyreBrand

 })

 if(!tyreProduct){

  return res.status(400).json({

   success:false,

   message:
   "Selected tyre brand not found in inventory"

  })

 }

 if(
  tyreProduct.quantity <
  Number(req.body.tyreQuantity)
 ){

  return res.status(400).json({

   success:false,

   message:
   `Only ${tyreProduct.quantity} tyre(s) available in stock`

  })

 }

}

  // =====================
  // CUSTOM SERVICES TOTAL
  // =====================

const customServices =
(req.body.customServices || [])
.map(service => ({

 ...service,

 total:
 Number(service.quantity || 0)
 *
 Number(service.amount || 0)

}))

  if(
 req.body.vehicleNumber
){

 req.body.vehicleNumber =
 req.body.vehicleNumber
 .toUpperCase()

}

const invoice = await Invoice.create({

 ...req.body,

 email:req.body.email.toLowerCase(),

 vehicleNumber:
 req.body.vehicleNumber.toUpperCase(),

 invoiceId,

 invoiceNumber:nextNumber

})

const invoice =
await Invoice.create({

 ...req.body,

 status:"Completed",

 customServices,

 invoiceId,

 invoiceNumber:
 nextNumber

})

// =====================
// STOCK DEDUCTION
// =====================

if(
 req.body.tyreBrand &&
 Number(req.body.tyreQuantity) > 0
){

 const tyreProduct =
 await Inventory.findOne({

  brand:req.body.tyreBrand

 })

 if(tyreProduct){

  tyreProduct.quantity -=
  Number(req.body.tyreQuantity)

  await tyreProduct.save()

 }

}

  // =====================
  // BOOKING COMPLETE
  // =====================

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

