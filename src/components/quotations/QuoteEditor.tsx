import { useEffect, useState } from "react"
import "./QuoteEditor.css"

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

{/* PRICING */}

<section className="editor-card">

<h2>

Pricing

</h2>

<div className="editor-grid">

<input
type="number"
value={tyrePrice}
onChange={(e)=>
setTyrePrice(Number(e.target.value))
}
/>

<input
type="number"
value={tyreQuantity}
onChange={(e)=>
setTyreQuantity(Number(e.target.value))
}
/>

<input
type="number"
value={labourCharge}
onChange={(e)=>
setLabourCharge(Number(e.target.value))
}
/>

<input
type="number"
value={accessoriesCharge}
onChange={(e)=>
setAccessoriesCharge(Number(e.target.value))
}
/>

<input
type="number"
value={discount}
onChange={(e)=>
setDiscount(Number(e.target.value))
}
/>

</div>
<div className="gst-row">

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
<textarea

rows={5}

value={adminRemarks}

onChange={(e)=>

setAdminRemarks(e.target.value)

}

placeholder="Admin Remarks"

/>

</section>
<div className="summary-card">

<h2>

Quotation Summary

</h2>

<div className="summary-row">

<span>

Subtotal

</span>

<strong>

₹{subtotal.toFixed(2)}

</strong>

</div>

<div className="summary-row">

<span>

GST

</span>

<strong>

₹{gst.toFixed(2)}

</strong>

</div>

<div className="summary-row total">

<span>

Total

</span>

<strong>

₹{total.toFixed(2)}

</strong>

</div>

</div>
<div className="editor-actions">

<button className="draft">

Save Draft

</button>

<button className="pdf">

Generate PDF

</button>

<button className="publish">

Publish Quote

</button>

</div>

</div>

</div>

)

}