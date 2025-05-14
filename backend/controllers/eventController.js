import Event from "../models/Event.js";

export async function handleCreateEvent(req, res) {
  if (req.user.role !== "Manager") {
    return res.status(403).json({ message: "Access denied: Managers only" });
  }

  const { Room, fromTime, toTime } = req.body;

  // Check for overlapping bookings in the same room
  const conflictingLog = await Event.findOne({
    venue,
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
  const events = await Event.find().populate("venue").populate("createdBy");
  res.status(200).json(events);
}

// Get a particular event using the id from the database
export async function handleGetEventById(req, res) {
  const { id } = req.params;
  const event = await Event.findById(id).populate("venue").populate("createdBy");

  if (!event) return res.status(404).json({ message: "Event not found" });

  res.status(200).json(event);
}

// Update the details an event using the ID
export async function handleUpdateEventById(req, res) {
  if (req.user.role !== "Manager") {
    return res.status(403).json({ message: "Access denied: Managers only" });
  }
  
  const { id } = req.params;
  const event = await Event.findById(id);

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  if (event.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You can only update your own events" });
  }

  Object.assign(event, req.body);
  await event.save();
  res.status(200).json({ message: "Event updated", event });
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

  if (event.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You can only delete your own events" });
  }

  await Event.findByIdAndDelete(id);
  res.status(200).json({ message: "Event deleted" });
}

//for the last two functions make sure that only the manager who created the event can perform those actions