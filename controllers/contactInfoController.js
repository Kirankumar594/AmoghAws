import { ContactInformation } from '../models/ContactInformation.js';

// CREATE
export const createContactInfo = async (req, res) => {
  try {
    const data = new ContactInformation(req.body);
    await data.save();
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// READ
export const getContactInfo = async (req, res) => {
  try {
    const info = await ContactInformation.findOne().sort({ createdAt: -1 });
    res.status(200).json(info);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateContactInfo = async (req, res) => {
  try {
    const updated = await ContactInformation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE (Optional)
export const deleteContactInfo = async (req, res) => {
  try {
    await ContactInformation.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Contact information deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
