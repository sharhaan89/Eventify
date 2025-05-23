import Event from "../models/Event.js";
import Venue from "../models/Venue.js";
import User from "../models/User.js";

export async function handleCreateEvent(req, res) {
  try {
    if (req.user.role !== "Manager") {
      return res.status(403).json({ message: "Access denied: Managers only" });
    }

    const { title, description, venue, fromTime, toTime, club } = req.body;

    // Basic validation for required fields
    if (!title || !venue || !fromTime || !toTime || !club ) {
        console.log(title);
        console.log(venue);
        console.log(fromTime);
        console.log(toTime);
        console.log(club);
      return res.status(400).json({ message: "Missing required fields" });
    }

    const from = new Date(fromTime);
    const to = new Date(toTime);

    if (from > to) {
      return res.status(400).json({ message: "'fromTime' must be before 'toTime'" });
    }

    // Check for overlapping bookings in the same venue
    const conflictingLog = await Event.findOne({
      venue,
      fromTime: { $lt: to },
      toTime: { $gt: from },
    });

    if (conflictingLog) {
      return res.status(409).json({ message: "Room is already booked during the requested time period." });
    }

    // Create the event with createdBy from req.user._id
    const newEvent = new Event({
      title,
      description,
      venue,
      fromTime: from,
      toTime: to,
      createdBy: req.user.id,
      club,
    });

    await newEvent.save();

    res.status(201).json({ message: "Event created successfully!", event: newEvent });
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get all the events from the database using the Event model
export async function handleGetAllEvents(req, res) {
  try {
    const events = await Event.find()
      .populate('venue')
      .populate('createdBy');

    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Server error while fetching events." });
  }
}

export async function handleGetCreatedEvents(req, res) {
  try {
    const userId = req.user.id;

    const events = await Event.find({ createdBy: userId })
      .populate('venue', 'venueName'); // Populate only venueName from Venue

    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching created events:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get a particular event using the id from the database
export async function handleGetEventById(req, res) {
  const { id } = req.params;
  const event = await Event.findById(id).populate("venue").populate("createdBy");

  if (!event) return res.status(404).json({ message: "Event not found" });

  res.status(200).json(event);
}

export async function handleUpdateEventById(req, res) {
  if (req.user.role !== "Manager") {
    return res.status(403).json({ message: "Access denied: Managers only" });
  }

  const { id } = req.params;

  // ✅ Validate the ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid event ID" });
  }

  try {
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.createdBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "You can only update your own events" });
    }

    Object.assign(event, req.body);
    await event.save();

    res.status(200).json({ message: "Event updated", event });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete an event by ID
export async function handleDeleteEventById(req, res) {
  if (req.user.role !== "Manager") {
    return res.status(403).json({ message: "Access denied: Managers only" });
  }

  const { id } = req.params;
  const event = await Event.findById(id);

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  if (event.createdBy.toString() !== req.user.id.toString()) {
    return res.status(403).json({ message: "You can only delete your own events" });
  }

  await Event.findByIdAndDelete(id);
  res.status(200).json({ message: "Event deleted" });
}

export async function handleGetVenues(req, res) {
  try {
    const venues = await Venue.find({}, '_id venueName capacity'); 
    res.status(200).json(venues);
  } catch (error) {
    console.error("Error fetching venues:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}