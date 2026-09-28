const API_URL = "http://localhost:5000/api/jobs";

// Get all jobs
export const getJobs = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }

  const data = await response.json();

  return data.jobs;
};


// Get a single job by ID
export const getJobById = async (jobId) => {
  const response = await fetch(`${API_URL}/${jobId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch job");
  }

  const data = await response.json();

  return data.job;
};


// Create a new job
export const createJob = async (jobData) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login to post a job");
  }

  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(jobData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create job");
  }

  return data;
};

// Get jobs posted by the logged-in recruiter
export const getMyJobs = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login to view your jobs");
  }

  const response = await fetch(`${API_URL}/my-jobs`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch your jobs");
  }

  return data.jobs;
};

// Update a job
export const updateJob = async (jobId, jobData) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login to update a job");
  }

  const response = await fetch(`${API_URL}/${jobId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(jobData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update job");
  }

  return data;
};


// Delete a job
export const deleteJob = async (jobId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login to delete a job");
  }

  const response = await fetch(`${API_URL}/${jobId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete job");
  }

  return data;
};