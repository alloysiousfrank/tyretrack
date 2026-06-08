import {
  useEffect,
  useState,
} from "react"

import "./AdminCustomers.css"

export default function AdminCustomers() {

  const [customers,
    setCustomers] =
    useState<any[]>([])

  const [search,
    setSearch] =
    useState("")

  useEffect(() => {

    fetchCustomers()

  }, [])

  const fetchCustomers =
    async () => {

      try {

        const response =
          await fetch(
            "https://tyretrack-server.onrender.com/api/admin/customers"
          )

        const data =
          await response.json()

        setCustomers(
          data.customers
        )

      } catch (error) {

        console.log(error)

      }

    }

  const filteredCustomers =
    customers.filter(
      (customer) =>

        customer.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )

        ||

        customer.email
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    )

  return (

    <div className="admin-page">

      <div className="admin-container">

        <h1>
          Customer Management
        </h1>

        <input
          type="text"
          placeholder="Search Customer..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="customer-search"
        />

        <div className="admin-bookings">

          {
            filteredCustomers.map(
              (customer) => (

                <div
                  key={customer._id}
                  className="admin-card"
                >

                  <h2>
                    {customer.name}
                  </h2>

                  <p>
                    <strong>
                      Email:
                    </strong>

                    {customer.email}
                  </p>

                  <p>
                    <strong>
                      Phone:
                    </strong>

                    {customer.phone}
                  </p>

                  <p>
                    <strong>
                      Joined:
                    </strong>

                    {
                      new Date(
                        customer.joinedDate
                      )
                        .toLocaleDateString()
                    }
                  </p>

                  <p>
                    <strong>
                      Total Bookings:
                    </strong>

                    {
                      customer.totalBookings
                    }
                  </p>

                  <p>
                    <strong>
                      Last Booking:
                    </strong>

                    {
                      customer.lastBooking
                    }
                  </p>

                </div>

              )
            )
          }

        </div>

      </div>

    </div>

  )

}