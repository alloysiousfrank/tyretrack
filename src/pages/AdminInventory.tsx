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

 <div className="admin-card">

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

<input
 placeholder="Search Product"
 value={search}
 onChange={(e)=>
 setSearch(
  e.target.value
 )
}
/>

<input
 placeholder="Product Name"
 value={productName}
 onChange={(e)=>
 setProductName(
  e.target.value
 )}
/>
<select>
<input
 placeholder="Category"
 value={category}
 onChange={(e)=>
 setCategory(
  e.target.value
 )}
/>

<option value="">
Category
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

<input
 type="number"
 placeholder="Quantity"
 value={quantity}
 onChange={(e)=>
 setQuantity(
 Number(
  e.target.value
 )
 )}
/>

<input
 type="number"
 placeholder="Purchase Price"
 value={purchasePrice}
 onChange={(e)=>
 setPurchasePrice(
 Number(
  e.target.value
 )
 )}
/>

<input
 type="number"
 placeholder="Selling Price"
 value={sellingPrice}
 onChange={(e)=>
 setSellingPrice(
 Number(
  e.target.value
 )
 )}
/>

<button
 className="update-btn"
 onClick={addProduct}
>

Add Product

</button>

<hr/>

{
 products.filter(product =>
  product.productName.toLowerCase().includes(search.toLowerCase())
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
{product.category}
</p>

<p>

Stock :

<span
 style={{
  color:
   product.quantity <= 5
   ? "red"
   : "lime",
  fontWeight:"bold"
 }}
>

 {product.quantity}

</span>

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

<p
 style={{
  color:"red",
  fontWeight:"bold"
 }}
>
⚠ Low Stock
</p>

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
<p>

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

 )

}