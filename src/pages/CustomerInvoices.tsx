import { useEffect,useState }
from "react"

import {
 generateInvoicePdf
}
from "../utils/generateInvoicePdf"

import "./CustomerInvoices.css"

export default function CustomerInvoices(){

const [invoices,setInvoices] =
useState<any[]>([])

const [selectedInvoice,
setSelectedInvoice] =
useState<any>(null)

const [search,
setSearch] =
useState("")

const userEmail =
localStorage.getItem(
 "userEmail"
)

useEffect(()=>{

 fetchInvoices()

},[])

const fetchInvoices =
async()=>{

 try{

const response =
await fetch(

`https://tyretrack-server.onrender.com/api/invoices/customer/${userEmail}`

)

const data =
await response.json()

if(data.success){

 setInvoices(
  data.invoices
 )

}

 }catch(error){

  console.log(error)

 }

}

const totalSpent =
invoices.reduce(

(sum,invoice)=>

sum +
Number(
 invoice.totalAmount || 0
),

0

)

return(

<div className="customer-invoice-page">

<h1>
📄 My Service History
</h1>

<div className="customer-history-stats">

<div className="history-box">

<h4>
Total Visits
</h4>

<h2>
{
 invoices.length
}
</h2>

</div>

<div className="history-box">

<h4>
Total Spent
</h4>

<h2>
₹
{
 totalSpent.toLocaleString()
}
</h2>

</div>

<div className="history-box">

<h4>
Latest Invoice
</h4>

<h2>

{
 invoices[0]?.invoiceId ||
 "-"
}

</h2>

</div>

</div>

<input

className="invoice-search"

placeholder=
"Search Invoice Number..."

value={search}

onChange={(e)=>
setSearch(
 e.target.value
)
}

/>

<div className="invoice-history-grid">

{
invoices

.filter(invoice=>

invoice.invoiceId
.toLowerCase()
.includes(
 search.toLowerCase()
)

)

.map(invoice=>(

<div
key={invoice._id}
className="invoice-history-card"
>

<h3>
{invoice.invoiceId}
</h3>

<p>

Vehicle :

{
invoice.vehicleNumber
}

</p>

<p>

Amount :

₹
{
invoice.totalAmount
}

</p>

<p>

Date :

{
new Date(
 invoice.createdAt
)
.toLocaleDateString()
}

</p>

<div
className="invoice-actions"
>

<button

className="view-btn"

onClick={()=>
setSelectedInvoice(
 invoice
)
}

>

👁 View

</button>

<button

className="download-btn"

onClick={()=>
generateInvoicePdf(
 invoice
)
}

>

⬇ Download

</button>

</div>

</div>

))
}

</div>

{
selectedInvoice && (

<div className="invoice-modal">

<div
className="invoice-modal-content"
>

<h2>
{
selectedInvoice.invoiceId
}
</h2>

<p>

Customer :

{
selectedInvoice.customerName
}

</p>

<p>

Vehicle :

{
selectedInvoice.vehicleNumber
}

</p>

<p>

Phone :

{
selectedInvoice.phone
}

</p>

<p>

Amount :

₹
{
selectedInvoice.totalAmount
}

</p>

<p>

Services :

{
selectedInvoice.services?.join(
 ", "
)
}

</p>

<button

className="close-btn"

onClick={()=>
setSelectedInvoice(null)
}

>

Close

</button>

</div>

</div>

)

}

</div>

)

}