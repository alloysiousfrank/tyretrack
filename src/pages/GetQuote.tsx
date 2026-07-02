import { useState } from "react"
import "./GetQuote.css"

export default function GetQuote() {
const [customerName, setCustomerName] = useState("")
const [phone, setPhone] = useState("")
const [email, setEmail] = useState("")
const [vehicleType, setVehicleType] = useState("")
const [vehicleBrand, setVehicleBrand] = useState("")
const [vehicleModel, setVehicleModel] = useState("")
const [vehicleNumber, setVehicleNumber] = useState("")
const [preferredBrand, setPreferredBrand] = useState("")
const [tyreSize, setTyreSize] = useState("")
const [notes, setNotes] = useState("")
  const [step, setStep] = useState(1)

  const nextStep = () => {

    if (step < 4) {
      setStep(step + 1)
    }

  }

  const previousStep = () => {

    if (step > 1) {
      setStep(step - 1)
    }

  }

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

            Premium Tyre Quotation

          </h1>

          <p className="quote-description">

            Get a personalised quotation for your vehicle
            within minutes.

          </p>

        </section>

        {/* PROGRESS BAR */}

        <section className="stepper">

          <div className={`step ${step >= 1 ? "active" : ""}`}>

            <div className="step-circle">

              1

            </div>

            <span>

              Customer

            </span>

          </div>

          <div className="step-line"></div>

          <div className={`step ${step >= 2 ? "active" : ""}`}>

            <div className="step-circle">

              2

            </div>

            <span>

              Vehicle

            </span>

          </div>

          <div className="step-line"></div>

          <div className={`step ${step >= 3 ? "active" : ""}`}>

            <div className="step-circle">

              3

            </div>

            <span>

              Tyres

            </span>

          </div>

          <div className="step-line"></div>

          <div className={`step ${step >= 4 ? "active" : ""}`}>

            <div className="step-circle">

              4

            </div>

            <span>

              Review

            </span>

          </div>

        </section>

        {/* CARD */}

        <section className="quote-card">

          {

step === 1 && (

<>

<div className="section-title">

<div>

<h2>

Customer Information

</h2>

<p>

Tell us who you are so we can prepare your quotation.

</p>

</div>

<div className="section-number">

01

</div>

</div>

<div className="premium-grid">

<div className="floating-input">

<label>

Customer Name

</label>

<input

type="text"

placeholder="Enter your full name"

value={customerName}

onChange={(e)=>

setCustomerName(e.target.value)

}

/>

</div>

<div className="floating-input">

<label>

Phone Number

</label>

<input

type="tel"

placeholder="+91 9876543210"

value={phone}

maxLength={10}

onChange={(e)=>

setPhone(

e.target.value.replace(/\D/g,"")

)

}

/>

</div>

<div className="floating-input full-width">

<label>

Email Address

</label>

<input

type="email"

placeholder="example@gmail.com"

value={email}

onChange={(e)=>

setEmail(e.target.value)

}

/>

</div>

</div>

</>

)

          }

          {
step === 2 && (

<>

<div className="section-title">

<div>

<h2>

Vehicle Information

</h2>

<p>

Tell us about your vehicle.

</p>

</div>

<div className="section-number">

02

</div>

</div>

{/* VEHICLE TYPE */}

<div className="vehicle-type-grid">

<div

className={`vehicle-card ${
vehicleType==="Car" ? "selected":""
}`}

onClick={()=>setVehicleType("Car")}

>

<div className="vehicle-icon">

🚗

</div>

<h3>

Car

</h3>

<p>

Passenger Vehicle

</p>

</div>

<div

className={`vehicle-card ${
vehicleType==="Bike" ? "selected":""
}`}

onClick={()=>setVehicleType("Bike")}

>

<div className="vehicle-icon">

🏍

</div>

<h3>

Bike

</h3>

<p>

Motorcycle

</p>

</div>

</div>

<div className="premium-grid">

<div className="floating-input">

<label>

Vehicle Number

</label>

<input

placeholder="TN39AB1234"

value={vehicleNumber}

onChange={(e)=>

setVehicleNumber(

e.target.value.toUpperCase()

)

}

/>

</div>

<div className="floating-input">

<label>

Vehicle Brand

</label>

<input

placeholder="Toyota"

value={vehicleBrand}

onChange={(e)=>

setVehicleBrand(e.target.value)

}

/>

</div>

<div className="floating-input full-width">

<label>

Vehicle Model

</label>

<input

placeholder="Innova Crysta"

value={vehicleModel}

onChange={(e)=>

setVehicleModel(e.target.value)

}

/>

</div>

</div>

</>

)

          }

          {

            step === 3 && (

<>

<div className="section-title">

<div>

<h2>

Tyre Requirement

</h2>

<p>

Select your preferred tyre brand and tyre details.

</p>

</div>

<div className="section-number">

03

</div>

</div>

{/* TYRE BRAND CHIPS */}

<div className="brand-grid">

{

[
"MRF",
"Michelin",
"Apollo",
"Bridgestone",
"Continental",
"Yokohama",
"Goodyear",
"CEAT"
].map((brand)=>(

<div

key={brand}

className={`brand-card ${
preferredBrand===brand
?"selected":""
}`}

onClick={()=>setPreferredBrand(brand)}

>

{brand}

</div>

))

}

</div>

<div className="premium-grid">

<div className="full-width">

<label className="brand-label">

Select Vehicle Brand

</label>

<div className="brand-grid">

{

[
"Toyota",
"Hyundai",
"Honda",
"Tata",
"Mahindra",
"Kia",
"BMW",
"Audi",
"Mercedes",
"Volkswagen",
"Skoda",
"MG"
].map((brand)=>(

<div

key={brand}

className={`brand-card ${
vehicleBrand===brand
?"selected":""
}`}

onClick={()=>setVehicleBrand(brand)}

>

{brand}

</div>

))

}

</div>

</div>

<div className="floating-input full-width">

<label>

Or Type Vehicle Brand

</label>

<input

placeholder="Example : BYD"

value={vehicleBrand}

onChange={(e)=>

setVehicleBrand(e.target.value)

}

/>

</div>

<div className="floating-input">

<label>

Tyre Size

</label>

<input

placeholder="205/55 R16"

value={tyreSize}

onChange={(e)=>

setTyreSize(e.target.value)

}

/>

</div>

<div className="floating-input full-width">

<label>

Additional Requirements

</label>

<textarea

rows={6}

placeholder="Example:
Need low-noise tyres,
better mileage,
SUV usage,
off-road usage..."

value={notes}

onChange={(e)=>

setNotes(e.target.value)

}

/>

</div>

</div>

</>

)
}


          {

            step === 4 && (

              <>

                <h2>

                  ✅ Review

                </h2>

                <div className="review-card">

<h2>

Review Your Request

</h2>

<div className="review-grid">

<p>

<strong>Name</strong>

<br/>

{customerName}

</p>

<p>

<strong>Phone</strong>

<br/>

{phone}

</p>

<p>

<strong>Email</strong>

<br/>

{email || "-"}

</p>

<p>

<strong>Vehicle Type</strong>

<br/>

{vehicleType}

</p>

<p>

<strong>Vehicle Number</strong>

<br/>

{vehicleNumber}

</p>

<p>

<strong>Vehicle Brand</strong>

<br/>

{vehicleBrand}

</p>

<p>

<strong>Vehicle Model</strong>

<br/>

{vehicleModel}

</p>

<p>

<strong>Tyre Size</strong>

<br/>

{tyreSize}

</p>

<p>

<strong>Preferred Brand</strong>

<br/>

{preferredBrand}

</p>

<p>

<strong>Additional Notes</strong>

<br/>

{notes || "-"}

</p>

</div>

<button

className="submit-quote"

>

Submit Quotation Request

</button>

</div>

              </>

            )

          }

        </section>

        {/* BUTTONS */}

        <section className="wizard-buttons">

          {

            step > 1 && (

              <button

                className="back-btn"

                onClick={previousStep}

              >

                ← Previous

              </button>

            )

          }

          {

            step < 4 && (

              <button

                className="next-btn"

                onClick={nextStep}

              >

                Next →

              </button>

            )

          }

        </section>

      </div>

    </section>

  )

}