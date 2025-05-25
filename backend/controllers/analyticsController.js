import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import User from '../models/User.js';

// Get basic event statistics
export async function getEventBasicStats(req, res) {
  try {
    const { eventId } = req.params;

    // Verify event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Get total registrants
    const totalRegistrants = await Registration.countDocuments({ event: eventId });

    // Get total attendees (checked in users)
    const totalAttendees = await Registration.countDocuments({ 
      event: eventId, 
      isCheckedIn: true 
    });

    // Calculate attendance percentage
    const attendancePercentage = totalRegistrants > 0 
      ? Math.round((totalAttendees / totalRegistrants) * 100) 
      : 0;

    res.status(200).json({
      eventId,
      totalRegistrants,
      totalAttendees,
      attendancePercentage,
      eventTitle: event.title,
      eventDuration: {
        fromTime: event.fromTime,
        toTime: event.toTime
      }
    });

  } catch (error) {
    console.error('Error fetching basic stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Get gender-wise distribution
export async function getGenderDistribution(req, res) {
  try {
    const { eventId } = req.params;
    const { type = 'registrants' } = req.query; // 'registrants' or 'attendees'

    // Verify event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Build match condition based on type
    const matchCondition = { event: eventId };
    if (type === 'attendees') {
      matchCondition.isCheckedIn = true;
    }

    const genderDistribution = await Registration.aggregate([
      { $match: matchCondition },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $unwind: '$userInfo' },
      {
        $group: {
          _id: '$userInfo.gender',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          gender: { $ifNull: ['$_id', 'Not Specified'] },
          count: 1,
          _id: 0
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      eventId,
      type,
      genderDistribution
    });

  } catch (error) {
    console.error('Error fetching gender distribution:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Get branch-wise distribution
export async function getBranchDistribution(req, res) {
  try {
    const { eventId } = req.params;
    const { type = 'registrants' } = req.query; // 'registrants' or 'attendees'

    // Verify event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Build match condition based on type
    const matchCondition = { event: eventId };
    if (type === 'attendees') {
      matchCondition.isCheckedIn = true;
    }

    const branchDistribution = await Registration.aggregate([
      { $match: matchCondition },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $unwind: '$userInfo' },
      {
        $group: {
          _id: '$userInfo.branch',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          branch: { $ifNull: ['$_id', 'Not Specified'] },
          count: 1,
          _id: 0
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      eventId,
      type,
      branchDistribution
    });

  } catch (error) {
    console.error('Error fetching branch distribution:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Get year of graduation (YOG) distribution
export async function getYogDistribution(req, res) {
  try {
    const { eventId } = req.params;
    const { type = 'registrants' } = req.query; // 'registrants' or 'attendees'

    // Verify event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Build match condition based on type
    const matchCondition = { event: eventId };
    if (type === 'attendees') {
      matchCondition.isCheckedIn = true;
    }

    const yogDistribution = await Registration.aggregate([
      { $match: matchCondition },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $unwind: '$userInfo' },
      {
        $group: {
          _id: '$userInfo.yog',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          yog: { $ifNull: ['$_id', 'Not Specified'] },
          count: 1,
          _id: 0
        }
      },
      { $sort: { yog: 1 } } // Sort by year ascending
    ]);

    res.status(200).json({
      eventId,
      type,
      yogDistribution
    });

  } catch (error) {
    console.error('Error fetching YOG distribution:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Get check-in distribution over time (hourly)
export async function getCheckinTimeDistribution(req, res) {
  try {
    const { eventId } = req.params;

    // Verify event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Get all checked-in registrations for this event
    const checkinData = await Registration.aggregate([
      { 
        $match: { 
          event: eventId, 
          isCheckedIn: true,
          checkinTime: { $exists: true, $ne: null }
        }
      },
      {
        $project: {
          checkinTime: 1,
          // Extract hour from checkinTime
          hour: { 
            $dateToString: { 
              format: "%H:00", 
              date: "$checkinTime",
              timezone: "UTC" // Adjust timezone as needed
            }
          },
          // Create a date string for grouping (YYYY-MM-DD HH:00)
          hourSlot: {
            $dateToString: {
              format: "%Y-%m-%d %H:00",
              date: "$checkinTime",
              timezone: "UTC"
            }
          }
        }
      },
      {
        $group: {
          _id: '$hourSlot',
          count: { $sum: 1 },
          hour: { $first: '$hour' }
        }
      },
      {
        $project: {
          timeSlot: '$_id',
          hour: 1,
          count: 1,
          _id: 0
        }
      },
      { $sort: { timeSlot: 1 } }
    ]);

    // Generate complete time slots based on event duration
    const eventStart = new Date(event.fromTime);
    const eventEnd = new Date(event.toTime);
    const timeSlots = [];
    
    // Round start time to nearest hour
    const startHour = new Date(eventStart);
    startHour.setMinutes(0, 0, 0);
    
    // Generate hourly slots
    let currentSlot = new Date(startHour);
    while (currentSlot <= eventEnd) {
      const slotString = currentSlot.toISOString().substring(0, 13) + ':00';
      const hourString = String(currentSlot.getUTCHours()).padStart(2, '0') + ':00';
      
      // Find if we have data for this slot
      const existingData = checkinData.find(item => 
        item.timeSlot.startsWith(slotString.substring(0, 13))
      );
      
      timeSlots.push({
        timeSlot: slotString,
        hour: hourString,
        count: existingData ? existingData.count : 0,
        timestamp: new Date(currentSlot)
      });
      
      // Move to next hour
      currentSlot.setHours(currentSlot.getHours() + 1);
    }

    res.status(200).json({
      eventId,
      eventDuration: {
        fromTime: event.fromTime,
        toTime: event.toTime
      },
      checkinDistribution: timeSlots,
      totalCheckins: checkinData.reduce((sum, item) => sum + item.count, 0)
    });

  } catch (error) {
    console.error('Error fetching checkin distribution:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Get comprehensive analytics (all data in one call)
export async function getComprehensiveAnalytics(req, res) {
  try {
    const { eventId } = req.params;

    // Verify event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Get basic stats
    const totalRegistrants = await Registration.countDocuments({ event: eventId });
    const totalAttendees = await Registration.countDocuments({ 
      event: eventId, 
      isCheckedIn: true 
    });
    const attendancePercentage = totalRegistrants > 0 
      ? Math.round((totalAttendees / totalRegistrants) * 100) 
      : 0;

    // Get distributions for both registrants and attendees
    const [
      registrantGenderDist,
      attendeeGenderDist,
      registrantBranchDist,
      attendeeBranchDist,
      registrantYogDist,
      attendeeYogDist
    ] = await Promise.all([
      // Gender distributions
      Registration.aggregate([
        { $match: { event: eventId } },
        { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'userInfo' } },
        { $unwind: '$userInfo' },
        { $group: { _id: '$userInfo.gender', count: { $sum: 1 } } },
        { $project: { gender: { $ifNull: ['$_id', 'Not Specified'] }, count: 1, _id: 0 } },
        { $sort: { count: -1 } }
      ]),
      Registration.aggregate([
        { $match: { event: eventId, isCheckedIn: true } },
        { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'userInfo' } },
        { $unwind: '$userInfo' },
        { $group: { _id: '$userInfo.gender', count: { $sum: 1 } } },
        { $project: { gender: { $ifNull: ['$_id', 'Not Specified'] }, count: 1, _id: 0 } },
        { $sort: { count: -1 } }
      ]),
      
      // Branch distributions
      Registration.aggregate([
        { $match: { event: eventId } },
        { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'userInfo' } },
        { $unwind: '$userInfo' },
        { $group: { _id: '$userInfo.branch', count: { $sum: 1 } } },
        { $project: { branch: { $ifNull: ['$_id', 'Not Specified'] }, count: 1, _id: 0 } },
        { $sort: { count: -1 } }
      ]),
      Registration.aggregate([
        { $match: { event: eventId, isCheckedIn: true } },
        { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'userInfo' } },
        { $unwind: '$userInfo' },
        { $group: { _id: '$userInfo.branch', count: { $sum: 1 } } },
        { $project: { branch: { $ifNull: ['$_id', 'Not Specified'] }, count: 1, _id: 0 } },
        { $sort: { count: -1 } }
      ]),
      
      // YOG distributions
      Registration.aggregate([
        { $match: { event: eventId } },
        { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'userInfo' } },
        { $unwind: '$userInfo' },
        { $group: { _id: '$userInfo.yog', count: { $sum: 1 } } },
        { $project: { yog: { $ifNull: ['$_id', 'Not Specified'] }, count: 1, _id: 0 } },
        { $sort: { yog: 1 } }
      ]),
      Registration.aggregate([
        { $match: { event: eventId, isCheckedIn: true } },
        { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'userInfo' } },
        { $unwind: '$userInfo' },
        { $group: { _id: '$userInfo.yog', count: { $sum: 1 } } },
        { $project: { yog: { $ifNull: ['$_id', 'Not Specified'] }, count: 1, _id: 0 } },
        { $sort: { yog: 1 } }
      ])
    ]);

    // Get checkin time distribution
    const checkinData = await Registration.aggregate([
      { 
        $match: { 
          event: eventId, 
          isCheckedIn: true,
          checkinTime: { $exists: true, $ne: null }
        }
      },
      {
        $project: {
          hourSlot: {
            $dateToString: {
              format: "%Y-%m-%d %H:00",
              date: "$checkinTime",
              timezone: "UTC"
            }
          }
        }
      },
      {
        $group: {
          _id: '$hourSlot',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Generate complete time slots
    const eventStart = new Date(event.fromTime);
    const eventEnd = new Date(event.toTime);
    const timeSlots = [];
    
    const startHour = new Date(eventStart);
    startHour.setMinutes(0, 0, 0);
    
    let currentSlot = new Date(startHour);
    while (currentSlot <= eventEnd) {
      const slotString = currentSlot.toISOString().substring(0, 13) + ':00';
      const hourString = String(currentSlot.getUTCHours()).padStart(2, '0') + ':00';
      
      const existingData = checkinData.find(item => 
        item._id.startsWith(slotString.substring(0, 13))
      );
      
      timeSlots.push({
        timeSlot: slotString,
        hour: hourString,
        count: existingData ? existingData.count : 0
      });
      
      currentSlot.setHours(currentSlot.getHours() + 1);
    }

    res.status(200).json({
      eventId,
      eventInfo: {
        title: event.title,
        fromTime: event.fromTime,
        toTime: event.toTime
      },
      basicStats: {
        totalRegistrants,
        totalAttendees,
        attendancePercentage
      },
      distributions: {
        gender: {
          registrants: registrantGenderDist,
          attendees: attendeeGenderDist
        },
        branch: {
          registrants: registrantBranchDist,
          attendees: attendeeBranchDist
        },
        yog: {
          registrants: registrantYogDist,
          attendees: attendeeYogDist
        }
      },
      checkinTimeDistribution: timeSlots
    });

  } catch (error) {
    console.error('Error fetching comprehensive analytics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}