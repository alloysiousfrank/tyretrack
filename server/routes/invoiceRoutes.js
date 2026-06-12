const express =
require("express")

const router =
express.Router()

const {

 createInvoice,
 getInvoices,
 getInvoiceById,
 getInvoicesByVehicle,
 getInvoicesByCustomer

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

module.exports =
router