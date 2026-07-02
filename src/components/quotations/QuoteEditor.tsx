import { useEffect, useState } from "react"
import "./QuoteEditor.css"
// Dynamic import for generateQuotePDF so missing file doesn't break build.
const generateQuotePDF = async (payload: any) => {
  try {
    const mod = await import("./utils/generateQuotePDF")
    return mod.generateQuotePDF(payload)
  } catch (e) {
    console.warn("generateQuotePDF module not available:", e)
    return
  }
}

interface Quote {

  _id: string

  quoteId: string

  customerName: string

  phone: string

  email: string

  vehicleType: string

  vehicleBrand: string

  vehicleModel: string

  vehicleNumber: string

  tyreSize: string

  preferredBrand: string

  notes: string

  tyrePrice: number

  tyreQuantity: number

  labourCharge: number

  accessoriesCharge: number

  discount: number

  includeGST: boolean

  gst: number

  subtotal: number

  totalAmount: number

  adminRemarks: string

}

interface Props{

    quoteId:string

    onClose:()=>void

}

export default function QuoteEditor({

quoteId,

onClose

}:Props){

const [quote,setQuote]=useState<Quote | null>(null)
const [tyrePrice, setTyrePrice] = useState(0)
const [tyreQuantity, setTyreQuantity] = useState(1)
const [labourCharge, setLabourCharge] = useState(0)
const [accessoriesCharge, setAccessoriesCharge] = useState(0)
const [discount, setDiscount] = useState(0)
const [includeGST, setIncludeGST] = useState(true)
const [adminRemarks, setAdminRemarks] = useState("")
const [loading,setLoading]=useState(true)

useEffect(()=>{

loadQuote()

},[])

const loadQuote=async()=>{

try{

const response=await fetch(

`https://tyretrack-server.onrender.com/api/quotations/${quoteId}`

)

const data=await response.json()

if(data.success){

setQuote(data.quotation)
setTyrePrice(data.quotation.tyrePrice || 0)
setTyreQuantity(data.quotation.tyreQuantity || 1)
setLabourCharge(data.quotation.labourCharge || 0)
setAccessoriesCharge(data.quotation.accessoriesCharge || 0)
setDiscount(data.quotation.discount || 0)
setIncludeGST(data.quotation.includeGST)
setAdminRemarks(data.quotation.adminRemarks || "")
}

}catch(error){

console.log(error)

}

finally{

setLoading(false)

}

}

if(loading){

return(

<div className="editor-loading">

Loading...

</div>

)

}

if(!quote){

return(

<div className="editor-loading">

Quotation Not Found

</div>

)

}
const subtotal =
(
tyrePrice * tyreQuantity
)
+
labourCharge
+
accessoriesCharge
-
discount

const gst =
includeGST
? subtotal * 0.18
: 0

const total =
subtotal + gst

const saveDraft = async () => {

try{

const response=await fetch(

`https://tyretrack-server.onrender.com/api/quotations/${quoteId}`,

{

method:"PUT",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

tyrePrice,

tyreQuantity,

labourCharge,

accessoriesCharge,

discount,

includeGST,

adminRemarks

})

}

)

const data=await response.json()

if(data.success){

alert("Quotation Draft Saved Successfully ✅")

setQuote(data.quotation)
loadQuote()
}else{

alert(data.message)

}

}catch(error){

console.log(error)

}

}

const handleGeneratePDF = async () => {

if(!quote){

return

}

await generateQuotePDF({

quoteNumber:quote.quoteId,

customerName:quote.customerName,

phone:quote.phone,

email:quote.email,

vehicleNumber:quote.vehicleNumber,

vehicleType:quote.vehicleType,

vehicleBrand:quote.vehicleBrand,

vehicleModel:quote.vehicleModel,

tyreSize:quote.tyreSize,

preferredBrand:quote.preferredBrand,

notes:quote.notes,

validTill:new Date(

Date.now()+30*24*60*60*1000

).toLocaleDateString(),

subtotal,

gst,

total,

items:[

{

description:`${quote.preferredBrand} Tyre`,

quantity:tyreQuantity,

rate:tyrePrice,

total:tyrePrice*tyreQuantity

},

{

description:"Labour",

quantity:1,

rate:labourCharge,

total:labourCharge

},

{

description:"Accessories",

quantity:1,

rate:accessoriesCharge,

total:accessoriesCharge

}

]

})

}

const publishQuote = async()=>{

try{

const token=

localStorage.getItem("adminToken")

const response=await fetch(

`https://tyretrack-server.onrender.com/api/quotations/publish/${quoteId}`,

{

method:"PUT",

headers:{

Authorization:`Bearer ${token}`

}

}

)

const data=

await response.json()

if(data.success){

alert(

"Quotation Published Successfully ✅"

)

loadQuote()

}else{

alert(data.message)

}

}catch(error){

console.log(error)

alert(

"Unable to publish quotation."

)

}

}

return(

<div className="editor-overlay">

<div className="editor-container">

<div className="editor-header">

<h1>

Quotation Editor

</h1>

<button

onClick={onClose}

>

✕

</button>

</div>

{/* CUSTOMER */}

<section className="editor-card">

<h2>

Customer Information

</h2>

<div className="editor-grid">

<input

value={quote.customerName}

readOnly

/>

<input

value={quote.phone}

readOnly

/>

<input

value={quote.email}

readOnly

/>

</div>

</section>

{/* VEHICLE */}

<section className="editor-card">

<h2>

Vehicle Information

</h2>

<div className="editor-grid">

<input

value={quote.vehicleType}

readOnly

/>

<input

value={quote.vehicleBrand}

readOnly

/>

<input

value={quote.vehicleModel}

readOnly

/>

<input

value={quote.vehicleNumber}

readOnly

/>

<input

value={quote.tyreSize}

readOnly

/>

<input

value={quote.preferredBrand}

readOnly

/>

</div>

</section>


{/* ============================
        PRICING
============================ */}

<section className="pricing-section">

<div className="section-title">

<div>

<h2>Pricing Details</h2>

<p>
Enter the quotation pricing below.
</p>

</div>

</div>

<div className="pricing-grid">

<div className="pricing-card">

<label>🛞 Tyre Price (₹ / Per Tyre)</label>

<small>
Price of one tyre.
</small>

<input
type="number"
value={tyrePrice}
onChange={(e)=>
setTyrePrice(Number(e.target.value))
}
placeholder="Example : 3500"
/>

</div>

<div className="pricing-card">

<label>📦 Tyre Quantity</label>

<small>
Number of tyres.
</small>

<input
type="number"
value={tyreQuantity}
onChange={(e)=>
setTyreQuantity(Number(e.target.value))
}
placeholder="Example : 4"
/>

</div>

<div className="pricing-card">

<label>🔧 Labour Charge (₹)</label>

<small>
Wheel fitting, balancing, alignment etc.
</small>

<input
type="number"
value={labourCharge}
onChange={(e)=>
setLabourCharge(Number(e.target.value))
}
placeholder="Example : 600"
/>

</div>

<div className="pricing-card">

<label>🧰 Accessories Charge (₹)</label>

<small>
Valve, Nitrogen, Wheel weights etc.
</small>

<input
type="number"
value={accessoriesCharge}
onChange={(e)=>
setAccessoriesCharge(Number(e.target.value))
}
placeholder="Example : 250"
/>

</div>

<div className="pricing-card">

<label>🏷 Discount (₹)</label>

<small>
Optional customer discount.
</small>

<input
type="number"
value={discount}
onChange={(e)=>
setDiscount(Number(e.target.value))
}
placeholder="Example : 500"
/>

</div>

</div>

<div className="gst-box">

<label>

<input
type="checkbox"
checked={includeGST}
onChange={(e)=>
setIncludeGST(e.target.checked)
}
/>

Include GST (18%)

</label>

</div>

</section>
<div className="editor-actions">

<button

className="draft"

onClick={saveDraft}

>

Save Draft

</button>

<button
className="pdf"
onClick={handleGeneratePDF}
>

Generate PDF

</button>

<button
className="publish"
onClick={publishQuote}
>

Publish Quote

</button>

</div>

</div>

</div>

)

}