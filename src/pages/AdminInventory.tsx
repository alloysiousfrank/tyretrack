import {
 useEffect,
 useState
}
from "react"

export default function
AdminInventory(){

const [search,setSearch] =
useState("")
  
 const [
  productName,
  setProductName
 ] = useState("")

 const [
  category,
  setCategory
 ] = useState("")

 const [
  quantity,
  setQuantity
 ] = useState(0)

 const [
  purchasePrice,
  setPurchasePrice
 ] = useState(0)

 const [
  sellingPrice,
  setSellingPrice
 ] = useState(0)

 const [
  products,
  setProducts
 ] = useState<any[]>([])

 const [brand,setBrand] =
useState("")

const [tyreSize,setTyreSize] =
useState("")

const [supplier,setSupplier] =
useState("")

const [minStock,setMinStock] =
useState(5)

const [description,setDescription] =
useState("")

const [stats,setStats] =
useState<any>({})

 const fetchProducts =
async()=>{

 try{

  const response =
  await fetch(
   "https://tyretrack-server.onrender.com/api/inventory"
  )

  const data =
  await response.json()

  setProducts(
   data.products || []
  )

  const statsResponse =
  await fetch(
   "https://tyretrack-server.onrender.com/api/inventory/stats"
  )

  const statsData =
  await statsResponse.json()

  setStats(statsData)

 }catch(error){

  console.log(error)

 }

}

 useEffect(()=>{

  fetchProducts()

 },[])



 const addProduct =
 async()=>{
 if(!productName.trim()){
  alert("Enter Product Name")
  return
 }

 if(!category){
  alert("Select Category")
  return
 }

 if(quantity <= 0){
  alert("Enter Quantity")
  return
 }
  await fetch(

"https://tyretrack-server.onrender.com/api/inventory",

   {

    method:"POST",

    headers:{
     "Content-Type":
     "application/json"
    },

body:JSON.stringify({

 productName,
 category,

 brand,

 tyreSize,

 supplier,

 description,

 minStock,

 quantity,

 purchasePrice,

 sellingPrice

})

   }

  )

  fetchProducts()

 }

 const deleteProduct =
async(id:string)=>{

 try{

  await fetch(

`https://tyretrack-server.onrender.com/api/inventory/${id}`,

   {
    method:"DELETE"
   }

  )

  fetchProducts()

 }catch(error){

  console.log(error)

 }

}

const updateStock =
async(
 id:string,
 quantity:number
)=>{

 try{

  await fetch(

`https://tyretrack-server.onrender.com/api/inventory/${id}`,

   {

    method:"PUT",

    headers:{
     "Content-Type":
     "application/json"
    },

    body:JSON.stringify({

     quantity

    })

   }

  )

  fetchProducts()

 }catch(error){

  console.log(error)

 }

}
 return(

<div className="admin-page">

<div className="admin-container">

<h1>
Inventory Management
</h1>
<div className="dashboard-grid">

<div
 className="admin-card inventory-form"
>

  <h3>
   Total Products
  </h3>

  <h1>
   {stats.totalProducts || 0}
  </h1>

 </div>

 <div className="admin-card">

  <h3>
   Inventory Value
  </h3>

  <h1>
   ₹{stats.totalStockValue || 0}
  </h1>

 </div>

 <div className="admin-card">

  <h3>
   Low Stock
  </h3>

  <h1>
   {stats.lowStock || 0}
  </h1>

 </div>

</div>

<div className="admin-card">

<h2>Add Inventory Item</h2>
<input
 className="inventory-search"
 placeholder=" Search Product"
/>
<div className="field-group">

<label>
Product Name
</label>

<input
 className="inventory-input"
 placeholder="Michelin Tyre"
 value={productName}
 onChange={(e)=>
 setProductName(e.target.value)
}
/>

</div>

<div className="field-group">

<label>
Category
</label>

<select
 className="inventory-input"
 value={category}
 onChange={(e)=>
 setCategory(e.target.value)
}
>

<option value="">
Select Category
</option>

<option value="Tyres">
Tyres
</option>

<option value="Oil">
Oil
</option>

<option value="Accessories">
Accessories
</option>

<option value="Cleaning">
Cleaning
</option>

</select>

</div>

<div className="field-group">

<label>
Brand
</label>

<input
 className="inventory-input"
 placeholder="Michelin / MRF"
 value={brand}
 onChange={(e)=>
 setBrand(e.target.value)
}
/>

</div>

<div className="field-group">

<label>
Tyre Size
</label>

<input
 className="inventory-input"
 placeholder="90/90 R17"
 value={tyreSize}
 onChange={(e)=>
 setTyreSize(e.target.value)
}
/>

</div>

<div className="field-group">

<label>
Supplier Name
</label>

<input
 className="inventory-input"
 placeholder="Supplier Name"
 value={supplier}
 onChange={(e)=>
 setSupplier(e.target.value)
}
/>

</div>

<div className="field-group">

<label>
Description
</label>

<textarea
 className="inventory-input"
 placeholder="Product Description"
 value={description}
 onChange={(e)=>
 setDescription(e.target.value)
}
/>

</div>

<div className="field-group">

<label>
Available Stock
</label>

<input
 className="inventory-input"
placeholder="Available Stock"
 type="number"
 value={quantity}
 onChange={(e)=>
 setQuantity(
  Number(e.target.value)
 )
}
/>

</div>

<div className="field-group">

<label>
Minimum Stock Alert
</label>

<input
 className="inventory-input"
placeholder="Minimum Stock"
 type="number"
 value={minStock}
 onChange={(e)=>
 setMinStock(
  Number(e.target.value)
 )
}
/>

</div>

<div className="field-group">

<label>
Purchase Price (₹)
</label>

<input
 className="inventory-input"
 type="number"
 value={purchasePrice}
 onChange={(e)=>
 setPurchasePrice(
  Number(e.target.value)
 )
}
/>

</div>

<div className="field-group">

<label>
Selling Price (₹)
</label>

<input
 className="inventory-input"
 type="number"
 value={sellingPrice}
 onChange={(e)=>
 setSellingPrice(
  Number(e.target.value)
 )
}
/>

</div>

<button
 className="update-btn"
 onClick={addProduct}
>
 Add Product
</button>

</div>

<hr/>
<div className="inventory-grid"> 
{
products.filter(product =>

 product.productName
 .toLowerCase()
 .includes(
  search.toLowerCase()
 )

 ||

 product.brand
 ?.toLowerCase()
 .includes(
  search.toLowerCase()
 )

).map(product=>(

<div
 key={product._id}
 className="admin-card"
 style={{
  border:
  product.quantity <= 5
  ?
  "2px solid red"
  :
  "none"
 }}
>

<h3>
{product.productName}
</h3>

<p>
 Category :
 <strong>
  {product.category}
 </strong>
</p>

<p>
 Brand :
 <strong>
  {product.brand}
 </strong>
</p>

<p>
 Stock :
 <strong
  style={{
   color:
    product.quantity <= product.minStock
    ? "red"
    : "#00ff88"
  }}
 >
  {product.quantity}
 </strong>
</p>

<input
 type="number"
 defaultValue={
  product.quantity
 }
 onBlur={(e)=>
 updateStock(

  product._id,

  Number(
   e.target.value
  )

 )
}
/>
{
 product.quantity <= 5 && (

<div
 style={{
  background:
   "rgba(255,0,0,.15)",

  border:
   "1px solid red",

  padding:"10px",

  borderRadius:"10px",

  color:"red",

  marginTop:"10px"
 }}
>

⚠ Low Stock Alert

</div>

)
}

<p>
Buy :
₹{product.purchasePrice}
</p>

<p>
Sell :
₹{product.sellingPrice}
</p>

<p
 style={{
  color:"#00ff88",
  fontWeight:"bold"
 }}
>
Profit :
₹{
 product.sellingPrice -
 product.purchasePrice
}
</p>

<button
 className="delete-booking-btn"
 onClick={()=>
 deleteProduct(
  product._id
 )
}
>
Delete Product
</button>

</div>

))
}
</div>
</div>

</div>

 )

}