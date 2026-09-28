import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getRecruiterApplications,
    updateApplicationStatus,
} from "../services/applicationService";

import {
    getMyJobs,
    deleteJob,
} from "../services/jobService";

function RecruiterDashboard() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingJobId, setDeletingJobId] = useState(null);
    const [updatingApplicationId, setUpdatingApplicationId] = useState(null);


    const handleStatusChange = async (applicationId, status) => {
        try {
            setUpdatingApplicationId(applicationId);
            setError("");

            const data = await updateApplicationStatus(
                applicationId,
                status
            );

            setApplications((previousApplications) =>
                previousApplications.map((application) =>
                    application._id === applicationId
                        ? {
                            ...application,
                            status: data.application.status,
                        }
                        : application
                )
            );
        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setUpdatingApplicationId(null);
        }
    };

    const handleDeleteJob = async (jobId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this job?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingJobId(jobId);
            setError("");

            await deleteJob(jobId);

            setJobs((previousJobs) =>
                previousJobs.filter((job) => job._id !== jobId)
            );
        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setDeletingJobId(null);
        }
    };

    useEffect(() => {
        const fetchRecruiterData = async () => {
            try {
                const [jobsData, applicationsData] = await Promise.all([
                    getMyJobs(),
                    getRecruiterApplications(),
                ]);

                setJobs(jobsData);
                setApplications(applicationsData);
            } catch (error) {
                console.error(error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRecruiterData();
    }, []);

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-12">
                <p className="text-gray-600">
                    Loading recruiter dashboard...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto px-6 py-12">

                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Recruiter Dashboard
                    </h1>

                    <p className="text-gray-600 mt-2">
                        Manage your jobs and applications.
                    </p>
                </div>

                {/* My Jobs */}
                <section className="mb-12">

                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                My Posted Jobs
                            </h2>

                            <p className="text-gray-600 mt-1">
                                Jobs posted by you.
                            </p>
                        </div>
                    </div>

                    {jobs.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                            <h3 className="text-xl font-semibold text-gray-900">
                                You haven't posted any jobs yet
                            </h3>

                            <p className="text-gray-600 mt-2">
                                Create your first job opening to start receiving applications.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {jobs.map((job) => (
                                <div
                                    key={job._id}
                                    className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
                                >
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {job.title}
                                    </h3>

                                    <p className="text-gray-600 mt-1">
                                        {job.company}
                                    </p>

                                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                                        <p>
                                            <span className="font-medium">
                                                Location:
                                            </span>{" "}
                                            {job.location}
                                        </p>

                                        <p>
                                            <span className="font-medium">
                                                Job Type:
                                            </span>{" "}
                                            {job.jobType}
                                        </p>

                                        <p>
                                            <span className="font-medium">
                                                Salary:
                                            </span>{" "}
                                            {job.salary || "Not specified"}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {job.skills?.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex gap-3 mt-6 pt-5 border-t border-gray-200">

                                        <button
                                            onClick={() => navigate(`/edit-job/${job._id}`)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDeleteJob(job._id)}
                                            disabled={deletingJobId === job._id}
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:bg-red-300"
                                        >
                                            {deletingJobId === job._id ? "Deleting..." : "Delete"}
                                        </button>

                                    </div>
                                </div>
                            ))}

                        </div>
                    )}

                </section>

                {/* Applications */}
                <section>

                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Applications
                        </h2>

                        <p className="text-gray-600 mt-1">
                            Candidates who applied to your jobs.
                        </p>
                    </div>

                    {applications.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                            <h3 className="text-xl font-semibold text-gray-900">
                                No applications yet
                            </h3>

                            <p className="text-gray-600 mt-2">
                                Applications for your jobs will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">

                            {applications.map((application) => (
                                <div
                                    key={application._id}
                                    className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
                                >

                                    {/* Job */}
                                    <div className="border-b border-gray-200 pb-5">
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {application.job?.title}
                                        </h3>

                                        <p className="text-gray-600 mt-1">
                                            {application.job?.company}
                                        </p>

                                        <p className="text-sm text-gray-500 mt-1">
                                            {application.job?.location}
                                        </p>
                                    </div>

                                    {/* Applicant */}
                                    <div className="py-5">
                                        <h4 className="text-lg font-semibold text-gray-900">
                                            Applicant
                                        </h4>

                                        <p className="text-gray-700 mt-2">
                                            <span className="font-medium">
                                                Name:
                                            </span>{" "}
                                            {application.applicant?.name}
                                        </p>

                                        <p className="text-gray-700 mt-1">
                                            <span className="font-medium">
                                                Email:
                                            </span>{" "}
                                            {application.applicant?.email}
                                        </p>
                                    </div>

                                    {/* Status */}
                                    <div className="border-t border-gray-200 pt-5">
                                        <p className="text-sm text-gray-500">
                                            Application Status
                                        </p>

                                        <select
                                            value={application.status}
                                            onChange={(event) =>
                                                handleStatusChange(
                                                    application._id,
                                                    event.target.value
                                                )
                                            }
                                            disabled={updatingApplicationId === application._id}
                                            className="mt-2 border border-gray-300 rounded-lg px-3 py-2"
                                        >
                                            <option value="Applied">Applied</option>
                                            <option value="Shortlisted">Shortlisted</option>
                                            <option value="Rejected">Rejected</option>
                                            <option value="Hired">Hired</option>
                                        </select>

                                        {updatingApplicationId === application._id && (
                                            <span className="ml-3 text-sm text-gray-500">
                                                Updating...
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}

                        </div>
                    )}

                </section>

            </div>
        </div>
    );
}

export default RecruiterDashboard;