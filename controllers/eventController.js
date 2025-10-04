import Event from '../models/eventModel.js';
import { uploadFile2 } from '../Utils/Aws.upload.js';

export const createEvent = async (req, res) => {
  try {
    const { eventTitle, eventDate, description, time } = req.body;

 const images = req.files?.images 
  ? await Promise.all(req.files.images.map(file => uploadFile2(file, 'events')))
  : [];

const videos = req.files?.videos 
  ? await Promise.all(req.files.videos.map(file => uploadFile2(file, 'events')))
  : [];

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

export const updateEvent = async (req, res) => {
  try {
    const { eventTitle, eventDate, description, time } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Upload new images if provided
    const newImages = req.files?.images
      ? await Promise.all(req.files.images.map(file => uploadFile2(file, 'events')))
      : [];

    const newVideos = req.files?.videos
      ? await Promise.all(req.files.videos.map(file => uploadFile2(file, 'events')))
      : [];

    // Update fields
    if (eventTitle) event.eventTitle = eventTitle;
    if (eventDate) event.eventDate = eventDate;
    if (time) event.time = time;
    if (description) event.description = description;

    // Append media (instead of replacing)
    if (newImages.length > 0) event.images.push(...newImages);
    if (newVideos.length > 0) event.videos.push(...newVideos);

    await event.save();

    res.status(200).json({ success: true, message: 'Event updated successfully', event });
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
};