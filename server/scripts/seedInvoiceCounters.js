// ONE-TIME MIGRATION SCRIPT
//
// Run this once after deploying the invoiceId race-condition fix, and
// BEFORE creating any new invoices on the updated code. It seeds the new
// Counter collection with the current highest invoiceNumber for every
// (financialYear, GST/non-GST) series that already exists in your data,
// so the new atomic counter continues on from where the old logic left
// off instead of restarting at 1 and colliding with real invoices.
//
// Usage (from the server/ directory, with your real DB connection string):
//   MONGODB_URI="your-connection-string" node scripts/seedInvoiceCounters.js
//
// Safe to run more than once — it only ever raises a counter to match
// the true max, never lowers it.

const mongoose = require("mongoose")
const Invoice = require("../models/Invoice")
const Counter = require("../models/Counter")

async function run() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI

  if (!uri) {
    console.error(
      "Set MONGODB_URI (or MONGO_URI) env var to your database connection string before running this script."
    )
    process.exit(1)
  }

  await mongoose.connect(uri)
  console.log("Connected to database.")

  // Group existing invoices by financialYear + GST/non-GST series and
  // find the max invoiceNumber in each group.
  const groups = await Invoice.aggregate([
    {
      $group: {
        _id: { financialYear: "$financialYear", includeGST: "$includeGST" },
        maxNumber: { $max: "$invoiceNumber" },
      },
    },
  ])

  if (groups.length === 0) {
    console.log("No existing invoices found — nothing to seed.")
    await mongoose.disconnect()
    return
  }

  for (const group of groups) {
    const { financialYear, includeGST } = group._id
    const maxNumber = group.maxNumber || 0

    if (!financialYear) {
      console.warn("Skipping a group with missing financialYear:", group)
      continue
    }

    const counterKey = `${financialYear}_${includeGST ? "GST" : "NGST"}`

    const existing = await Counter.findById(counterKey)

    if (!existing || existing.seq < maxNumber) {
      await Counter.findOneAndUpdate(
        { _id: counterKey },
        { $set: { seq: maxNumber } },
        { upsert: true }
      )
      console.log(
        `Seeded ${counterKey} -> seq = ${maxNumber} (next invoice will be ${maxNumber + 1})`
      )
    } else {
      console.log(`${counterKey} already at ${existing.seq}, no change needed.`)
    }
  }

  await mongoose.disconnect()
  console.log("Done.")
}

run().catch((err) => {
  console.error("Seed script failed:", err)
  process.exit(1)
})
