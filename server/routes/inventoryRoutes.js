const express =
require("express")

const router =
express.Router()

const {

 createProduct,
 getProducts,
 deleteProduct,
 updateStock,
 getInventoryStats
}
=
require(
 "../controllers/inventoryController"
)

router.post(
 "/",
 createProduct
)

router.get(
 "/",
 getProducts
)

router.delete(
 "/:id",
 deleteProduct
)

router.put(
 "/:id",
 updateStock
)

router.get(
 "/stats",
 getInventoryStats
)

module.exports =
router