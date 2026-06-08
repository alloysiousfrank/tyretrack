const Booking = require("../models/Booking")

exports.getAnalytics = async (
  req,
  res
) => {

  try {

    const serviceStats =
      await Booking.aggregate([
        {
          $group: {
            _id: "$service",
            count: {
              $sum: 1,
            },
          },
        },
      ])

    res.json({
      success: true,
      serviceStats,
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
    })

  }

}