const Invoice = require("../models/Invoice")
const Booking = require("../models/Booking")

exports.createInvoice = async (req,res)=>{

 try{

  const invoiceId =
   "INV" +
   Math.floor(
    100000 +
    Math.random()*900000
   )

  const invoice =
   await Invoice.create({

    ...req.body,

    invoiceId

   })

   await Booking.findOneAndUpdate(
    {
      bookingId:
      req.body.bookingId
    },
    {
      invoiceGenerated:true,
      invoiceId
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
