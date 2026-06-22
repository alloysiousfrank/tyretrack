import { useEffect,useState }
from "react"

import {
 generateInvoicePdf
}
from "../utils/generateInvoicePdf"

export default function CustomerInvoices(){

 const [invoices,setInvoices] =
 useState<any[]>([])

 const [selectedInvoice,
 setSelectedInvoice] =
 useState<any>(null)

 const user =
 JSON.parse(
  localStorage.getItem("user")
  || "{}"
 )

 useEffect(()=>{

  const loadInvoices =
  async()=>{

   try{

    const response =
    await fetch(

`https://tyretrack-server.onrender.com/api/invoices/customer/${user.email}`

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

  if(user.email){

   loadInvoices()

  }

 },[])

 return (

 <>
 <div className="customer-invoices">

<h2>
📄 My Invoices
</h2>

{
invoices.map(invoice=>(

<div
key={invoice._id}
className="invoice-card"
>

<h3>
{invoice.invoiceId}
</h3>

<p>
₹ {invoice.totalAmount}
</p>

<p>
{
new Date(
 invoice.createdAt
).toLocaleDateString()
}
</p>

<button
onClick={()=>
 setSelectedInvoice(invoice)
}
>

👁 View

</button>

<button
onClick={()=>
 generateInvoicePdf(invoice)
}
>

⬇ Download

</button>

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
{selectedInvoice.invoiceId}
</h2>

<p>
Customer :
{selectedInvoice.customerName}
</p>

<p>
Phone :
{selectedInvoice.phone}
</p>

<p>
Vehicle :
{selectedInvoice.vehicleNumber}
</p>

<p>
Total :
₹ {selectedInvoice.totalAmount}
</p>

<button
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
 </>
 )

}