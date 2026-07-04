import { useState } from "react"
import axios from "axios"
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
  const submitQuotation = async () => {

try{

if(

!customerName ||

!phone ||

!vehicleType ||

!vehicleBrand ||

!vehicleModel ||

!vehicleNumber ||

!preferredBrand ||

!tyreSize

){

alert("Please fill all required fields")

return

}

const response = await axios.post(

"https://tyretrack-server.onrender.com/api/quotations",

{

customerName,

phone,

email,

vehicleType,

vehicleBrand,

vehicleModel,

vehicleNumber,

preferredBrand,

tyreSize,

notes

}

)

if(response.data.success){

alert(

`Quotation Submitted Successfully!

Quote No : ${response.data.quotation.quoteId}`

)

setCustomerName("")

setPhone("")

setEmail("")

setVehicleType("")

setVehicleBrand("")

setVehicleModel("")

setVehicleNumber("")

setPreferredBrand("")

setTyreSize("")

setNotes("")

setStep(1)

}

}catch(error:any){

console.log(error)

alert(

error.response?.data?.message ||

"Unable to submit quotation."

)

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
  "Maruthi Suzuki",
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

<div className="section-title">

<div>

<h2>

Review Your Quotation

</h2>

<p>

Please verify all your information before submitting your quotation request.

</p>

</div>

<div className="section-number">

04

</div>

</div>

<div className="review-premium-card">

<div className="review-header">

<h3>

Customer Details

</h3>

</div>

<div className="review-grid">

<div className="review-item">

<span>Name</span>

<h4>{customerName}</h4>

</div>

<div className="review-item">

<span>Phone</span>

<h4>{phone}</h4>

</div>

<div className="review-item">

<span>Email</span>

<h4>{email || "Not Provided"}</h4>

</div>

<div className="review-item">

<span>Vehicle Type</span>

<h4>{vehicleType}</h4>

</div>

<div className="review-item">

<span>Vehicle Number</span>

<h4>{vehicleNumber}</h4>

</div>

<div className="review-item">

<span>Vehicle Brand</span>

<h4>{vehicleBrand}</h4>

</div>

<div className="review-item">

<span>Vehicle Model</span>

<h4>{vehicleModel}</h4>

</div>

<div className="review-item">

<span>Tyre Size</span>

<h4>{tyreSize}</h4>

</div>

<div className="review-item">

<span>Preferred Brand</span>

<h4>{preferredBrand}</h4>

</div>

<div className="review-item full-review">

<span>Additional Requirements</span>

<h4>

{notes || "No additional requirements."}

</h4>

</div>

</div>

<div className="review-info-box">

<div>

✅ Your quotation request will be reviewed by our TyreTrack experts.

</div>

<div>

📞 Our team may contact you if additional information is required.

</div>

<div>

📄 A professional quotation will be generated and shared with you.

</div>

</div>

<button

className="submit-quote"

onClick={submitQuotation}

>

Submit Premium Quotation Request

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