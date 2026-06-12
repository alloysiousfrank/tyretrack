import { useEffect, useState } from "react"

import {
 generateInvoicePdf
}
from
"../utils/generateInvoicePdf"


export default function AdminInvoices() {


  const [inventory,setInventory] =
useState<any[]>([])


const [selectedProducts,setSelectedProducts] =
useState<any[]>([])


const [bookingId,setBookingId] =
useState("")

  const [customerName, setCustomerName] =
    useState("")

  const [vehicleNumber, setVehicleNumber] =
    useState("")

  const [vehicleType, setVehicleType] =
    useState("")
const [email, setEmail] =
useState("")

const [phone, setPhone] =
useState("")

const [invoices,
 setInvoices] =
 useState<any[]>([])

  const [
 vehicleHistory,
 setVehicleHistory
] = useState<any[]>([])

const fetchInvoices =
async () => {

 try {
const bookingResponse =
await fetch(
 `https://tyretrack-server.onrender.com/api/bookings/user/${email}`
)

const bookingData =
await bookingResponse.json()

let bookingId = ""

if(
 bookingData.success &&
 bookingData.bookings.length > 0
){

 bookingId =
 bookingData.bookings[0]
 .bookingId

}
  const response =
   await fetch(
    "https://tyretrack-server.onrender.com/api/invoices"
   )

  const data =
   await response.json()

  setInvoices(
   data.invoices
  )

 } catch(error){

  console.log(error)

 }

}

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
const saveInvoice =
async()=>{

 try{

  const response =
  await fetch(

   "https://tyretrack-server.onrender.com/api/invoices",

   {

    method:"POST",

    headers:{
     "Content-Type":
     "application/json"
    },

    body:JSON.stringify({

 bookingId,

 customerName,

 email,

 phone,

 vehicleNumber,

 vehicleType,

 services:selectedServices,

 subtotal,

 gst,

 totalAmount:total

})
    }
  )



  const data =
  await response.json()

 if(data.success){

 alert(
  "Invoice Created ✅"
 )

 fetchInvoices()

 generateInvoicePdf(
  data.invoice
)

}

 }catch(error){

  console.log(error)

 }

}


  return (

    <div className="admin-page">

      <div className="admin-container">

        <h1>Invoice Generator</h1>

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

        <input
  type="text"
  placeholder="Vehicle Number"
  value={vehicleNumber}
  onChange={(e)=>{

    const value =
      e.target.value.toUpperCase()

    setVehicleNumber(value)

    if(value.length >= 5){

      fetchVehicleHistory(
        value
      )

    }

  }}
/>
        {
 vehicleHistory.length > 0 && (

<div
 className="admin-card"
>

<h3>
Previous Vehicle History
</h3>

<p>
Total Visits :
{
 vehicleHistory.length
}
</p>

{
 vehicleHistory.map(
  invoice => (

<div
 key={invoice._id}
>

<p>
Invoice :
{
 invoice.invoiceId
}
</p>

<p>
Services :
{
 invoice.services.join(
  ", "
 )
}
</p>

<hr/>

</div>

))
}

</div>

)
}

        <input
 type="email"
 placeholder="Customer Email"
 value={email}
 onChange={(e)=>
  setEmail(e.target.value)
 }
/>

<input
 type="text"
 placeholder="Customer Phone"
 value={phone}
 onChange={(e)=>
  setPhone(e.target.value)
 }
/>

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
      src="/logo4.png"
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
Date :
{
 new Date()
 .toLocaleDateString()
}

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
      Type :
      {vehicleType}
    </p>

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

          <tr
            key={service}
          >

            <td>
              {service}
            </td>

            <td>
              ₹
              {
                servicePrices[
                  service
                ]
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

</div>

      </div>

    </div>

  )

}