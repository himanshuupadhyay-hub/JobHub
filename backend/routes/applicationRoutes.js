import express from "express";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Apply for a job
router.post(
  "/",
  authMiddleware,
  roleMiddleware("jobseeker"),
  async (req, res) => {
    try {
      const { jobId } = req.body;

      // Check if jobId was provided
      if (!jobId) {
        return res.status(400).json({
          message: "Job ID is required",
        });
      }

      // Check if job exists
      const job = await Job.findById(jobId);

      if (!job) {
        return res.status(404).json({
          message: "Job not found",
        });
      }

      // Check if user already applied
      const existingApplication = await Application.findOne({
        job: jobId,
        applicant: req.user.userId,
      });

      if (existingApplication) {
        return res.status(409).json({
          message: "You have already applied for this job",
        });
      }

      // Create application
      const application = await Application.create({
        job: jobId,
        applicant: req.user.userId,
      });

      res.status(201).json({
        message: "Application submitted successfully",
        application,
      });
    } catch (error) {
      console.error("Apply job error:", error.message);

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

// Get current user's applications
router.get(
  "/my-applications",
  authMiddleware,
  roleMiddleware("jobseeker"),
  async (req, res) => {
    try {
      const applications = await Application.find({
        applicant: req.user.userId,
      })
        .populate(
          "job",
          "title company location salary jobType"
        )
        .sort({ createdAt: -1 });

      res.status(200).json({
        applications,
      });
    } catch (error) {
      console.error("Get applications error:", error.message);

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

// Get applications for recruiter's jobs
router.get(
  "/recruiter",
  authMiddleware,
  roleMiddleware("recruiter"),
  async (req, res) => {
    try {
      // Find jobs created by the logged-in recruiter
      const recruiterJobs = await Job.find({
        recruiter: req.user.userId,
      }).select("_id");

      const jobIds = recruiterJobs.map((job) => job._id);

      // Find applications for those jobs
      const applications = await Application.find({
        job: { $in: jobIds },
      })
        .populate("job", "title company location")
        .populate("applicant", "name email")
        .sort({ createdAt: -1 });

      res.status(200).json({
        applications,
      });
    } catch (error) {
      console.error("Get recruiter applications error:", error.message);

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);


// Update application status
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware("recruiter"),
  async (req, res) => {
    try {
      const { status } = req.body;

      // Check if status was provided
      if (!status) {
        return res.status(400).json({
          message: "Status is required",
        });
      }

      // Check if status is valid
      const allowedStatuses = [
        "Applied",
        "Shortlisted",
        "Rejected",
        "Hired",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid application status",
        });
      }

      // Find application
      const application = await Application.findById(req.params.id);

      if (!application) {
        return res.status(404).json({
          message: "Application not found",
        });
      }

      // Find the job connected to this application
      const job = await Job.findById(application.job);

      if (!job) {
        return res.status(404).json({
          message: "Job not found",
        });
      }

      // Check if recruiter owns the job
      if (job.recruiter.toString() !== req.user.userId) {
        return res.status(403).json({
          message: "You can only update applications for your own jobs",
        });
      }

      // Update status
      application.status = status;

      const updatedApplication = await application.save();

      res.status(200).json({
        message: "Application status updated successfully",
        application: updatedApplication,
      });
    } catch (error) {
      console.error("Update application status error:", error.message);

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);



export default router;