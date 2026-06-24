const express =
require("express")

const router =
express.Router()

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
require(
 "../controllers/invoiceController"
)

router.post(
 "/",
 createInvoice
)

router.get(
 "/",
 getInvoices
)

router.get(
 "/vehicle/:vehicleNumber",
 getInvoicesByVehicle
)

router.get(
 "/customer/:email",
 getInvoicesByCustomer
)

router.get(
 "/:id",
 getInvoiceById
)

router.put(
 "/publish/:id",
 publishInvoice
)

router.put(
 "/:id",
 updateInvoice
)
router.put(
 "/publish/:invoiceId",
 publishInvoice
)
module.exports =
router