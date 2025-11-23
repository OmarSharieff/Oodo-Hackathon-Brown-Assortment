import {
  addEvent,
  getEventById,
  getEvents,
  rsvpToEvent,
  unrsvpFromEvent,
  getUserRSVPs,
  hasUserRSVPd,
  deleteEvent
} from '../db/queries.js';

// ADD EVENT
export async function handleAddEvent(req, res) {
  try {
    const {
      user_id,
      location_id,
      name,
      event_date,
      event_time,
      description,
      latitude,
      longitude
    } = req.body;

    if (!user_id || !name || !event_date || !event_time) {
      return res.status(400).json({
        success: false,
        message: 'user_id, name, event_date, and event_time are required'
      });
    }

    if (!location_id && (!latitude || !longitude)) {
      return res.status(400).json({
        success: false,
        message: 'Either location_id or latitude/longitude must be provided'
      });
    }

    const event = await addEvent({
      user_id,
      location_id,
      name,
      event_date,
      event_time,
      description,
      latitude,
      longitude
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    console.error('Add event error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create event'
    });
  }
}

// GET EVENT BY ID
export async function handleGetEvent(req, res) {
  try {
    const { event_id } = req.params;
    const event = await getEventById(event_id);
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(404).json({
      success: false,
      message: error.message || 'Event not found'
    });
  }
}

// GET EVENTS
export async function handleGetEvents(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const filters = {
      upcoming: req.query.upcoming === 'true',
      location_id: req.query.location_id,
      user_id: req.query.user_id
    };

    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        message: 'Page and limit must be positive integers'
      });
    }

    if (limit > 100) {
      return res.status(400).json({
        success: false,
        message: 'Limit cannot exceed 100'
      });
    }

    const result = await getEvents(page, limit, filters);

    res.status(200).json({
      success: true,
      data: result.events,
      pagination: {
        page,
        limit,
        total: result.total
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get events'
    });
  }
}

// RSVP TO EVENT
export async function handleRSVP(req, res) {
  try {
    const { event_id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'user_id is required'
      });
    }

    const rsvp = await rsvpToEvent(event_id, user_id);

    res.status(201).json({
      success: true,
      message: rsvp.message || 'RSVP successful',
      data: rsvp.data || rsvp
    });
  } catch (error) {
    console.error('RSVP error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to RSVP'
    });
  }
}

// UN-RSVP FROM EVENT
export async function handleUnRSVP(req, res) {
  try {
    const { event_id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'user_id is required'
      });
    }

    await unrsvpFromEvent(event_id, user_id);

    res.status(200).json({
      success: true,
      message: 'RSVP removed successfully'
    });
  } catch (error) {
    console.error('Un-RSVP error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to remove RSVP'
    });
  }
}

// GET USER'S RSVP'D EVENTS
export async function handleGetUserRSVPs(req, res) {
  try {
    const { user_id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        message: 'Page and limit must be positive integers'
      });
    }

    const rsvps = await getUserRSVPs(user_id, page, limit);

    res.status(200).json({
      success: true,
      data: rsvps,
      pagination: {
        page,
        limit,
        count: rsvps.length
      }
    });
  } catch (error) {
    console.error('Get user RSVPs error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get RSVPs'
    });
  }
}

// CHECK IF USER HAS RSVP'D
export async function handleCheckRSVP(req, res) {
  try {
    const { event_id, user_id } = req.params;
    const hasRSVPd = await hasUserRSVPd(event_id, user_id);
    res.status(200).json({
      success: true,
      data: {
        has_rsvpd: hasRSVPd
      }
    });
  } catch (error) {
    console.error('Check RSVP error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to check RSVP status'
    });
  }
}

// DELETE EVENT
export async function handleDeleteEvent(req, res) {
  try {
    const { event_id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'user_id is required'
      });
    }

    await deleteEvent(event_id, user_id);

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    const status = error.message.includes('Unauthorized') ? 403 : 500;
    res.status(status).json({
      success: false,
      message: error.message || 'Failed to delete event'
    });
  }
}
