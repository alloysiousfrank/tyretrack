import { useEffect, useState } from "react"

export default function AdminInvoices() {

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

  

const fetchInvoices =
async () => {

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

 } catch(error){

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

 customerName,

 email,

 phone,

 vehicleNumber,

 vehicleType,

 services:
 selectedServices,

 subtotal,

 gst,

 totalAmount:
 total

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
          onChange={(e)=>
            setVehicleNumber(
              e.target.value
            )
          }
        />

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

<h2
  style={{
    marginTop: "40px",
  }}
>
  Generated Invoices
</h2>

<div className="admin-bookings">

{
  invoices.map((invoice) => (

    <div
      key={invoice._id}
      className="admin-card"
    >

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