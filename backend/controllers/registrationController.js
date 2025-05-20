// Register for an event using the ID and get the user from the req.user
// Use the Registration Model created
import QRCode from 'qrcode';
import mongoose from 'mongoose';
import Registration from '../models/Registration.js';
import { sendRegistrationEmail } from '../test/mailer.js';

const FRONTEND_URL = process.env.FRONTEND_URL;

export async function handleRegisterEvent(req, res) {
  const userId = req.user.id;
  const eventId = req.params.eventid;

  try {
    // Check if already registered
    const existing = await Registration.findOne({ user: userId, event: eventId });
    if (existing) {
      return res.status(400).send('User already registered for this event.');
    }

    // Register user
    const newRegistration = await Registration.create({
      user: userId,
      event: eventId,
    });

    const qrCodeBase64 = await handleGenerateQR(userId, eventId);

    res.status(201).json({
      message: 'You have registered for the event.',
      qrCodeBase64, 
    });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: error.message });
  }
}

export async function handleGenerateQR(userId, eventId) {
  const qrData = `${FRONTEND_URL}/checkin/${eventId}/${userId}`;

  try {
    const qrCode = await QRCode.toDataURL(qrData); // returns base64 image string
    return qrCode;
  } catch (error) {
    console.error('QR Generation Error:', error);
    throw new Error('Failed to generate QR code');
  }
}

// Get all the registrations for a particular event using the Registration model
export async function handleGetAllRegistrations(req, res) {
  const eventId = req.params.id;

  // 1. Validate the event ID format
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ error: 'Invalid event ID format.' });
  }

  try {
    // 2. Find all registrations linked to this event
    const registrations = await Registration.find({ event: eventId });

    // 3. Return the list of registrations
    return res.status(200).json(registrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return res.status(500).json({ error: 'Server error while fetching registrations.' });
  }
}

export async function handleUserCheckIn(req, res) {
  try {
    const { eventId, userId } = req.params;

    if(!mongoose.Types.ObjectId.isValid(eventId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid eventId or userId format." });
    }

    const registration = await Registration.findOne({ user: userId, event: eventId });

    if(!registration) {
      return res.status(404).json({error: "Registration not found for given user and event."});
    }

    const event = await Event.findOne({ _id: eventId});
    const currentUser = req.user;

    if(event.club.toString() !== currentUser.organization.toString()) {
        return res.status(403).json({message: "Access denied."});
    }

    if(registration.isCheckedIn) {
      return res.status(409).json({message: "User already checked in."});
    }

    registration.isCheckedIn = true;
    registration.checkinTime = new Date();
    await registration.save();

    return res.status(200).json({ message: "User checked in successfully.", registration });

  } catch (error) {
    console.error("Error checking in user:", error);
    return res.status(500).json({ error: "Server error while checking in user." });
  }
}