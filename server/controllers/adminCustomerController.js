const User = require("../models/User")
const Booking = require("../models/Booking")

exports.getCustomers = async (req, res) => {

  try {

    const users =
      await User.find()
      .sort({ createdAt: -1 })

    const customers =
      await Promise.all(

        users.map(async (user) => {

          const bookings =
            await Booking.find({
              email: user.email,
            })

          return {

            _id: user._id,

            name: user.name,

            email: user.email,

            phone: user.phone,

            joinedDate:
              user.createdAt,

            totalBookings:
              bookings.length,

            lastBooking:

              bookings.length > 0
                ? bookings[0].date
                : "No Booking",

          }

        })

      )

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