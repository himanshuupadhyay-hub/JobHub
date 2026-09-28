import express from "express";
import Job from "../models/Job.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();


// Get all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("recruiter", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      jobs,
    });
  } catch (error) {
    console.error("Get jobs error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// Get jobs posted by the logged-in recruiter
router.get(
  "/my-jobs",
  authMiddleware,
  roleMiddleware("recruiter"),
  async (req, res) => {
    try {
      const jobs = await Job.find({
        recruiter: req.user.userId,
      })
        .populate("recruiter", "name email")
        .sort({ createdAt: -1 });

      res.status(200).json({
        jobs,
      });
    } catch (error) {
      console.error("Get recruiter jobs error:", error.message);

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

// Get a single job by ID
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("recruiter", "name email");

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.status(200).json({
      job,
    });
  } catch (error) {
    console.error("Get job error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// Create a new job
router.post(
  "/",
  authMiddleware,
  roleMiddleware("recruiter"),
  async (req, res) => {
    try {
      const {
        title,
        company,
        description,
        location,
        salary,
        skills,
        jobType,
      } = req.body;

      // Check required fields
      if (!title || !company || !description || !location || !skills) {
        return res.status(400).json({
          message:
            "Title, company, description, location and skills are required",
        });
      }

      // Create job
      const job = await Job.create({
        title,
        company,
        description,
        location,
        salary,
        skills,
        jobType,
        recruiter: req.user.userId,
      });

      res.status(201).json({
        message: "Job created successfully",
        job,
      });
    } catch (error) {
      console.error("Create job error:", error.message);

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

// Update a job
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("recruiter"),
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);

      if (!job) {
        return res.status(404).json({
          message: "Job not found",
        });
      }

      // Check if the logged-in recruiter owns this job
      if (job.recruiter.toString() !== req.user.userId) {
        return res.status(403).json({
          message: "You can only update your own jobs",
        });
      }

      const {
        title,
        company,
        description,
        location,
        salary,
        skills,
        jobType,
      } = req.body;

      // Update only the fields provided
      if (title !== undefined) job.title = title;
      if (company !== undefined) job.company = company;
      if (description !== undefined) job.description = description;
      if (location !== undefined) job.location = location;
      if (salary !== undefined) job.salary = salary;
      if (skills !== undefined) job.skills = skills;
      if (jobType !== undefined) job.jobType = jobType;

      const updatedJob = await job.save();

      res.status(200).json({
        message: "Job updated successfully",
        job: updatedJob,
      });
    } catch (error) {
      console.error("Update job error:", error.message);

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

// Delete a job
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("recruiter"),
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);

      if (!job) {
        return res.status(404).json({
          message: "Job not found",
        });
      }

      // Check if the logged-in recruiter owns this job
      if (job.recruiter.toString() !== req.user.userId) {
        return res.status(403).json({
          message: "You can only delete your own jobs",
        });
      }

      await job.deleteOne();

      res.status(200).json({
        message: "Job deleted successfully",
      });
    } catch (error) {
      console.error("Delete job error:", error.message);

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

export default router;