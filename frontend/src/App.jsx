import { useState } from 'react';
import api from './api/axios';

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  // New State for Modal
  const [selectedJob, setSelectedJob] = useState(null);

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

  // Helper to generate fake AI interview questions based on skills
  const getInterviewQuestions = (skills) => {
    const questions = {
      python: "Explain list comprehensions vs generators in Python.",
      java: "What is the difference between JDK, JRE, and JVM?",
      react: "Explain the Virtual DOM and how it improves performance.",
      sql: "What is the difference between INNER JOIN and LEFT JOIN?",
      fastapi: "How does FastAPI handle async requests?",
      javascript: "Explain Closures and Event Loop in JavaScript."
    };
    
    // Return questions for matched skills, or generic ones
    return skills.map(s => questions[s.toLowerCase()] || `Tell me about your experience with ${s}.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 pb-20">
      
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center shadow-blue-500/50 shadow-lg">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-800">JobMatch</span>
            </div>
            <div className="flex items-center gap-4">
               <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition shadow-lg">Sign In</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Find your dream job with <span className="text-blue-600">AI Precision</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your resume to get matched jobs, estimated salaries, and AI interview prep.
          </p>
        </div>

        {/* Upload Box */}
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 mb-12">
            <div className="flex items-center justify-center w-full mb-6">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-xl cursor-pointer bg-blue-50/50 hover:bg-blue-50 transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                  <p className="mb-2 text-sm text-gray-500 text-center">
                    {file ? <span className="font-semibold text-blue-600">{file.name}</span> : "Click to upload PDF"}
                  </p>
                </div>
                <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
              </label>
            </div>
            <button 
              onClick={handleUpload}
              disabled={loading}
              className={`w-full py-3.5 px-4 rounded-xl text-white font-bold shadow-lg transition-all ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? "Analyzing..." : "Analyze & Find Jobs"}
            </button>
            {message && <div className="mt-4 p-3 rounded-lg text-sm text-center bg-blue-50 text-blue-700">{message}</div>}
        </div>

        {/* Results */}
        {(result || jobs.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Profile Sidebar */}
            <div className="lg:col-span-4 lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Your Profile</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase">Email</label>
                    <p className="text-sm font-medium text-gray-900 break-all">{result?.extracted_email || "Not found"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase">Skills</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {result?.extracted_skills.map((skill, index) => (
                        <span key={index} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Jobs List */}
            <div className="lg:col-span-8 grid gap-4">
               {jobs.map((job, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 font-bold text-xl">
                          {job.company.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                          <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                          {/* AI Salary Badge */}
                          <p className="text-xs font-bold text-purple-600 mt-1">✨ AI Estimated Salary: {job.ai_salary}</p>
                        </div>
                      </div>
                      <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-100">
                         {Math.min(job.match_score * 20, 100)}% Match
                      </span>
                    </div>
                    
                    <div className="mt-4 pl-16">
                       <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Matched Skills</p>
                       <div className="flex flex-wrap gap-2">
                         {job.common_skills.map((s, i) => (
                           <span key={i} className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded border border-gray-200">{s}</span>
                         ))}
                       </div>
                    </div>
                    
                    <div className="mt-5 pl-16 flex justify-end">
                      <button 
                        onClick={() => setSelectedJob(job)}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
               ))}
            </div>
          </div>
        )}
      </main>

      {/* MODAL: View Details & AI Interview Prep */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-up">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                 <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                 <p className="text-gray-500">{selectedJob.company}</p>
              </div>
              <button onClick={() => setSelectedJob(null)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Job Details */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-blue-50 p-4 rounded-xl">
                    <p className="text-xs text-blue-600 font-bold uppercase">Estimated Salary</p>
                    <p className="text-lg font-bold text-gray-900">{selectedJob.ai_salary}</p>
                 </div>
                 <div className="bg-green-50 p-4 rounded-xl">
                    <p className="text-xs text-green-600 font-bold uppercase">Match Score</p>
                    <p className="text-lg font-bold text-gray-900">{Math.min(selectedJob.match_score * 20, 100)}%</p>
                 </div>
              </div>

              {/* AI Interview Questions Section */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🤖</span> AI Interview Prep
                </h3>
                <p className="text-sm text-gray-500 mb-4">Based on your matched skills, be ready for these questions:</p>
                
                <ul className="space-y-3">
                  {getInterviewQuestions(selectedJob.common_skills).map((q, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <span className="bg-white border border-gray-200 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold text-gray-500 shadow-sm shrink-0">{i+1}</span>
                      <span className="text-gray-700 font-medium text-sm">{q}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                 <button className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30">
                   Apply Now
                 </button>
                 <button onClick={() => setSelectedJob(null)} className="px-6 py-3 font-bold text-gray-600 hover:bg-gray-100 rounded-xl">
                   Close
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;