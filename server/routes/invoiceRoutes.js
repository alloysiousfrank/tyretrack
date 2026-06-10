const express =
require("express")

const router =
express.Router()

const {
 createInvoice,
 getInvoices,
 getInvoiceById,
 getInvoicesByVehicle
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
 "/:id",
 getInvoiceById
)


module.exports =
router