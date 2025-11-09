import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || "/api";

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/stats`);
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/users`);
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.patch(`${API_URL}/admin/users/${userId}/role`, {
        role: newRole,
      });
      fetchUsers();
    } catch (err) {
      console.error("Failed to update user role:", err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${API_URL}/admin/users/${userId}`);
        fetchUsers();
      } catch (err) {
        console.error("Failed to delete user:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-gray-100 to-blue-200 p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Admin Dashboard
        </h1>

        <div className="flex space-x-4 border-b border-gray-300 mb-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 text-lg font-medium transition-all ${
              activeTab === "overview"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 text-lg font-medium transition-all ${
              activeTab === "users"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            Users
          </button>
        </div>

        {activeTab === "overview" && stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Total Users", value: stats.totalUsers },
              { title: "Total Documents", value: stats.totalDocuments },
              { title: "Total Annotations", value: stats.totalAnnotations },
              { title: "Active Users", value: stats.activeUsers },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all"
              >
                <h3 className="text-gray-600 font-medium mb-2">{item.title}</h3>
                <p className="text-3xl font-bold text-blue-600">{item.value}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "users" && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mt-4">
            {loading ? (
              <div className="p-6 text-center text-gray-500">
                Loading users...
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="px-6 py-3 font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="px-6 py-3 font-semibold text-gray-700">
                      Role
                    </th>
                    <th className="px-6 py-3 font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, i) => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3">{user.name}</td>
                      <td className="px-6 py-3">{user.email}</td>
                      <td className="px-6 py-3">
                        <select
                          value={user.role}
                          disabled={user.role == "admin"}
                          onChange={(e) =>
                            handleRoleChange(user._id, e.target.value)
                          }
                          className="border border-gray-300 rounded-md px-3 py-1 focus:ring focus:ring-blue-200"
                        >
                          <option value="viewer">Viewer</option>
                          <option value="reviewer">Reviewer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-3">
                        <button
                          disabled={user.role === "admin"}
                          onClick={() => handleDeleteUser(user._id)}
                          className={`bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow-sm transition-all ${
                            user.role == "admin" && "cursor-not-allowed"
                          }`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
