import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getJobById } from "../services/jobService";
import { applyForJob } from "../services/applicationService";

function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const [applyLoading, setApplyLoading] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");
  const [applyError, setApplyError] = useState("");


  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);


  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await getJobById(id);
        setJob(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    setApplyLoading(true);
    setApplyMessage("");
    setApplyError("");

    try {
      const data = await applyForJob(id);

      setApplyMessage(data.message);
    } catch (error) {
      setApplyError(error.message);
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        <p className="text-gray-600">Loading job details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        <p className="text-red-600">{error}</p>

        <Link
          to="/jobs"
          className="inline-block mt-4 text-blue-600 hover:underline"
        >
          ← Back to Jobs
        </Link>
      </div>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Back to Jobs */}
        <Link
          to="/jobs"
          className="text-blue-600 hover:underline"
        >
          ← Back to Jobs
        </Link>

        {/* Job Details Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mt-6">

          {/* Job Title */}
          <div className="border-b border-gray-200 pb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {job.title}
            </h1>

            <p className="text-lg text-gray-600 mt-2">
              {job.company}
            </p>
          </div>

          {/* Job Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">

            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium text-gray-900">
                {job.location}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Job Type</p>
              <p className="font-medium text-gray-900">
                {job.jobType}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Salary</p>
              <p className="font-medium text-gray-900">
                {job.salary || "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Recruiter</p>
              <p className="font-medium text-gray-900">
                {job.recruiter?.name || "Not specified"}
              </p>
            </div>

          </div>

          {/* Description */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Job Description
            </h2>

            <p className="text-gray-700 mt-3 leading-7">
              {job.description}
            </p>
          </div>

          {/* Skills */}
          <div className="border-t border-gray-200 mt-6 pt-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Required Skills
            </h2>

            <div className="flex flex-wrap gap-2 mt-4">
              {job.skills?.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Apply Section */}
          <div className="border-t border-gray-200 mt-8 pt-8">

            {!user && (
              <Link
                to="/login"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Login to Apply
              </Link>
            )}

            {user?.role === "jobseeker" && (
              <>
                <button
                  onClick={handleApply}
                  disabled={applyLoading}
                  className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {applyLoading ? "Applying..." : "Apply for this Job"}
                </button>

                {applyMessage && (
                  <p className="mt-4 text-green-600 font-medium">
                    {applyMessage}
                  </p>
                )}

                {applyError && (
                  <p className="mt-4 text-red-600 font-medium">
                    {applyError}
                  </p>
                )}
              </>
            )}

            {user?.role === "recruiter" && (
              <p className="text-gray-600">
                Recruiters cannot apply for jobs.
              </p>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}

export default JobDetails;