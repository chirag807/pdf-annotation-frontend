import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import DocumentUpload from "../components/DocumentUpload";
import DocumentList from "../components/DocumentList";
import "../styles/dashboard-layout.css"; // new CSS
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const API_URL = process.env.REACT_APP_API_URL || "/api";

  useEffect(() => {
    fetchDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${API_URL}/documents`);
      setDocuments(response.data || []);
      setError("");
    } catch (err) {
      setError("Failed to fetch documents");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = (newDocument) => {
    fetchDocuments();
  };

  return (
    <div className="dashboard-page h-full">
      <Navbar />

      <main className="flex-1 mx-auto px-6 w-full bg-gradient-to-br from-gray-100 to-blue-200">
        <div className="dashboard-main">
          <div className="left-column">
            <div className="left-pane-header">
              <h2>📚 Documents</h2>
              <p className="muted">Manage and view uploaded PDFs</p>
            </div>

            <div className="left-pane-content max-h-[62vh]">
              {error && <div className="alert error">{error}</div>}

              {loading ? (
                <div className="center-loading">
                  <div className="spinner" />
                  <span>Loading documents...</span>
                </div>
              ) : (
                <DocumentList documents={documents} />
              )}
            </div>
          </div>
          {user && user.role == "admin" && (
            <div className="right-column">
              <div className="right-card-wrapper">
                <DocumentUpload onUpload={handleUpload} />
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className=" mt-auto py-6 text-center text-gray-400 text-sm border-t border-gray-200 bg-white">
        © {new Date().getFullYear()} PDF Annotate. All rights reserved.
      </footer>
    </div>
  );
}

export default Dashboard;
