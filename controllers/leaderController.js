import Leader from "../models/leaderModel.js";
import { deleteFile, uploadFile2 } from "../Utils/Aws.upload.js";


// CREATE
export const createLeader = async (req, res) => {
  try {
    const { name, role, bio } = req.body;

    let imageUrl = "";
    if (req.file) {
      imageUrl = await uploadFile2(req.file, "leaders"); // Upload to S3
    }

    const leader = new Leader({ name, role, bio, image: imageUrl });
    await leader.save();
    res.status(201).json(leader);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ALL
export const getAllLeaders = async (req, res) => {
  try {
    const leaders = await Leader.find().sort({ createdAt: -1 });
    res.json(leaders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ BY ID
export const getLeaderById = async (req, res) => {
  try {
    const leader = await Leader.findById(req.params.id);
    if (!leader) return res.status(404).json({ error: "Leader not found" });
    res.json(leader);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const updateLeader = async (req, res) => {
  try {
    const leader = await Leader.findById(req.params.id);
    if (!leader) return res.status(404).json({ error: "Leader not found" });

    const { name, role, bio } = req.body;
    if (name) leader.name = name;
    if (role) leader.role = role;
    if (bio) leader.bio = bio;

    if (req.file) {
      // Delete old image from S3 if exists
      if (leader.image) {
        try {
          await deleteFile(leader.image);
        } catch (err) {
          console.warn("Failed to delete old image:", err.message);
        }
      }
      // Upload new image to S3
      leader.image = await uploadFile2(req.file, "leaders");
    }

    await leader.save();
    res.json(leader);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
export const deleteLeader = async (req, res) => {
  try {
    const leader = await Leader.findById(req.params.id);
    if (!leader) return res.status(404).json({ error: "Leader not found" });

    // if (leader.image) {
    //   try {
    //     await deleteFile(leader.image); // Delete from S3
    //   } catch (err) {
    //     console.warn("Failed to delete image from S3:", err.message);
    //   }
    // }

    await leader.deleteOne();
    res.json({ message: "Leader deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
