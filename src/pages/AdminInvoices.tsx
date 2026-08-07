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
useNavigate,
useLocation
} from "react-router-dom"
export default function AdminInvoices() {


const [selectedTyreBrand,setSelectedTyreBrand] =
useState("")

const [tyreQuantity,setTyreQuantity] =
useState(1)

const [tyreAmount,setTyreAmount] =
useState(0)

const [customServices,setCustomServices] =
useState<any[]>([

 {
  serviceName:"",
  quantity:1,
  amount:0
 }

])

const navigate = useNavigate()

const location = useLocation()

const bookingData =
location.state?.booking || null

const isBookingInvoice =
bookingData !== null

const [bookingId,setBookingId] =
useState("")

  const [customerName, setCustomerName] =
    useState("")

  const [nameSuggestions, setNameSuggestions] =
    useState<{customerName:string, phone:string}[]>([])

  const [showSuggestions, setShowSuggestions] =
    useState(false)

  const [customerAddress, setCustomerAddress] =
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

const [customerGST, setCustomerGST] =
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

// NOTE: this now looks a customer up by NAME instead of by vehicle
// number, so it surfaces every vehicle that customer has ever brought
// in — not just invoices tied to one specific plate. This needs a
// matching backend route: GET /api/invoices/customer-name/:name
// (case-insensitive match on customerName). If your backend doesn't
// have that route yet, tell me its invoices-route file and I'll add it.
const fetchNameSuggestions =
async (
 query:string
)=>{

 try{

  const response =
   await fetch(

`https://tyretrack-server.onrender.com/api/invoices/customer-name-suggestions/${encodeURIComponent(query)}`

   )

  const data =
   await response.json()

  if(data.success){
   setNameSuggestions(data.customers)
  }

 }catch(error){

  console.log(error)

 }

}

const fetchCustomerHistory =
async (
 name:string
)=>{

 try{

  const response =
   await fetch(

`https://tyretrack-server.onrender.com/api/invoices/customer-name/${encodeURIComponent(name)}`

   )

  const data =
   await response.json()

  if(data.success){

   setVehicleHistory(
    data.invoices
   )
   setShowHistory(data.invoices.length > 0)
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

} else {
  setCustomerProfile(null)
  setShowHistory(false)
}
  } else {
    setVehicleHistory([])
    setCustomerProfile(null)
    setShowHistory(false)
  }

 }catch(error){

  console.log(error)

 }

}




// Just the list of service names now — no hardcoded prices. The admin
// types the real amount (and quantity) for whichever services they pick,
// in the box that opens up next to each one.
const STANDARD_SERVICES = [
 "Wheel Alignment",
 "Wheel Balancing",
 "Foam Wash",
 "Automatic Car Spa",
 "Multi Branded Tyres",
 "Interior Cleaning",
 "Teflon Coating",
 "Ceramic Coating",
 "General Service",
 "Accessories",
]

const [selectedServices,
 setSelectedServices] =
 useState<string[]>([])

// Per-service admin-entered quantity & amount (keyed by service name).
// "Multi Branded Tyres" is excluded — that one keeps its own
// brand/stock/quantity box further down.
const [serviceDetails, setServiceDetails] =
useState<Record<string, { quantity: number; amount: number }>>({})

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

   amount +=
   tyreAmount *
   tyreQuantity

  }else{

   const detail =
   serviceDetails[service]

   amount +=
   Number(detail?.amount || 0) *
   Number(detail?.quantity || 1)

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
 serviceDetails,
 customServices,
 tyreQuantity,
 tyreAmount,
 selectedTyreBrand,
 tyreBrands,
  applyGST,
   includeGST
])


 const toggleService =
(service:string)=>{

 setSelectedServices(prev=>{

  const isSelected =
   prev.includes(service)

  if(isSelected){

   // Deselecting — drop its qty/amount box along with it.
   setServiceDetails(prevDetails=>{

    const updatedDetails =
     {...prevDetails}

    delete updatedDetails[service]

    return updatedDetails

   })

   return prev.filter(
    s => s !== service
   )

  }

  // Selecting — open its qty/amount box with sane starting
  // values (Multi Branded Tyres keeps its own separate box).
  if(service !== "Multi Branded Tyres"){

   setServiceDetails(prevDetails=>({

    ...prevDetails,

    [service]:
     prevDetails[service] ||
     { quantity:1, amount:0 }

   }))

  }

  return [...prev, service]

 })

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

}

// Every standard service the admin ticked (other than the tyre one,
// which already has its own brand/qty box) carries its own admin-typed
// quantity & amount now — fold those into customServices so the PDF
// and backend only ever need to read one line-items array.
const standardServiceLineItems =
selectedServices
 .filter(
  service =>
  service !== "Multi Branded Tyres"
 )
 .map(service => ({
  serviceName: service,
  quantity:
   serviceDetails[service]?.quantity || 1,
  amount:
   serviceDetails[service]?.amount || 0,
 }))

const tyreLineItems =
 selectedServices.includes(
  "Multi Branded Tyres"
 ) && selectedTyreBrand
   ? [{
       serviceName: `${selectedTyreBrand} Tyres`,
       quantity: tyreQuantity,
       amount: tyreAmount,
     }]
   : []

const combinedCustomServices = [
 ...standardServiceLineItems,
 ...tyreLineItems,
 ...customServices.filter(
  service =>
  service.serviceName.trim() !== ""
 ),
]

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
   customerGST,
   customerAddress,
   services:selectedServices,
   customServices:
   combinedCustomServices,
   tyreBrand:selectedTyreBrand,
   tyreQuantity,
   tyrePrice:tyreAmount,
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

      `https://tyretrack-server.onrender.com/api/invoices/publish/${id}`,

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

<div className="form-group" style={{position:"relative"}}>

<label>
Customer Name
</label>
        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e)=>{

            const value =
              e.target.value

            setCustomerName(value)

            if(value.trim().length >= 3){

              fetchNameSuggestions(
                value.trim()
              )
              setShowSuggestions(true)

              fetchCustomerHistory(
                value.trim()
              )
              setShowHistory(true)

            } else {

              setNameSuggestions([])
              setShowSuggestions(false)
              setVehicleHistory([])
              setCustomerProfile(null)
              setShowHistory(false)

            }

          }}
          onFocus={()=>{
            if(nameSuggestions.length > 0){
              setShowSuggestions(true)
            }
          }}
          onBlur={()=>{
            setTimeout(()=>setShowSuggestions(false), 150)
          }}
        />

{
showSuggestions &&
nameSuggestions.length > 0 && (

<div className="name-suggestions-dropdown">

{
nameSuggestions.map((customer,index)=>(

<div
 key={index}
 className="name-suggestion-item"
 onMouseDown={()=>{

  setCustomerName(customer.customerName)
  setShowSuggestions(false)

  fetchCustomerHistory(
    customer.customerName
  )
  setShowHistory(true)

 }}
>

<span className="name-suggestion-name">
{customer.customerName}
</span>

<span className="name-suggestion-phone">
{customer.phone}
</span>

</div>

))
}

</div>

)
}

</div>

<div className="form-group">

<label>
Customer Address
</label>
<input
  type="text"
  placeholder="Customer Address"
  value={customerAddress}
  onChange={(e)=>
    setCustomerAddress(
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

<div className="form-group">

<label>
Customer GST Number
</label>
        <input
  type="text"
  placeholder="Customer GST Number (Optional)"
  value={customerGST}
  onChange={(e)=>
    setCustomerGST(
      e.target.value.toUpperCase()
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
Customer Service History
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
 showHistory && (
 vehicleHistory.length > 0 ? (

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
Grand Total :
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

) : (
  <div className="admin-card">
    <p>No customer history found for this name yet.</p>
  </div>
)
      )
    }
  </div>

       <h3>Select Services</h3>


       <div className="service-list">

{

STANDARD_SERVICES.map(service=>(

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

{
/* Ticking any service (other than the tyre one, which has its
   own box below) opens a Qty + Amount box right here — same
   admin-card layout as Custom Services — so the admin types in
   the real price instead of a hardcoded one. */
}
{
selectedServices.includes(service) &&
service !== "Multi Branded Tyres" && (

<div className="admin-card">

<div className="form-group">
<label>Quantity</label>
<input
 type="number"
 min="1"
 placeholder="Enter Quantity"
 value={
  serviceDetails[service]?.quantity ?? 1
 }
 onChange={(e)=>
  setServiceDetails(prev=>({
   ...prev,
   [service]:{
    quantity: Number(e.target.value),
    amount: prev[service]?.amount ?? 0,
   }
  }))
 }
/>
</div>

<div className="form-group">
<label>Amount (₹)</label>
<input
 type="number"
 min="0"
 placeholder="Enter Amount"
 value={
  serviceDetails[service]?.amount ?? 0
 }
 onChange={(e)=>
  setServiceDetails(prev=>({
   ...prev,
   [service]:{
    quantity: prev[service]?.quantity ?? 1,
    amount: Number(e.target.value),
   }
  }))
 }
/>
</div>

</div>

)
}

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

<div className="form-group">
<label>Amount (₹)</label>
<input
 type="number"
 min="0"
 placeholder="Enter Amount"
 value={tyreAmount}
 onChange={(e)=>
  setTyreAmount(
   Number(e.target.value)
  )
 }
/>
</div>

<div className="form-group">
<label>Quantity</label>
<input
 type="number"
 min="1"
 placeholder="Enter Quantity"
 value={tyreQuantity}
 onChange={(e)=>
  setTyreQuantity(
   Number(e.target.value)
  )
 }
/>
</div>

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

   <div className="form-group">
   <label>Service Name</label>
   <input
    placeholder="Enter Service Name"
    value={service.serviceName}
    onChange={(e)=>
     updateCustomService(
      index,
      "serviceName",
      e.target.value
     )
    }
   />
   </div>

   <div className="form-group">
   <label>Quantity</label>
   <input
    type="number"
    placeholder="Enter Quantity"
    value={service.quantity}
    onChange={(e)=>
     updateCustomService(
      index,
      "quantity",
      Number(e.target.value)
     )
    }
   />
   </div>

   <div className="form-group">
   <label>Amount (₹)</label>
   <input
    type="number"
    placeholder="Enter Amount"
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
    Grand Total : ₹ {total}
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
 {customerGST || "—"}
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

      <td>
         {service}
         {
          service !== "Multi Branded Tyres" && (
           <>
            &times; {serviceDetails[service]?.quantity ?? 1}
            {' '}
            @ Rs {Number(serviceDetails[service]?.amount || 0)}
           </>
          )
         }
      </td>

     <td>
 ₹{
 service === "Multi Branded Tyres"
 ?
 (
  Number(tyreAmount || 0) *
  Number(tyreQuantity || 1)
 )
 :
 (
  Number(serviceDetails[service]?.amount || 0) *
  Number(serviceDetails[service]?.quantity || 1)
 )
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
       × {service.quantity} @ Rs {Number(service.amount || 0)}
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
  Grand Total :
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

</div> 
  )
}