import { Link } from "react-router-dom";


function Home() {
  return (
    <main className="bg-gray-50">

      {/* Hero Section */}
      <section className="min-h-[calc(100vh-73px)] flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-16 w-full">
          <div className="max-w-3xl mx-auto text-center">

            <p className="text-blue-600 font-semibold text-lg mb-4">
              Welcome to JobHub
            </p>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Find a job that
              <span className="text-blue-600"> fits your future.</span>
            </h1>

            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
              Discover opportunities, connect with employers, and take the
              next step in your career with JobHub.
            </p>

            {/* Search Box */}
            <div className="mt-10 bg-white p-3 rounded-xl shadow-lg border border-gray-200 flex flex-col md:flex-row gap-3">

              <input
                type="text"
                placeholder="Job title or keyword"
                className="flex-1 px-4 py-3 outline-none text-gray-700"
              />

              <input
                type="text"
                placeholder="Location"
                className="flex-1 px-4 py-3 outline-none text-gray-700"
              />

              <button className="bg-blue-600 text-white px-7 py-3 rounded-lg font-semibold hover:bg-blue-700">
                Search Jobs
              </button>

            </div>

            <div className="mt-8">
              <Link
                to="/jobs"
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                Browse all jobs →
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Everything you need for your job search
            </h2>

            <p className="mt-3 text-gray-600">
              JobHub makes finding and managing opportunities simple.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {/* Feature 1 */}
            <div className="p-6 rounded-xl border border-gray-200">
              <div className="text-3xl mb-4">🔎</div>

              <h3 className="text-xl font-semibold text-gray-900">
                Find Jobs
              </h3>

              <p className="mt-2 text-gray-600">
                Browse job opportunities based on your skills, interests,
                and location.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl border border-gray-200">
              <div className="text-3xl mb-4">📄</div>

              <h3 className="text-xl font-semibold text-gray-900">
                Apply Easily
              </h3>

              <p className="mt-2 text-gray-600">
                Apply to jobs with a simple application process and track
                your applications.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl border border-gray-200">
              <div className="text-3xl mb-4">🏢</div>

              <h3 className="text-xl font-semibold text-gray-900">
                Hire Talent
              </h3>

              <p className="mt-2 text-gray-600">
                Recruiters can publish jobs and manage applications from
                one place.
              </p>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}

export default Home;