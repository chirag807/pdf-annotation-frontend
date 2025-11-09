import { useState } from "react";
import axios from "axios";
import "../styles/upload.css";

function DocumentUpload({ onUpload }) {
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [progress, setProgress] = useState(0);

  const API_URL = process.env.REACT_APP_API_URL || "/api";

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(
      (f) => f.type === "application/pdf"
    );

    if (validFiles.length !== selectedFiles.length) {
      setError("Only PDF files are allowed");
    } else {
      setError("");
    }

    setFiles(validFiles);
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setProgress(0);

    if (!title || files.length === 0) {
      setError("Please provide a title and select at least one PDF file");
      return;
    }

    setLoading(true);

    try {
      const uploadPromises = files.map(async (file, index) => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("file", file);

        const response = await axios.post(
          `${API_URL}/documents/upload`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percentCompleted);
            },
          }
        );

        return response.data;
      });

      const results = await Promise.all(uploadPromises);

      onUpload(results);
      setTitle("");
      setFiles([]);
      setSuccess(`${files.length} document(s) uploaded successfully!`);
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Failed to upload one or more documents. Please try again.");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="upload-card h-[70vh]">
      <h2 className="upload-title">📤 Upload New Document(s)</h2>

      {error && <div className="upload-alert error">{error}</div>}
      {success && <div className="upload-alert success">{success}</div>}

      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label>Document Title (applies to all files)</label>
          <input
            type="text"
            value={title}
            className="input-field"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter document title..."
          />
        </div>

        <div className="form-group">
          <label>Select PDF Files</label>
          <div className="file-input-wrapper">
            <input
              id="file-upload"
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload" className="file-upload-label">
              {files.length > 0
                ? `${files.length} file(s) selected`
                : "Click to select PDF files"}
            </label>
          </div>
          {files.length > 0 && (
            <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
              {files.map((f, i) => (
                <li key={i}>{f.name}</li>
              ))}
            </ul>
          )}
        </div>

        {loading && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3 mt-2">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Uploading..." : "Upload Document(s)"}
        </button>
      </form>
    </div>
  );
}

export default DocumentUpload;
