import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMyApplications } from "../services/applicationService";

function Dashboard() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const data = await getMyApplications();

                setApplications(data);
            } catch (error) {
                console.error(error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-12">
                <p className="text-gray-600">
                    Loading your applications...
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

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        My Applications
                    </h1>

                    <p className="text-gray-600 mt-2">
                        Track the jobs you have applied for.
                    </p>
                </div>

                {/* No Applications */}
                {applications.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                        <h2 className="text-xl font-semibold text-gray-900">
                            No applications yet
                        </h2>

                        <p className="text-gray-600 mt-2">
                            Start exploring jobs and apply to positions that interest you.
                        </p>

                        <Link
                            to="/jobs"
                            className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
                        >
                            Browse Jobs
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">

                        {applications.map((application) => (
                            <div
                                key={application._id}
                                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
                            >

                                {/* Job Information */}
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {application.job?.title}
                                        </h2>

                                        <p className="text-gray-600 mt-1">
                                            {application.job?.company}
                                        </p>
                                    </div>

                                    {/* Status */}
                                    <span
                                        className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${application.status === "Applied"
                                                ? "bg-blue-100 text-blue-700"
                                                : application.status === "Shortlisted"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : application.status === "Rejected"
                                                        ? "bg-red-100 text-red-700"
                                                        : application.status === "Hired"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-gray-100 text-gray-700"
                                            }`}
                                    >
                                        {application.status}
                                    </span>

                                </div>

                                {/* Job Details */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Location
                                        </p>

                                        <p className="font-medium text-gray-900">
                                            {application.job?.location}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Job Type
                                        </p>

                                        <p className="font-medium text-gray-900">
                                            {application.job?.jobType}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Salary
                                        </p>

                                        <p className="font-medium text-gray-900">
                                            {application.job?.salary || "Not specified"}
                                        </p>
                                    </div>

                                </div>

                                {/* Application Date */}
                                <div className="border-t border-gray-200 mt-6 pt-4">

                                    <p className="text-sm text-gray-500">
                                        Applied on
                                    </p>

                                    <p className="font-medium text-gray-900">
                                        {new Date(
                                            application.createdAt
                                        ).toLocaleDateString()}
                                    </p>

                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </div>
        </div>
    );
}

export default Dashboard;