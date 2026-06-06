const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
require("dotenv").config()

const Admin = require("./models/Admin")

mongoose.connect(process.env.MONGO_URI)

async function createAdmins() {

  try {

    const adminPassword =
      await bcrypt.hash(
        "Charles@TyreTrack2026",
        10
      )

    const developerPassword =
      await bcrypt.hash(
        "Alloysious@Dev2026",
        10
      )

    await Admin.deleteMany({})

    await Admin.create({
      username: "charles",
      password: adminPassword,
      role: "Admin",
    })

    await Admin.create({
      username: "alloysious",
      password: developerPassword,
      role: "Developer",
    })

    console.log(
      "Admins Created Successfully ✅"
    )

    process.exit()

  } catch (error) {

    console.log(error)

    process.exit(1)

  }

}

createAdmins()