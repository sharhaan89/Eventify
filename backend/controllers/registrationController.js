// Register for an event using the ID and get the user from the req.user
// Use the Registration Model created
import mongoose from 'mongoose';
import Registration from '../models/Registration.js';

export async function handleRegisterEvent(req, res) {
   const userId = req.user.id
   const eventId = req.params.id
    const newRegistration = await Registration.create({
      user: userId,
      event: eventId
    });

    res.status(201).send("You have registered for the event");
    res.status(400).send('User already registered for this event.')
    res.status(500).json({ message: error.message })
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

//Generate a unique QR code using event ID + user ID
//We will implement this later
export async function handleGenerateQR(req, res) {
    
}