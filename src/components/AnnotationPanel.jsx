import { useState } from "react";
import axios from "axios";
import "../styles/annotation.css";
import { useAuth } from "../context/AuthContext";
import { Pencil, Trash2 } from "lucide-react";

function AnnotationPanel({
  document,
  annotations,
  onAddAnnotation,
  onUpdateAnnotation,
  onDeleteAnnotation,
}) {
  const [content, setContent] = useState("");
  const [type, setType] = useState("comment");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const { user } = useAuth();

  const API_URL = process.env.REACT_APP_API_URL || "/api";

  const handleAddAnnotation = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/annotations`, {
        document: document._id,
        page: 1,
        type,
        content,
        color: "#FFFF00",
      });

      onAddAnnotation(response.data);
      setContent("");
      setType("comment");
    } catch (err) {
      console.error("Failed to add annotation:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAnnotation = (annotation) => {
    setEditingId(annotation._id);
    setEditContent(annotation.content);
  };

  const handleSaveEdit = async (id, updatedBy) => {
    if (!editContent.trim()) return;
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/annotations/${id}`, {
        content: editContent,
        userId: updatedBy,
      });
      onUpdateAnnotation(response.data);
      setEditingId(null);
      setEditContent("");
    } catch (err) {
      console.error("Failed to update annotation:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleDeleteAnnotation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this annotation?"))
      return;

    try {
      await axios.delete(`${API_URL}/annotations/${id}`);
      onDeleteAnnotation(id);
    } catch (err) {
      console.error("Failed to delete annotation:", err);
    }
  };

  return (
    <div className="annotation-panel">
      <h2 className="text-red-950">Annotations</h2>

      {user && user.role !== "viewer" && (
        <form onSubmit={handleAddAnnotation} className="annotation-form">
          <div className="form-group">
            <label>Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="comment">Comment</option>
              <option value="highlight">Highlight</option>
              <option value="drawing">Drawing</option>
            </select>
          </div>

          <div className="form-group">
            <label>Add Annotation</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your annotation..."
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Adding..." : "Add Annotation"}
          </button>
        </form>
      )}

      <div className="annotations-list">
        {annotations.length === 0 ? (
          <p>No annotations yet</p>
        ) : (
          annotations.map((ann) => (
            <div
              key={ann._id}
              className="annotation-item border p-3 rounded mb-3"
            >
              <p className="text-sm text-gray-700">
                <strong className="text-gray-900">{ann.user?.name}</strong>
                {ann.updatedBy ? (
                  <>
                    {" "}
                    →{" "}
                    <span className="text-blue-600 font-medium">
                      {ann.updatedBy?.name}
                    </span>
                  </>
                ) : null}
                <span className="text-gray-400 ml-2">
                  ({new Date(ann.createdAt).toLocaleDateString()})
                </span>
              </p>

              {editingId === ann._id ? (
                <div className="edit-mode mt-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                    className="w-full border p-2 rounded"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      className="p-1 rounded-md w-20 btn-primary"
                      onClick={() => handleSaveEdit(ann._id, user.id)}
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                    <button
                      className="p-1 rounded-md w-20 btn-secondary"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="mt-2">{ann.content}</p>

                  {user &&
                    (() => {
                      const isOwner = user.id === ann.user._id;
                      const isAdmin = user.role === "admin";

                      const canEditOrDelete =
                        (isOwner && user.role !== "viewer") || isAdmin;

                      return (
                        canEditOrDelete && (
                          <div className="annotation-actions flex justify-end gap-2 mt-2">
                            <button
                              className="p-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
                              title="Edit Annotation"
                              onClick={() => handleEditAnnotation(ann)}
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
                              title="Delete Annotation"
                              onClick={() => handleDeleteAnnotation(ann._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )
                      );
                    })()}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AnnotationPanel;
