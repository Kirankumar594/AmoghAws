import Testimonial from "../models/Testimonial.js";
import { uploadFile2, deleteFile } from "../Utils/Aws.upload.js";

// CREATE
export const createTestimonial = async (req, res) => {
  try {
    const { name, role, feedback, rating } = req.body;

    let image = null;
    if (req.file) {
      image = await uploadFile2(req.file, "testimonials"); // bucket folder
    }

    const newTestimonial = new Testimonial({
      name,
      role,
      feedback,
      rating,
      image,
    });

    await newTestimonial.save();
    res.status(201).json({ message: "Testimonial created", testimonial: newTestimonial });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL
export const getAllTestimonials = async (req, res) => {
  try {
    const data = await Testimonial.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET BY ID
export const getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ message: "Not found" });
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
export const updateTestimonial = async (req, res) => {
  try {
    const { name, role, feedback, rating } = req.body;
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) return res.status(404).json({ message: "Not found" });

    testimonial.name = name || testimonial.name;
    testimonial.role = role || testimonial.role;
    testimonial.feedback = feedback || testimonial.feedback;
    testimonial.rating = rating || testimonial.rating;

    if (req.file) {
      // delete old image if exists
      if (testimonial.image) {
       
      }
      testimonial.image = await uploadFile2(req.file, "testimonials");
    }

    await testimonial.save();
    res.json({ message: "Updated", testimonial });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE
export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ message: "Not found" });

    // if (testimonial.image) {
    //   await deleteFile(testimonial.image); // delete from S3
    // }

    await testimonial.deleteOne();
    res.json({ message: "Deleted", testimonial });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
