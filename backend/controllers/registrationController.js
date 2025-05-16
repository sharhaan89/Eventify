// Register for an event using the ID and get the user from the req.user
// Use the Registration Model created
import mongoose from 'mongoose';
import Registration from '../models/Registration.js';
import User from '../models/User.js';
import Event from '../models/Event.js';

export async function handleRegisterEvent(req, res) {
   const userID = req.user._id
   const eventId = req.event._id
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
    const { eventId } = req.params;

    // 1. Validate the event ID format
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ error: 'Invalid event ID format.' });
    }

    // 2. Find all registrations linked to this event
    const registrations = await Registration.find({ eventId });

    // 3. Return the list of registrations
    res.status(200).json(registrations);
  
    console.error('Error fetching registrations:', error);
    res.status(500).json({ error: 'Server error while fetching registrations.' });
  
}

//Generate a unique QR code using event ID + user ID
//We will implement this later
export async function handleGenerateQR(req, res) {
    
}