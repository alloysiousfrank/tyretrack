const Admin = require("../models/Admin")
const jwt = require("jsonwebtoken")

exports.adminLogin = async (req, res) => {
  try {

    const { username, password } = req.body

    const admin = await Admin.findOne({
      username,
    })

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid Username",
      })
    }

    if (password !== admin.password) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      })
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    )

    res.json({
      success: true,
      token,
      role: admin.role,
      username: admin.username,
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
      message: "Server Error",
    })

  }
}