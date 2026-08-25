const mongoose = require("mongoose")

// One document per (financialYear + series) e.g. "2026-27_GST" or "2026-27_NGST".
// The whole point of this collection is that incrementing `seq` happens
// atomically in MongoDB itself (via $inc), so two simultaneous invoice
// creations can never read the same "next number" the way the old
// findOne().sort() approach could.
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // e.g. "2026-27_GST"
  seq: { type: Number, default: 0 },
})

module.exports = mongoose.model("Counter", counterSchema)
