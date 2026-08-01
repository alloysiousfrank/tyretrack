import { useEffect, useState } from "react"
import { sendInvoiceWhatsApp } from "../utils/sendInvoiceWhatsApp"

import {
 generateInvoicePdf
}
from
"../utils/generateInvoicePdf"
import "./AdminInvoices.css"
import { sendInvoiceEmail }
from "../utils/sendInvoiceEmail"
import {
useLocation
} from "react-router-dom"
export default function AdminInvoices() {

const [selectedTyreBrand, setSelectedTyreBrand] =
useState("")

const [tyreQuantity, setTyreQuantity] =
useState(1)

const [serviceLines, setServiceLines] =
useState<any[]>([
  {
    serviceName: "",
    quantity: 1,
    amount: 0,
    isCustom: true,
  },
])

const [customerGST, setCustomerGST] =
useState("")

const location = useLocation()

const bookingData =
location.state?.booking || null

const isBookingInvoice =
bookingData !== null

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

const addServiceLine = ()=>{

 setServiceLines([

  ...serviceLines,

  {
   serviceName:"",
   quantity:1,
   amount:0,
   isCustom:true,
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

`/api/bookings/user/${encodeURIComponent(email)}`

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
    "/api/invoices"
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

useEffect(() => {

if(!bookingData){

return

}

setCustomerName(

bookingData.name || ""

)

setPhone(

bookingData.phone || ""

)

setEmail(

bookingData.email || ""

)

setVehicleNumber(

bookingData.vehicleNumber || ""

)

setVehicleType(

bookingData.vehicleType || ""

)

setVehicleKm(

bookingData.vehicleKm || ""

)

setBookingId(

bookingData.bookingId || ""

)

}, [bookingData])

const fetchCustomerHistory =
async (
 customerName:string
)=>{

  const query = customerName.trim()
  if(!query){
    setVehicleHistory([])
    setCustomerProfile(null)
    return
  }

 try{
  setHistoryLoading(true)

  const response =
   await fetch(

`/api/invoices/customer-name/${encodeURIComponent(query)}`

   )

  const data =
   await response.json()

  if (!response.ok) {
    setVehicleHistory([])
    setCustomerProfile(null)
    setHistoryLoading(false)
    return
  }

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

 } catch(error){

  console.log(error)
  setVehicleHistory([])
  setCustomerProfile(null)
 } finally {
  setHistoryLoading(false)
 }

}

useEffect(() => {
  const query = customerName.trim()
  if (query.length >= 2) {
    fetchCustomerHistory(query)
  } else {
    setVehicleHistory([])
    setCustomerProfile(null)
  }
}, [customerName])

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

 serviceLines.forEach(line => {
  const quantity = Number(line.quantity || 0)
  const unitAmount = Number(line.amount || 0)
  amount += quantity * unitAmount
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
 serviceLines,
 includeGST
])


 const toggleService =
(service:string)=>{

 let updated = [...selectedServices]
 let updatedLines = [...serviceLines]

 if(
  updated.includes(service)
 ){

  updated =
   updated.filter(
    s => s !== service
   )

  updatedLines =
   updatedLines.filter(
    line =>
     !(line.serviceName === service && !line.isCustom)
   )

 }else{

  updated.push(service)

  const lineAmount =
    service === "Multi Branded Tyres"
      ? Number(
          tyreBrands.find(
            tyre => tyre.brand === selectedTyreBrand
          )?.sellingPrice || 0
        )
      : Number(servicePrices[service] || 0)

  updatedLines.push({
   serviceName: service,
   quantity: service === "Multi Branded Tyres" ? tyreQuantity : 1,
   amount: lineAmount,
   total:
     (service === "Multi Branded Tyres" ? tyreQuantity : 1) * lineAmount,
   isCustom: false,
  })

 }

 setSelectedServices(updated)
 setServiceLines(updatedLines)

}
 useEffect(() => {

 fetchInvoices()

}, [])

const updateServiceLine = (

 index:number,

 field:string,

 value:any

)=>{

 const updated =
 [...serviceLines]

 updated[index] = {

  ...updated[index],
  [field]: value,
  total:
    field === "quantity" || field === "amount"
      ? Number(updated[index].quantity || 0) * Number(updated[index].amount || 0)
      : Number(updated[index].total || 0),
 }

 if (field === "quantity" || field === "amount") {
  updated[index] = {
    ...updated[index],
    quantity: Number(field === "quantity" ? value : updated[index].quantity || 0),
    amount: Number(field === "amount" ? value : updated[index].amount || 0),
    total:
      Number(field === "quantity" ? value : updated[index].quantity || 0) *
      Number(field === "amount" ? value : updated[index].amount || 0),
  }
 }

 setServiceLines(
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
 "/api/invoices",
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
   customerGST,
   services:selectedServices,
   serviceLines:
   serviceLines.filter(
    (line) =>
      line.serviceName.trim() !== ""
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



} catch(error){

   console.log(error)

}

}   // <-- saveInvoice ends here

const publishInvoice = async (id: string) => {

  try {

    const response = await fetch(

      `/api/invoices/publish/${id}`,

      {

        method: "PUT"

      }

    )

    if (!response.ok) {

      throw new Error("Publish failed")

    }

    const data = await response.json()

    if (data.success) {

      const publishedInvoice = invoices.find(

        (inv: any) => inv._id === id

      )

      if (publishedInvoice) {

        const pdfBlob =

          await generateInvoicePdf(

            publishedInvoice

          )

        const emailResult =

          await sendInvoiceEmail(

            publishedInvoice,

            pdfBlob

          )

        console.log(emailResult)

        const whatsappResult =
  await sendInvoiceWhatsApp(
    publishedInvoice,
    pdfBlob
  )

console.log(whatsappResult)

      }

      alert(

        "Invoice Published & Email Sent ✅"

      )

      fetchInvoices()

    }

  }

  catch (error) {

    console.log(error)

    alert("Publish Failed")

  }

}

  return (

    <div className="admin-page">

      <div className="admin-container">
<div className="invoice-mode">

{

isBookingInvoice ?

<span className="booking-mode">

🚗 Booking Invoice

</span>

:

<span className="manual-mode">

📝 Manual Invoice

</span>

}

</div>

<h1>

Generate Invoice

</h1>
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
          onChange={(e)=>{
            setCustomerName(e.target.value)
          }}
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
Customer GST Number
</label>
<input
 type="text"
 placeholder="Customer GST Number"
 value={customerGST}
 onChange={(e)=>
  setCustomerGST(e.target.value)
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
Vehicle Brand &amp; Model
</label>
        <input
  type="text"
  placeholder="e.g. Honda City, Maruti Swift"
  value={vehicleType}
  onChange={(e)=>
    setVehicleType(
      e.target.value
    )
  }
 />

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


</div>
</div>
</div>
<div
 className="history-invoices"
>
{
 customerName.trim().length >= 2 && (

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
vehicleHistory.length === 0 ? (
  <p>No service visits found for this customer.</p>
) : vehicleHistory.map(
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
invoice.serviceLines?.map(
(line:any,index:number)=>(
<p key={index}>
➕ {line.serviceName}
 ×
 {line.quantity}
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
invoice.serviceLines?.filter(
 (line:any) => line.isCustom
).length > 0 && (

<p>

➕ Extra Services :

{
invoice.serviceLines
.filter((line:any) => line.isCustom)
.map(
(line:any)=>
line.serviceName
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
Service Lines
</h3>

{
serviceLines.map(
 (line,index)=>(

  <div
   key={index}
   className="admin-card"
  >

   <input
    placeholder="Service Name"
    value={line.serviceName}
    onChange={(e)=>
     updateServiceLine(
      index,
      "serviceName",
      e.target.value
     )
    }
   />

   <input
    type="number"
    placeholder="Qty"
    min={1}
    value={line.quantity}
    onChange={(e)=>
     updateServiceLine(
      index,
      "quantity",
      Number(e.target.value)
     )
    }
   />

   <input
    type="number"
    placeholder="Amount"
    min={0}
    value={line.amount}
    onChange={(e)=>
     updateServiceLine(
      index,
      "amount",
      Number(e.target.value)
     )
    }
   />

   <input
    type="number"
    placeholder="Total"
    value={line.total}
    disabled
   />

  </div>

 ))
}





<button
 className="update-btn"
 onClick={
  addServiceLine
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
      Vehicle Brand &amp; Model :
      {vehicleType}
    </p>

    <p>
      GST Number :
      {customerGST || "-"}
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

   <th>Amount</th>

  </tr>

 </thead>

 <tbody>

  {
   serviceLines
     .filter((line) => line.serviceName.trim() !== "")
     .map((line,index) => (

     <tr key={index}>

      <td>
       {line.serviceName}
      </td>

      <td>
       ₹{Number(line.total || 0)}
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

