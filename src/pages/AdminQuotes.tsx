import { useEffect, useState } from "react"
import QuoteEditor from "../components/quotations/QuoteEditor"
import "./AdminQuotes.css"
interface Quotation {

  _id: string

  quoteId: string

  customerName: string

  phone: string

  vehicleBrand: string

  vehicleModel: string

  vehicleNumber: string

  totalAmount: number

  quoteStatus: string

}

export default function AdminQuotes() {
const [selectedQuote,setSelectedQuote]=useState("")
  const [quotes, setQuotes] = useState<Quotation[]>([])

  useEffect(() => {

    fetchQuotes()

  }, [])

  const fetchQuotes = async () => {

    try {

      const response = await fetch(

        "https://tyretrack-server.onrender.com/api/quotations"

      )

      const data = await response.json()

      if (data.success) {

        setQuotes(data.quotations)

      }

    }

    catch (error) {

      console.log(error)

    }

  }

  return (

<div className="admin-quotes">

    {/* HEADER */}

    <div className="quotes-header">

        <div>

            <h1>

                Quotation Management

            </h1>

            <p>

                Manage customer quotation requests

            </p>

        </div>

    </div>

    {/* STATS */}

    <div className="quote-stats">

        <div className="quote-stat-card">

            <h2>

                {quotes.filter(q=>q.quoteStatus==="Pending").length}

            </h2>

            <span>

                Pending

            </span>

        </div>

        <div className="quote-stat-card">

            <h2>

                {quotes.filter(q=>q.quoteStatus==="Published").length}

            </h2>

            <span>

                Published

            </span>

        </div>

        <div className="quote-stat-card">

            <h2>

                {quotes.filter(q=>q.quoteStatus==="Accepted").length}

            </h2>

            <span>

                Accepted

            </span>

        </div>

        <div className="quote-stat-card">

            <h2>

                ₹{

                quotes.reduce(

                (sum,q)=>

                sum+(q.totalAmount||0),

                0

                ).toLocaleString()

                }

            </h2>

            <span>

                Revenue Potential

            </span>

        </div>

    </div>
<div className="quote-search">

<input

placeholder="Search customer, phone, vehicle..."

/>

</div>
<div className="quotes-table">

<table>

<thead>

<tr>

<th>

Quote ID

</th>

<th>

Customer

</th>

<th>

Vehicle

</th>

<th>

Status

</th>

<th>

Action

</th>

</tr>

</thead>

<tbody>

{

quotes.map((quote)=>(

<tr

key={quote._id}

>

<td>

{quote.quoteId}

</td>

<td>

<div>

<strong>

{quote.customerName}

</strong>

<br/>

{quote.phone}

</div>

</td>

<td>

{quote.vehicleBrand}

{" "}

{quote.vehicleModel}

</td>

<td>

<span

className={`status ${quote.quoteStatus.toLowerCase()}`}

>

{quote.quoteStatus}

</span>

</td>

<td>

<button

onClick={()=>

setSelectedQuote(quote._id)

}

>

Open

</button>

</td>

</tr>

))

}

</tbody>

</table>

</div>
{

selectedQuote && (

<QuoteEditor

quoteId={selectedQuote}

onClose={()=>{

setSelectedQuote("")

fetchQuotes()

}}

 />

)

}
</div>

)
}