import Event from '../models/eventModel.js';

export const createEvent = async (req, res) => {
  try {
    const { eventTitle, eventDate, description, time } = req.body;

    const images = req.files['images']?.map(file => file.path) || [];
    const videos = req.files['videos']?.map(file => file.path) || [];

    const newEvent = new Event({
      eventTitle,
      eventDate,
      time,
      description,
      images,
      videos,
    });

    await newEvent.save();
    res.status(201).json({ success: true, message: 'Event created successfully', event: newEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching events', error: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event', error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
};
