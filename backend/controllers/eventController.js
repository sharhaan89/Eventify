import Event from "../models/Event.js";

export async function handleCreateEvent(req, res) {
  if (req.user.role !== "Manager") {
    return res.status(403).json({ message: "Access denied: Managers only" });
  }
    
  const { Room, fromTime, toTime } = req.body;

  // Check for overlapping bookings in the same room
  const conflictingLog = await Event.findOne({
    Room,
    fromTime: { $lt: new Date(toTime) },
    toTime: { $gt: new Date(fromTime) }
  });

  if (conflictingLog) {
    return res.status(409).send("Room is already booked during the requested time period.");
  }

  const log = new Event(req.body);
  await log.save();
  res.status(200).send("Log added successfully!");
}

// Get all the events from the database using the Event model
export async function handleGetAllEvents(req, res) {

}

// Get a particular event using the id from the database
export async function handleGetEventById(req, res) {

}

// Update the details an event using the ID
export async function handleUpdateEventById(req, res) {

}

// Delete an event by ID
export async function handleDeleteEventById(req, res) {

}

//for the last two functions make sure that only the manager who created the event can perform those actions