const express = require("express")

const router = express.Router()
const upload = require("../middleware/uploadMiddleware")



const {
 createInvoice,
 getInvoices,
 getInvoiceById,
 getInvoicesByVehicle,
 getInvoicesByCustomer,
 publishInvoice,
 updateInvoice
}
=
require("../controllers/invoiceController")
const {
  sendInvoiceEmail
} = require("../controllers/emailController")

router.post("/", createInvoice)

router.get("/", getInvoices)

router.get(
 "/vehicle/:vehicleNumber",
 getInvoicesByVehicle
)

router.get(
 "/customer/:email",
 getInvoicesByCustomer
)

router.put(
 "/publish/:id",
 publishInvoice
)

router.put(
 "/:id",
 updateInvoice
)
router.post(
  "/send-email",
  upload.single("invoice"),
  sendInvoiceEmail
)
router.get("/send-email", (req, res) => {

  res.json({
    success: true,
    message: "POST route exists. Use POST, not GET."
  })

})
router.get(
 "/:id",
 getInvoiceById
)

module.exports = router