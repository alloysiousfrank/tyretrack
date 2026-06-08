import { useEffect, useState } from "react"

export default function AdminCustomers() {

  const [customers, setCustomers] =
    useState<any[]>([])

  useEffect(() => {

    fetchCustomers()

  }, [])

  const fetchCustomers = async () => {

    const response = await fetch(
      "https://tyretrack-server.onrender.com/api/admin/customers"
    )

    const data = await response.json()

    setCustomers(data.customers)

  }

  return (

    <div className="admin-page">

      <h1>Customers</h1>

      {customers.map((customer) => (

        <div
          key={customer._id}
          className="admin-card"
        >

          <h3>{customer.name}</h3>

          <p>{customer.email}</p>

          <p>{customer.phone}</p>

        </div>

      ))}

    </div>

  )

}