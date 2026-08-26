import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ username: "", email: "", branch: "" });

  // ✅ Get admin token config
  const getConfig = () => {
    const token = localStorage.getItem("adminToken");
    return {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchUsers = async () => {
    try {
      const config = getConfig();
      console.log("Fetching users with config:", config);
      const { data } = await axios.get(`${API_BASE}/admin/users`, config);
      console.log("Fetched users:", data);

      if (data.success) setUsers(data.users || []);
      else alert(data.message || "Failed to fetch users");
    } catch (err) {
      console.error("fetch users error", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const startEdit = (user) => {
    setEditingId(user._id);
    setForm({
      username: user.username || "",
      email: user.email || "",
      branch: user.branch || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ username: "", email: "", branch: "" });
  };

  const saveEdit = async (id) => {
    try {
      const { data } = await axios.put(
        `${API_BASE}/admin/users/${id}`,
        form,
        getConfig()
      );
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? data.user : u))
        );
        setEditingId(null);
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.error("update user error", err.response?.data || err.message);
      alert("Update failed");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`${API_BASE}/admin/users/${id}`, getConfig());
      setUsers((p) => p.filter((u) => u._id !== id));
    } catch (err) {
      console.error("delete user error", err.response?.data || err.message);
      alert("Delete failed");
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: 22, marginBottom: 12 }}>Manage Users</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ background: "#f3f4f6" }}>
          <tr>
            <th style={th}>Username</th>
            <th style={th}>Email</th>
            <th style={th}>Branch</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: 20 }}>
                No users found
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u._id}>
                <td style={td}>
                  {editingId === u._id ? (
                    <input
                      value={form.username}
                      onChange={(e) =>
                        setForm({ ...form, username: e.target.value })
                      }
                    />
                  ) : (
                    u.username
                  )}
                </td>
                <td style={td}>
                  {editingId === u._id ? (
                    <input
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  ) : (
                    u.email
                  )}
                </td>
                <td style={td}>
                  {editingId === u._id ? (
                    <input
                      value={form.branch}
                      onChange={(e) =>
                        setForm({ ...form, branch: e.target.value })
                      }
                    />
                  ) : (
                    u.branch
                  )}
                </td>
                <td style={td}>
                  {editingId === u._id ? (
                    <>
                      <button
                        onClick={() => saveEdit(u._id)}
                        style={btnPrimary}
                      >
                        Save
                      </button>{" "}
                      <button onClick={cancelEdit} style={btnSecondary}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(u)}
                        style={btnPrimary}
                      >
                        Edit
                      </button>{" "}
                      <button
                        onClick={() => deleteUser(u._id)}
                        style={btnDanger}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const th = {
  padding: 8,
  textAlign: "left",
  borderBottom: "1px solid #e5e7eb",
};
const td = {
  padding: 8,
  borderBottom: "1px solid #eee",
  verticalAlign: "middle",
};
const btnPrimary = {
  background: "#0ea5e9",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
  cursor: "pointer",
};
const btnSecondary = {
  background: "#6b7280",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
  cursor: "pointer",
};
const btnDanger = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
  cursor: "pointer",
};

export default ManageUsers;
