import { useState } from 'react';
import api from './api/axios';

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage(""); 
    setJobs([]);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first!");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setMessage("Parsing Resume...");
    setJobs([]); 
    
    try {
      const response = await api.post("/parse-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data);

      const skills = response.data.extracted_skills;
      if (!skills || skills.length === 0) {
        setMessage("Resume parsed, but NO skills were found.");
        setLoading(false);
        return;
      }

      setMessage(`Found ${skills.length} skills. Looking for matches...`);
      fetchMatchingJobs(skills);

    } catch (error) {
      console.error("Error:", error);
      setMessage("Error: Failed to analyze resume.");
      setLoading(false);
    }
  };

  const fetchMatchingJobs = async (skills) => {
    try {
      const jobResponse = await api.post("/match-jobs", { skills });

      if (jobResponse.data.length === 0) {
        setMessage("No matching jobs found for your specific skills.");
      } else {
        setJobs(jobResponse.data);
        setMessage(""); 
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setMessage("Error: Could not fetch jobs from database.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 pb-20">
      
      {/* 1. Responsive Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center shadow-blue-500/50 shadow-lg">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-800">JobMatch</span>
            </div>

            {/* Right Side Menu (Hidden on mobile, simplified) */}
            <div className="flex items-center gap-4">
              <button className="hidden sm:block text-gray-500 hover:text-gray-900 font-medium text-sm transition">For Recruiters</button>
              <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition shadow-lg">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-10 lg:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            Find your dream job with <span className="text-blue-600">AI Precision</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            Upload your resume and let our intelligent algorithm match your skills to the perfect job opportunities instantly.
          </p>
        </div>

        {/* Upload Section (Always Centered) */}
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-12 sm:mb-16">
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-center w-full mb-6">
              <label className="flex flex-col items-center justify-center w-full h-32 sm:h-40 border-2 border-blue-300 border-dashed rounded-xl cursor-pointer bg-blue-50/50 hover:bg-blue-50 transition duration-300 group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {/* Upload Icon */}
                  <svg className="w-8 h-8 mb-3 text-blue-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                  <p className="mb-2 text-sm text-gray-500 text-center">
                    {file ? <span className="font-semibold text-blue-600">{file.name}</span> : <span className="font-semibold">Click to upload PDF</span>}
                  </p>
                  <p className="text-xs text-gray-400">PDF (MAX. 5MB)</p>
                </div>
                <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
              </label>
            </div>

            <button 
              onClick={handleUpload}
              disabled={loading}
              className={`w-full py-3.5 px-4 rounded-xl text-white font-bold shadow-lg shadow-blue-500/30 transition-all transform active:scale-95 
                ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5'}`}
            >
              {loading ? "Analyzing..." : "Analyze & Find Jobs"}
            </button>
            
            {message && (
              <div className={`mt-4 p-3 rounded-lg text-sm text-center font-medium animate-pulse ${message.includes("Error") ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-700"}`}>
                {message}
              </div>
            )}
          </div>
        </div>

        {/* Results Grid - Responsive Logic Here */}
        {(result || jobs.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: User Profile */}
            {/* On Mobile: Takes full width. On Desktop: Takes 4 columns */}
            <div className="lg:col-span-4 order-1 lg:order-1">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 lg:sticky lg:top-24">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-gray-900 truncate">Your Profile</h2>
                    <p className="text-xs text-gray-500">Extracted from Resume</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</label>
                    <p className="text-sm font-medium text-gray-900 break-all">{result?.extracted_email || "Not found"}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Skills Detected</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {result?.extracted_skills.map((skill, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Job Matches */}
            {/* On Mobile: Takes full width. On Desktop: Takes 8 columns */}
            <div className="lg:col-span-8 order-2 lg:order-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Recommended Jobs</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {jobs.length} Matches
                </span>
              </div>

              {jobs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-500 font-medium">No jobs found yet.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:gap-5">
                  {jobs.map((job, index) => (
                    <div key={index} className="group bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all duration-200">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                            {job.company.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                            <p className="text-sm font-medium text-gray-600">{job.company} • {job.location}</p>
                          </div>
                        </div>
                        
                        {/* Match Score Badge */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto mt-2 sm:mt-0">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                             {Math.min(job.match_score * 20, 100)}% Match
                          </span>
                        </div>
                      </div>
                      
                      {/* Matched Skills List */}
                      <div className="mt-4 pl-0 sm:pl-16">
                         <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Matched Skills</p>
                         <div className="flex flex-wrap gap-2">
                           {job.common_skills.map((s, i) => (
                             <span key={i} className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded border border-gray-200">
                               {s}
                             </span>
                           ))}
                         </div>
                      </div>
                      
                      <div className="mt-5 pl-0 sm:pl-16 pt-4 border-t border-gray-50 flex justify-end">
                        <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                          View Details 
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

export default App;