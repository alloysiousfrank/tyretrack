import { useEffect, useState } from "react"
import {
 generateInvoicePdf
}
from
"../utils/generateInvoicePdf"
import "./AdminInvoices.css"


export default function AdminInvoices() {


const [selectedTyreBrand,setSelectedTyreBrand] =
useState("")

const [tyreQuantity,setTyreQuantity] =
useState(1)

const [customServices,setCustomServices] =
useState<any[]>([

 {
  serviceName:"",
  quantity:1,
  amount:0
 }

])


const [bookingId,setBookingId] =
useState("")

  const [customerName, setCustomerName] =
    useState("")

  const [vehicleNumber, setVehicleNumber] =
    useState("")

  const [vehicleType, setVehicleType] =
    useState("")

  const [vehicleKm,setVehicleKm] =
useState("")

const [email, setEmail] =
useState("")

const [phone, setPhone] =
useState("")

const [invoices,
 setInvoices] =
 useState<any[]>([])

 const [tyreBrands,setTyreBrands] =
useState<any[]>([])

const [customerProfile,setCustomerProfile] =
useState<any>(null)

const [applyGST,setApplyGST] =
useState(true)

const [expandedInvoice,
setExpandedInvoice] =
useState("")

const [includeGST,setIncludeGST] =
useState(true)

  const [
 vehicleHistory,
 setVehicleHistory
] = useState<any[]>([])

const totalVisits =
vehicleHistory.length

const totalSpent =
vehicleHistory.reduce(
 (sum,invoice)=>
 sum +
 Number(
  invoice.totalAmount || 0
 ),
 0
)

const selectedBookingId =
localStorage.getItem(
 "selectedBookingId"
)

const lastVisit =
vehicleHistory.length > 0
? new Date(
 vehicleHistory[0].createdAt
).toLocaleDateString()
: "-"

const favouriteService =
vehicleHistory.length > 0
? vehicleHistory
   .flatMap(
    invoice =>
    invoice.services || []
   )
   .sort(
    (a,b)=>
     vehicleHistory
      .flatMap(
       invoice =>
       invoice.services || []
      )
      .filter(
       x=>x===b
      ).length
     -
     vehicleHistory
      .flatMap(
       invoice =>
       invoice.services || []
      )
      .filter(
       x=>x===a
      ).length
   )[0]
: "-"

const [showHistory,setShowHistory] =
useState(false)

const addCustomService = ()=>{

 setCustomServices([

  ...customServices,

  {
   serviceName:"",
   quantity:1,
   amount:0
  }

 ])

}

useEffect(()=>{

 fetchInvoices()

 const interval =
 setInterval(
  fetchInvoices,
  3000
 )

 return ()=>clearInterval(
  interval
 )

},[])

const fetchBookingByEmail =
async()=>{

 if(!email) return

 try{

  const response =
  await fetch(

`https://tyretrack-server.onrender.com/api/bookings/user/${email}`

  )

  const data =
  await response.json()

  if(
   data.success &&
   data.bookings.length > 0
  ){

const latestBooking =
data.bookings.find(
 (booking:any)=>
 !booking.invoiceGenerated
)

if(latestBooking){

 setBookingId(
  latestBooking.bookingId
 )

}

  }

 }catch(error){

  console.log(error)

 }

}

useEffect(()=>{

 fetchBookingByEmail()

},[email])

const fetchInvoices = async () => {

 try {
  const response =
   await fetch(
    "https://tyretrack-server.onrender.com/api/invoices"
   )

  const data =
   await response.json()

  setInvoices(
   data.invoices
  )

  const inventoryResponse =
await fetch(
 "https://tyretrack-server.onrender.com/api/inventory"
)

const inventoryData =
await inventoryResponse.json()

setTyreBrands(

 inventoryData.products.filter(
  (product:any)=>
   product.category === "Tyres"
 )

)

 } catch(error){

  console.log(error)

 }

}

useEffect(()=>{

 if(!selectedBookingId)
 return

 fetch(
  `https://tyretrack-server.onrender.com/api/bookings`
 )
 .then(res=>res.json())
 .then(data=>{

  const booking =
  data.find(
   (b:any)=>
   b.bookingId ===
   selectedBookingId
  )

  if(booking){

   setCustomerName(
    booking.name
   )

   setEmail(
    booking.email
   )

   setPhone(
    booking.phone
   )

   setVehicleNumber(
    booking.vehicleNumber
   )

  }

 })

},[])

const fetchVehicleHistory =
async (
 vehicleNo:string
)=>{

 try{

  const response =
   await fetch(

`https://tyretrack-server.onrender.com/api/invoices/vehicle/${vehicleNo}`

   )

  const data =
   await response.json()

  if(data.success){

   setVehicleHistory(
    data.invoices
   )
if(data.invoices.length > 0){

 const latest =
 data.invoices[0]

 const totalRevenue =
 data.invoices.reduce(
  (sum:number,invoice:any)=>
   sum +
   Number(
    invoice.totalAmount || 0
   ),
 0
 )

 setCustomerProfile({

  customerName:
  latest.customerName,

  phone:
  latest.phone,

  vehicleNumber:
  latest.vehicleNumber,

  totalVisits:
  data.invoices.length,

  totalRevenue,

  lastVisit:
  latest.createdAt

 })

}
  }

 }catch(error){

  console.log(error)

 }

}




const servicePrices:any = {

 "Wheel Alignment":800,
 "Wheel Balancing":400,
 "Foam Wash":500,
 "Automatic Car Spa":1500,
 "Multi Branded Tyres":5000,
 "Interior Cleaning":1000,
 "Teflon Coating":3000,
 "Ceramic Coating":8000,
 "General Service":2500,
 "Accessories":1000,

}



const [selectedServices,
 setSelectedServices] =
 useState<string[]>([])

const [subtotal,
 setSubtotal] =
 useState(0)

const [gst,
 setGst] =
 useState(0)

const [total,
 setTotal] =
 useState(0)

useEffect(() => {

 let amount = 0

 selectedServices.forEach(service => {

  if(
   service ===
   "Multi Branded Tyres"
  ){

   const tyrePrice =
   tyreBrands.find(
    tyre =>
    tyre.brand ===
    selectedTyreBrand
   )?.sellingPrice || 5000

   amount +=
   tyrePrice *
   tyreQuantity

  }else{

   amount +=
   servicePrices[service]

  }

 })

 customServices.forEach(service => {

  amount +=
  Number(service.quantity) *
  Number(service.amount)

 })

const gstAmount =
includeGST
 ? amount * 0.18
 : 0

 setSubtotal(amount)

 setGst(gstAmount)

 setTotal(
  amount + gstAmount
 )

},[
 selectedServices,
 customServices,
 tyreQuantity,
 selectedTyreBrand,
 tyreBrands,
  applyGST,
   includeGST
])


 const toggleService =
(service:string)=>{

 let updated = [...selectedServices]

 if(
  updated.includes(service)
 ){

  updated =
   updated.filter(
    s => s !== service
   )

 }else{

  updated.push(service)

 }

 setSelectedServices(updated)

 let amount = 0

 updated.forEach(service=>{

  amount +=
   servicePrices[service]

 })

 customServices.forEach(
 service=>{

 amount +=
 Number(
  service.quantity
 ) *
 Number(
  service.amount
 )

 }
)

 const gstAmount =
  amount * 0.18

 setSubtotal(amount)

 setGst(gstAmount)

 setTotal(
  amount + gstAmount
 )

}
 useEffect(() => {

 fetchInvoices()

}, [])

const updateCustomService = (

 index:number,

 field:string,

 value:any

)=>{

 const updated =
 [...customServices]

 updated[index] = {

  ...updated[index],

  [field]:value

 }

 setCustomServices(
  updated
 )

}

const saveInvoice =
async()=>{
if(!customerName){
 alert("Enter Customer Name")
 return
}



if(!phone){
 alert("Enter Phone")
 return
}

if(!vehicleNumber){
 alert("Enter Vehicle Number")
 return
}
 try{
 let selectedTyrePrice = 0

if(
 selectedServices.includes(
  "Multi Branded Tyres"
 )
){

 const selectedTyre =
 tyreBrands.find(
  tyre =>
  tyre.brand ===
  selectedTyreBrand
 )

 if(!selectedTyre){

  alert(
   "Select Tyre Brand"
  )

  return

 }

 if(
  tyreQuantity >
  selectedTyre.quantity
 ){

  alert(
   `Only ${selectedTyre.quantity} tyres available`
  )

  return

 }

 selectedTyrePrice =
 selectedTyre.sellingPrice

}


const response =
await fetch(
 "https://tyretrack-server.onrender.com/api/invoices",
 {
  method:"POST",
  headers:{
   "Content-Type":"application/json"
  },
  body:JSON.stringify({
   bookingId,
   customerName,
email: email || "",
   phone,
   vehicleNumber,
   vehicleType,
   vehicleKm,
   services:selectedServices,
   customServices:
   customServices.filter(
    service =>
    service.serviceName.trim() !== ""
   ),
   tyreBrand:selectedTyreBrand,
   tyreQuantity,
   tyrePrice:selectedTyrePrice,
   subtotal,
    includeGST,
   gst,
   totalAmount:total
  })
 }
)

if(!response.ok){

 const errorText =
 await response.text()

 console.error("Server Error Full:", errorText)
alert(errorText)
 return
}



  const data =
  await response.json()

  if(!data.success){

 alert(
  data.message ||
  "Invoice Generation Failed"
 )

 return

}



alert("Invoice Created ✅")

fetchInvoices()

// Generate PDF
const pdfBlob = await generateInvoicePdf(
  data.invoice
)
console.log(pdfBlob)

console.log(pdfBlob instanceof Blob)
if (!pdfBlob) {

   alert("PDF Generation Failed")

   return

}
// Create FormData
const formData = new FormData()

formData.append(
  "invoice",
  pdfBlob,
  `${data.invoice.invoiceId}.pdf`
)

formData.append(
  "email",
  data.invoice.email
)

formData.append(
  "customerName",
  data.invoice.customerName
)

formData.append(
  "invoiceId",
  data.invoice.invoiceId
)

// Send email
const emailResponse = await fetch(
  "https://tyretrack-server.onrender.com/api/invoices/send-email",
  {
    method: "POST",
    body: formData,
  }
)

const emailData = await emailResponse.json()

console.log(emailData)

if (!emailResponse.ok) {

   alert(emailData.message)

   return

}

console.log("Invoice Email Sent ✅")

} catch(error){

   console.log(error)

}

}   // <-- saveInvoice ends here

const publishInvoice = async(id:string)=>{

 try{

const response = await fetch(
  `https://tyretrack-server.onrender.com/api/invoices/publish/${id}`,
  {
    method: "PUT"
  }
)

if (!response.ok) {

  const text = await response.text()

  console.log(text)

  throw new Error(
    `Server returned ${response.status}`
  )
}

const data = await response.json()

  if(data.success){

   alert(
    "Invoice Published ✅"
   )

   fetchInvoices()

  }

 }catch(error){

  console.log(error)

 }

}

  return (

    <div className="admin-page">

      <div className="admin-container">

<h1 className="invoice-page-title">
Invoice Generator
</h1>

<div className="invoice-form-grid">

<div className="form-group">

<label>
Customer Name
</label>
        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e)=>
            setCustomerName(
              e.target.value
            )
          }
        />
</div>
<div className="form-group">

<label>
Vehicle Number
</label>
        <input
  type="text"
  placeholder="Vehicle Number"
  value={vehicleNumber}
  onChange={(e)=>{

    const value =
      e.target.value.toUpperCase()

    setVehicleNumber(value)

    if(value.length >= 4){

      fetchVehicleHistory(
        value
      )

    }

  }}
/>
</div>

<div className="form-group">

<label>
Customer Mail ID
</label>
<input
 type="email"
 placeholder="Customer Email (Optional)"
 value={email}
 onChange={(e)=>
  setEmail(e.target.value)
 }
/>

</div>

<div className="form-group">

<label>
Customer Phone Number
</label>
<input
 type="text"
 placeholder="Customer Phone"
 value={phone}
 onChange={(e)=>
  setPhone(e.target.value)
 }
/>
</div>

<div className="form-group">

<label>
Vehicle KM
</label>
   <input
 type="number"
 placeholder="Vehicle KM"
 value={vehicleKm}
 onChange={(e)=>
  setVehicleKm(
   e.target.value
  )
 }
/>
</div>
<div className="form-group">

<label>
Vehicle Type
</label>
        <select
  value={vehicleType}
  onChange={(e)=>
    setVehicleType(
      e.target.value
    )
  }
 >
 
          <option value="">
            Vehicle Type
          </option>

          <option value="Bike">
            Bike
          </option>

          <option value="Car">
            Car
          </option>

        </select>

    </div>  

</div>
{
customerProfile && (

<div className="customer-profile-card">

<div className="profile-top">

<div className="profile-avatar">

👤

</div>

<div className="profile-details">

<h2>
{customerProfile.customerName}
</h2>

<p>
📞 {customerProfile.phone}
</p>

<p>
🚘 {customerProfile.vehicleNumber}
</p>

</div>

</div>

<div className="profile-stats">

<div className="stat-box">

<span>💰 Revenue</span>

<h3>
₹{
customerProfile.totalRevenue
.toLocaleString()
}
</h3>

</div>

<div className="stat-box">

<span>📜 Visits</span>

<h3>
{customerProfile.totalVisits}
</h3>

</div>

<div className="stat-box">

<span>📅 Last Visit</span>

<h3>
{
new Date(
 customerProfile.lastVisit
).toLocaleDateString()
}
</h3>

</div>

</div>

</div>

)
}
<div className="history-glass-container">

<div
 className="history-highlight-card"
 onClick={()=>
  setShowHistory(!showHistory)
 }
>

<div className="history-title">

<div className="history-icon">
📜
</div>

<div>

<h2>
Vehicle Service History
</h2>

<p>
{totalVisits} Service Visits Found
</p>

</div>

</div>

<div className="history-expand">

{
showHistory
? "▲ Close"
: "▼ View History"
}

</div>

</div>
</div>
</div>
<div
 className="history-invoices"
>
{
 showHistory &&
 vehicleHistory.length > 0 && (

<div
 className="admin-card"
>

<p>
Total Visits :
{
 vehicleHistory.length
}
</p>

{
vehicleHistory.map(
(invoice)=>(



<div
 key={invoice._id}
 className="history-card"
>

<div className="history-header">

<h4>
📄 {invoice.invoiceId}
</h4>

<div className="invoice-actions">

<button
 className="view-btn"
 onClick={() =>
 setExpandedInvoice(
  expandedInvoice === invoice._id
  ? ""
  : invoice._id
 )
}
>
👁 View
</button>

<button
 className="update-btn"
 onClick={() =>
 generateInvoicePdf(invoice)
}
>
⬇ Download
</button>

</div>

</div>

<p>
🚘 Vehicle :
{invoice.vehicleNumber}
</p>

<p>
💰 Amount :
₹ {invoice.totalAmount}
</p>
{
expandedInvoice === invoice._id && (

<div className="invoice-details">

<h4>
Customer Details
</h4>

<p>
👤 {invoice.customerName}
</p>

<p>
📱 {invoice.phone}
</p>

<p>
🚘 {invoice.vehicleNumber}
</p>

<p>
🚗 {invoice.vehicleType}
</p>

<hr/>

<h4>
Services
</h4>

{
invoice.services?.map(
(service:string,index:number)=>(
<p key={index}>
✅ {service}
</p>
))
}

{
invoice.customServices?.map(
(service:any,index:number)=>(
<p key={index}>
➕ {service.serviceName}
 ×
 {service.quantity}
</p>
))
}

<hr/>

<p>
Subtotal :
₹ {invoice.subtotal}
</p>

<p>
GST :
₹ {invoice.gst}
</p>

<h3>
Total :
₹ {invoice.totalAmount}
</h3>

</div>

)
}
<p>
📅 Date :
{
 new Date(
  invoice.createdAt
 ).toLocaleDateString()
}
</p>

<p>
🛠 Services :
{
 invoice.services?.join(", ")
}
</p>

{
invoice.customServices?.length > 0 && (

<p>

➕ Extra Services :

{
invoice.customServices
.map(
(service:any)=>
service.serviceName
)
.join(", ")
}

</p>

)

}

</div>

))
}

<hr/>

</div>

)
}

       <h3>Select Services</h3>


       <div className="service-list">

{

Object.keys(
 servicePrices
).map(service=>(

<div
 key={service}
 className="service-item"
>

<label>

<input
 type="checkbox"

 checked={
 selectedServices.includes(
  service
 )
 }

 

 onChange={()=>
 toggleService(
  service
 )
}
 


/>

 {service}

</label>




</div>

))

}

</div>
{
selectedServices.includes(
 "Multi Branded Tyres"
) && (

<div className="admin-card">

<h3>
Select Tyre Brand
</h3>

<select
 value={selectedTyreBrand}
 onChange={(e)=>
  setSelectedTyreBrand(
   e.target.value
  )
 }
>

<option value="">
 Select Brand
</option>

{
 tyreBrands.map(
  (brand:any)=>(

   <option
    key={brand._id}
    value={brand.brand}
   >

    {brand.brand}
    (
    {brand.quantity}
    in stock
    )

   </option>

  )
 )
}

</select>

<input
 type="number"
 min="1"
 value={tyreQuantity}
 onChange={(e)=>
  setTyreQuantity(
   Number(e.target.value)
  )
 }
/>

<p>

Available Stock :

{

 tyreBrands.find(
  tyre =>
  tyre.brand ===
  selectedTyreBrand
 )?.quantity || 0

}

</p>
</div>
)
}
<h3>
Custom Services
</h3>

{
customServices.map(
 (service,index)=>(

  <div
   key={index}
   className="admin-card"
  >

   <input
    placeholder="Service Name"
    value={service.serviceName}
    onChange={(e)=>
     updateCustomService(
      index,
      "serviceName",
      e.target.value
     )
    }
   />

   <input
    type="number"
    placeholder="Qty"
    value={service.quantity}
    onChange={(e)=>
     updateCustomService(
      index,
      "quantity",
      Number(e.target.value)
     )
    }
   />

   <input
    type="number"
    placeholder="Amount"
    value={service.amount}
    onChange={(e)=>
     updateCustomService(
      index,
      "amount",
      Number(e.target.value)
     )
    }
   />

  </div>

 ))
}





<button
 className="update-btn"
 onClick={
  addCustomService
 }
>

+ Add Another Service

</button>

<div className="gst-toggle">

<label>

<input
 type="checkbox"
 checked={includeGST}
 onChange={(e)=>
  setIncludeGST(
   e.target.checked
  )
 }
/>

Apply GST (18%)

</label>

</div>

<div className="invoice-summary">

  <h3>
    Subtotal : ₹ {subtotal}
  </h3>

  <h3>
    GST : ₹ {gst}
  </h3>

  <h2>
    Total : ₹ {total}
  </h2>

  <button
    className="update-btn"
    onClick={saveInvoice}
  >
    Generate Invoice
  </button>

</div>


<button
 className="update-btn"
 onClick={() =>
   window.print()
 }
>

 Print Invoice

</button>

<h2
  style={{
    marginTop: "40px",
  }}
>
  Generated Invoices
</h2>


<div
  className="invoice-preview"
>

  <div className="invoice-header">

    <img
      src="/logo5.png"
      alt="TyreTrack"
      className="invoice-logo"
    />

    <div>

      <h1>TYRETRACK</h1>

      <p>
        Premium Auto Care
      </p>

      <p>
        Tiruppur
      </p>
     <p>
Invoice No :
{
 invoices[0]?.invoiceId ||
 "Generating..."
}
</p>
<p>

Date :

{
 new Date()
 .toLocaleDateString()
}

</p>

    </div>

  </div>

  <hr />

  <div className="invoice-customer">

    <p>
      Customer :
      {customerName}
    </p>

    <p>
      Email :
      {email}
    </p>

    <p>
      Phone :
      {phone}
    </p>

    <p>
      Vehicle :
      {vehicleNumber}
    </p>
    <p>
 KM :
 {vehicleKm}
</p>
    <p>
      Type :
      {vehicleType}
    </p>



{
selectedTyreBrand && (

<p>
Tyre Brand :
{selectedTyreBrand}
</p>

)
}

{
selectedServices.includes(
 "Multi Branded Tyres"
) && (

<p>
Tyre Qty :
{tyreQuantity}
</p>

)
}

  </div>

  <table className="invoice-table">

 <thead>

  <tr>

   <th>Service</th>

   <th>Price</th>

  </tr>

 </thead>

 <tbody>

  {
   selectedServices.map(
    service => (

     <tr key={service}>

      <td>{service}</td>

     <td>
 ₹{
 service === "Multi Branded Tyres"
 ?
 (
  Number(
   tyreBrands.find(
    tyre =>
    tyre.brand === selectedTyreBrand
   )?.sellingPrice || 5000
  ) *
  Number(tyreQuantity)
 )
 :
 servicePrices[service]
 }
</td>

     </tr>

    )
   )
  }

{
customServices
 .filter(
  service =>
   service.serviceName.trim() !== ""
 )
 .map(
  (service,index)=>(

   <tr key={index}>

    <td>
     {service.serviceName}
     ×
     {service.quantity}
    </td>

    <td>
     ₹{
      Number(service.amount) *
      Number(service.quantity)
     }
    </td>

   </tr>

  ))
}

 </tbody>

</table>

<div className="invoice-total">

 <p>
  Subtotal :
  ₹ {subtotal}
 </p>

 <p>
  GST :
  ₹ {gst}
 </p>

 <h2>
  Total :
  ₹ {total}
 </h2>

</div>
</div>
<div className="admin-bookings">

{
  invoices.map((invoice) => (

    <div
 key={invoice._id}
 className="admin-card"
>

<button
 className="update-btn"
 onClick={() =>
 generateInvoicePdf(
  invoice
 )
}
>
 Download PDF
</button>

<div className="admin-card">

<h3>{invoice.invoiceId}</h3>

<button
 className="publish-btn"
 onClick={()=>
  publishInvoice(
   invoice._id
  )
 }
 disabled={invoice.isPublished}
>
{
 invoice.isPublished
 ? "Published"
 : "🚀 Publish"
}
</button>

</div>

      <h3>
        {invoice.invoiceId}
      </h3>

      <p>
        Customer :
        {invoice.customerName}
      </p>

      <p>
        Vehicle :
        {invoice.vehicleNumber}
      </p>

      <p>
        Total :
        ₹ {invoice.totalAmount}
      </p>

    </div>

  ))
}

</div> {/* admin-bookings */}

</div> {/* admin-container */}

</div> 

)
  }

