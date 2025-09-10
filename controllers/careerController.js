import Career from '../models/careerModel.js';

export const createApplication = async (req, res, next) => {
  try {
    const { name, email, coverLetter } = req.body;
    const resume = req.file?.filename;

    if (!name || !email || !resume) {
      return res.status(400).json({ message: 'Name, email, and resume are required' });
    }

    const newCareer = new Career({
      name,
      email,
      resume,
      coverLetter
    });

    await newCareer.save();
    res.status(201).json({ message: 'Application submitted successfully', data: newCareer });
  } catch (err) {
    next(err);
  }
};

export const getAllApplications = async (req, res, next) => {
  try {
    const careers = await Career.find().sort({ createdAt: -1 });
    res.status(200).json(careers);
  } catch (err) {
    next(err);
  }
};

export const getApplicationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const application = await Career.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.status(200).json(application);
  } catch (err) {
    next(err);
  }
};
// DELETE application by ID
// controllers/careerController.js

import fs from 'fs';
import path from 'path';

export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Career.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Optional: Delete resume file from disk
    const resumePath = path.join('uploads', application.resume);
    if (fs.existsSync(resumePath)) {
      fs.unlinkSync(resumePath);  // 👈 This could be line 58
    }

    await Career.findByIdAndDelete(id);

    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error(error);  // <-- log the real error
    res.status(500).json({ message: 'Error deleting application', error });
  }
};
