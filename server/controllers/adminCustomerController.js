const User = require("../models/User")

exports.getCustomers =
  async (req, res) => {

  try {

    const customers =
      await User.find()
      .sort({
        createdAt: -1,
      })

    res.json({
      success: true,
      customers,
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
    })

  }

}