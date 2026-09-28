const API_URL = "http://localhost:5000/api/applications";

// Apply for a job
export const applyForJob = async (jobId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login to apply for a job");
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      jobId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to apply for job");
  }

  return data;
};


// Get current user's applications
export const getMyApplications = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login to view your applications");
  }

  const response = await fetch(`${API_URL}/my-applications`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch applications");
  }

  return data.applications;
};

// Get applications for recruiter's jobs
export const getRecruiterApplications = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login to view applications");
  }

  const response = await fetch(`${API_URL}/recruiter`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch recruiter applications"
    );
  }

  return data.applications;
};

// Update application status
export const updateApplicationStatus = async (applicationId, status) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login to update application status");
  }

  const response = await fetch(
    `${API_URL}/${applicationId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update application status"
    );
  }

  return data;
};