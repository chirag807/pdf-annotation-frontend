import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import PdfDisplay from "../components/PdfDisplay";
import AnnotationPanel from "../components/AnnotationPanel";
import "../styles/pdf-viewer.css";

function PdfViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = process.env.REACT_APP_API_URL || "/api";

  useEffect(() => {
    // fetchDocument();
    fetchAnnotations();
  }, [id]);

  // const fetchDocument = async () => {
  //   try {
  //     const response = await axios.get(`${API_URL}/documents/${id}`);
  //     setDocument(response.data);
  //   } catch (err) {
  //     setError("Failed to load document");
  //     console.error(err);
  //   }
  // };

  const fetchAnnotations = async () => {
    try {
      const response = await axios.get(`${API_URL}/annotations/document/${id}`);
      setAnnotations(response.data.annotations);
      setDocument(response.data.document);
    } catch (err) {
      console.error("Failed to fetch annotations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnnotation = (annotation) => {
    setAnnotations([...annotations, annotation]);
  };
  const handleUpdateAnnotation = (updatedAnn) => {
    // setAnnotations((prev) => prev.map((a) => (a._id === updatedAnn._id ? updatedAnn : a)));
    fetchAnnotations();
  };

  const handleDeleteAnnotation = (id) => {
    setAnnotations((prev) => prev.filter((a) => a._id !== id));
  };
  if (loading) return <div className="loading">Loading PDF...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!document) return <div className="error-message">Document not found</div>;

  return (
    <div className="pdf-viewer">
      <Navbar />
      <div className="viewer-container ">
        <div className="pdf-section">
          <PdfDisplay document={document} />
        </div>
        <div className="annotation-section bg-gradient-to-br from-gray-50 to-blue-100">
          <AnnotationPanel
            document={document}
            annotations={annotations}
            onAddAnnotation={handleAddAnnotation}
            onUpdateAnnotation={handleUpdateAnnotation}
            onDeleteAnnotation={handleDeleteAnnotation}
          />
        </div>
      </div>
    </div>
  );
}

export default PdfViewer;
