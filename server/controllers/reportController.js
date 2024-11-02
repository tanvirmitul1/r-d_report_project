import Report from "../models/Report.js";
import mongoose from "mongoose";
export const createReport = async (req, res) => {
  try {
    const {
      title,
      project,
      author,
      description,
      accuracy,
      status,
      files,
      researchPapers,
    } = req.body;

    // Check for required fields
    if (!title || !project || !author || !description) {
      return res
        .status(400)
        .json({
          error: "Title, project, author, and description are required.",
        });
    }

    // Validate accuracy if provided
    if (accuracy !== undefined && (accuracy < 0 || accuracy > 100)) {
      return res
        .status(400)
        .json({ error: "Accuracy must be between 0 and 100." });
    }

    // Validate status if provided
    const validStatuses = ["draft", "in-review", "completed"];
    if (status && !validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ error: `Status must be one of: ${validStatuses.join(", ")}` });
    }

    // Create the report
    const report = new Report({
      title,
      project: mongoose.Types.ObjectId(project), // Ensure project is an ObjectId
      author: mongoose.Types.ObjectId(author), // Ensure author is an ObjectId
      description,
      accuracy,
      status: status || "draft", // Default to 'draft' if not provided
      files,
      researchPapers,
    });

    await report.save();
    res.status(201).json(report);
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({ error: "Failed to create report." });
  }
};

export const getReports = async (req, res) => {
  try {
    const reports = await Report.find().populate("project author");
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteReport = async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.json({ message: "Report deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
