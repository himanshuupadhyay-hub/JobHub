import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getJobs } from "../services/jobService";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs();
        setJobs(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs based on search, location and job type
  const filteredJobs = jobs.filter((job) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      job.title.toLowerCase().includes(search) ||
      job.company.toLowerCase().includes(search);

    const matchesLocation = job.location
      .toLowerCase()
      .includes(locationFilter.toLowerCase());

    const matchesJobType =
      jobTypeFilter === "" || job.jobType === jobTypeFilter;

    return (
      matchesSearch &&
      matchesLocation &&
      matchesJobType
    );
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }

    if (sortOption === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }

    return 0;
  });
  const handleClearFilters = () => {
    setSearchTerm("");
    setLocationFilter("");
    setJobTypeFilter("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">
          Loading jobs...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-red-600">
          {error}
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Page Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-gray-900">
            Find Your Next Job
          </h1>

          <p className="mt-3 text-gray-600">
            Explore opportunities from companies hiring on JobHub.
          </p>
        </div>
      </section>

      {/* Jobs */}
      <section className="max-w-7xl mx-auto px-6 py-10">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Available Jobs
          </h2>

          <p className="text-gray-600">
            {filteredJobs.length} jobs found
          </p>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
            <h3 className="text-xl font-semibold text-gray-900">
              No jobs available
            </h3>

            <p className="mt-2 text-gray-600">
              Check back later for new opportunities.
            </p>
          </div>
        ) : (
          <>
            {/* Search and Filters */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>

                  <input
                    type="text"
                    placeholder="Search by job title or company"
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(event.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Delhi"
                    value={locationFilter}
                    onChange={(event) =>
                      setLocationFilter(event.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Job Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>

                  <select
                    value={jobTypeFilter}
                    onChange={(event) =>
                      setJobTypeFilter(event.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Job Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort By
                    </label>

                    <select
                      value={sortOption}
                      onChange={(event) =>
                        setSortOption(event.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="newest">Newest Jobs</option>
                      <option value="oldest">Oldest Jobs</option>
                    </select>
                  </div>
                </div>
                <div className="md:col-span-3 flex justify-end">
                  <button
                    onClick={handleClearFilters}
                    className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg font-medium hover:bg-gray-300"
                  >
                    Clear Filters
                  </button>
                </div>

              </div>
            </div>

            {/* No matching jobs */}
            {filteredJobs.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  No matching jobs found
                </h3>

                <p className="mt-2 text-gray-600">
                  Try changing your search or filters.
                </p>
              </div>
            ) : (
              /* Job List */
              <div className="grid gap-6">

                {sortedJobs.map((job) => (
                  <div
                    key={job._id}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
                  >

                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900">
                          {job.title}
                        </h3>

                        <p className="mt-1 text-blue-600 font-medium">
                          {job.company}
                        </p>
                      </div>

                      <span className="inline-block w-fit bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {job.jobType}
                      </span>

                    </div>

                    <div className="mt-5 flex flex-wrap gap-4 text-sm text-gray-600">
                      <span>📍 {job.location}</span>

                      {job.salary && (
                        <span>💰 {job.salary}</span>
                      )}
                    </div>

                    <p className="mt-4 text-gray-600">
                      {job.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6">
                      <Link
                        to={`/jobs/${job._id}`}
                        className="inline-block bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700"
                      >
                        View Job
                      </Link>
                    </div>

                  </div>
                ))}

              </div>
            )}

          </>
        )}

      </section>

    </main>
  );
}

export default Jobs;