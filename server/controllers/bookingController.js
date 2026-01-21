import Booking from "../models/Booking.js";
import BookingEvent from "../models/BookingEvent.js";
import User from "../models/User.js";
import logEvent from "../services/logEvent.js";
import getRandomProvider from "../services/providerSelector.js";


export const createBooking = async (req, res) => {
  try {
    const { serviceType, address } = req.body;

    if (!serviceType || !address) {
      return res.status(400).json({ error: "All fields are required" });
    }

    
    const booking = await Booking.create({
      customerId: req.user.id,
      serviceType,
      address,
      status: "PENDING"
    });

    await logEvent({
      bookingId: booking._id,
      action: "CREATED",
      toStatus: "PENDING",
      actorRole: "CUSTOMER"
    });

  
    const provider = await getRandomProvider();

    if (provider) {
      booking.providerId = provider._id;
      booking.status = "ASSIGNED";
      booking.assignedAt = new Date();
      await booking.save();

      await logEvent({
        bookingId: booking._id,
        action: "AUTO_ASSIGNED",
        fromStatus: "PENDING",
        toStatus: "ASSIGNED",
        actorRole: "SYSTEM"
      });
    }

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getProviderBookings = async (req, res) => {
  const bookings = await Booking.find({
    providerId: req.user.id,
    status: { $in: ["ASSIGNED", "IN_PROGRESS"] }
  });

  res.json(bookings);
};

export const acceptBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }

  booking.status = "IN_PROGRESS";
  await booking.save();

  await User.findByIdAndUpdate(booking.providerId, {
    isAvailable: false
  });

  await logEvent({
    bookingId: booking._id,
    action: "ACCEPTED",
    fromStatus: "ASSIGNED",
    toStatus: "IN_PROGRESS",
    actorRole: "PROVIDER"
  });

  res.json(booking);
};


export const completeBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }

  booking.status = "COMPLETED";
  await booking.save();

  
  await User.findByIdAndUpdate(booking.providerId, {
    isAvailable: true
  });

  await logEvent({
    bookingId: booking._id,
    action: "COMPLETED",
    fromStatus: "IN_PROGRESS",
    toStatus: "COMPLETED",
    actorRole: "PROVIDER"
  });

  res.json(booking);
};

export const cancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }

  booking.status = "CANCELLED";
  await booking.save();


  if (booking.providerId) {
    await User.findByIdAndUpdate(booking.providerId, {
      isAvailable: true
    });
  }

  await logEvent({
    bookingId: booking._id,
    action: "CANCELLED",
    actorRole: req.user.role
  });

  res.json(booking);
};


export const getBookingHistory = async (req, res) => {
  const events = await BookingEvent.find({
    bookingId: req.params.id
  }).sort({ timestamp: 1 });

  res.json(events);
};
