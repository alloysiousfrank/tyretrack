const Inventory =
require("../models/Inventory")

exports.createProduct =
async(req,res)=>{

 try{

  const product =
  await Inventory.create(
   req.body
  )

  res.json({
   success:true,
   product
  })

 }catch(error){

  console.log(error)

  res.status(500).json({
   success:false
  })

 }

}

exports.getProducts =
async(req,res)=>{

 try{

  const products =
  await Inventory.find()
  .sort({
   createdAt:-1
  })

  res.json({
   success:true,
   products
  })

 }catch(error){

  console.log(error)

  res.status(500).json({
   success:false
  })

 }

}

exports.getInventoryStats =
async(req,res)=>{

 try{

  const products =
  await Inventory.find()

  let totalProducts = 0
  let totalStockValue = 0
  let lowStock = 0

  products.forEach(product=>{

   totalProducts += 1

   totalStockValue +=
   (
    product.quantity *
    product.purchasePrice
   )

   if(
    product.quantity <=
    product.minStock
   ){

    lowStock++

   }

  })

  res.json({

   success:true,

   totalProducts,

   totalStockValue,

   lowStock

  })

 }catch(error){

  console.log(error)

  res.status(500).json({

   success:false

  })

 }

}

exports.deleteProduct =
async(req,res)=>{

 try{

  await Inventory.findByIdAndDelete(
   req.params.id
  )

  res.json({
   success:true
  })

 }catch(error){

  console.log(error)

  res.status(500).json({
   success:false
  })

 }

}

exports.updateStock =
async(req,res)=>{

 try{

  const product =
  await Inventory.findByIdAndUpdate(

   req.params.id,

   {
    quantity:
    req.body.quantity
   },

   {
    new:true
   }

  )

  res.json({

   success:true,

   product

  })

 }catch(error){

  console.log(error)

  res.status(500).json({

   success:false

  })

 }

}