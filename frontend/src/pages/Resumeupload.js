import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ResumePage = () => {
  const [file, setFile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [forwardTo, setForwardTo] = useState('');


  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await axios.get('http://localhost:4000/resume');
      console.log(response.data)
      setResumes(response.data);
      console.log(resumes)
    } catch (error) {
      console.error('Error fetching resumes:', error);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleForwardChange = (event) => {
    setForwardTo(event.target.value);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file || !forwardTo) {
      alert('Please select a file and enter a recipient email.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('userId', '1'); 
    formData.append('forwardTo', forwardTo);

    try {
      await axios.post('http://localhost:4000/resume/forward', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchResumes();
      setFile(null);
      setForwardTo('');
      alert('Resume uploaded and forwarded successfully');
    } catch (error) {
      console.error('Error uploading resume:', error);
    }
  };

  return (
    <div className="resume-page">
      <h1>Upload Resume</h1>
      <form onSubmit={handleUpload}>
        <div>
          <input type="file" onChange={handleFileChange} accept=".pdf, .doc, .docx" required />
        </div>
        <div>
          <input
            type="email"
            placeholder="Forward to"
            value={forwardTo}
            onChange={handleForwardChange}
            required
          />
        </div>
        <button type="submit">Upload and Forward Resume</button>
      </form>

      <h2>Uploaded Resumes</h2>
      <ul>
        {resumes.map((resume) => (
          <li key={resume.id}>
            {resume.filename} - Uploaded by {resume.user?.username || "Unknown"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResumePage;
