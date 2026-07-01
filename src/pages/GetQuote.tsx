import { useState } from "react"
import "./GetQuote.css"

export default function GetQuote() {

  const [customerName, setCustomerName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")

  const [vehicleNumber, setVehicleNumber] = useState("")
  const [vehicleType, setVehicleType] = useState("")
  const [vehicleBrand, setVehicleBrand] = useState("")
  const [vehicleModel, setVehicleModel] = useState("")

  const [tyreSize, setTyreSize] = useState("")
  const [preferredBrand, setPreferredBrand] = useState("")
  const [notes, setNotes] = useState("")

  return (

    <section className="quote-page">

      <div className="quote-overlay"></div>

      <div className="quote-container">

        {/* HERO */}

        <section className="quote-hero">

          <p className="quote-tag">
            TYRETRACK PREMIUM AUTO CARE
          </p>

          <h1>
            Get Your Premium Tyre Quotation
          </h1>

          <p className="quote-description">

            Tell us about your vehicle and our experts
            will prepare a personalised quotation with
            the best tyres and services.

          </p>

        </section>

        {/* CUSTOMER DETAILS */}

        <section className="quote-card">

          <h2>

            👤 Customer Information

          </h2>

          <div className="quote-grid">

            <input

              placeholder="Customer Name"

              value={customerName}

              onChange={(e)=>setCustomerName(e.target.value)}

            />

            <input

              placeholder="Phone Number"

              value={phone}

              onChange={(e)=>setPhone(e.target.value)}

            />

            <input

              placeholder="Email Address"

              value={email}

              onChange={(e)=>setEmail(e.target.value)}

            />

            <input

              placeholder="Vehicle Number"

              value={vehicleNumber}

              onChange={(e)=>

                setVehicleNumber(

                  e.target.value.toUpperCase()

                )

              }

            />

          </div>

        </section>

        {/* VEHICLE DETAILS */}

        <section className="quote-card">

          <h2>

            🚗 Vehicle Details

          </h2>

          <div className="quote-grid">

            <select

              value={vehicleType}

              onChange={(e)=>

                setVehicleType(e.target.value)

              }

            >

              <option value="">

                Vehicle Type

              </option>

              <option>

                Car

              </option>

              <option>

                Bike

              </option>

            </select>

            <input

              placeholder="Vehicle Brand"

              value={vehicleBrand}

              onChange={(e)=>

                setVehicleBrand(e.target.value)

              }

            />

            <input

              placeholder="Vehicle Model"

              value={vehicleModel}

              onChange={(e)=>

                setVehicleModel(e.target.value)

              }

            />

            <input

              placeholder="Tyre Size"

              value={tyreSize}

              onChange={(e)=>

                setTyreSize(e.target.value)

              }

            />

          </div>

        </section>

        {/* TYRE DETAILS */}

        <section className="quote-card">

          <h2>

            🛞 Tyre Requirement

          </h2>

          <div className="quote-grid">

            <input

              placeholder="Preferred Brand"

              value={preferredBrand}

              onChange={(e)=>

                setPreferredBrand(e.target.value)

              }

            />

          </div>

          <textarea

            rows={6}

            placeholder="Additional Requirements"

            value={notes}

            onChange={(e)=>

              setNotes(e.target.value)

            }

          />

        </section>

        {/* SUBMIT */}

        <section className="quote-submit">

          <button>

            Request Premium Quotation

          </button>

        </section>

      </div>

    </section>

  )

}