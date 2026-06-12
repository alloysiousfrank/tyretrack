const API =
"https://tyretrack-server.onrender.com/api/invoices"

export const getCustomerInvoices =
async(email:string)=>{

 const response =
 await fetch(

 `${API}/customer/${email}`

 )

 return response.json()

}