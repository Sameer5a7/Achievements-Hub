import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000";

const ManageComments = () => {
  const [comments, setComments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [content, setContent] = useState("");

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

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/admin/comments`, getConfig());
      if (data.success) setComments(data.comments || []);
      else alert("Failed to fetch comments");
    } catch (err) {
      console.error("fetch comments error", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const startEdit = (c) => {
    setEditingId(c._id);
    setContent(c.content || "");
  };

  const saveEdit = async (id) => {
    try {
      const { data } = await axios.put(
        `${API_BASE}/admin/comments/${id}`,
        { content },
        getConfig()
      );
      if (data.success) {
        setComments((prev) =>
          prev.map((x) => (x._id === id ? data.comment : x))
        );
        setEditingId(null);
      } else alert("Update failed");
    } catch (err) {
      console.error("update comment error", err.response?.data || err.message);
      alert("Update failed");
    }
  };

  const deleteComment = async (id) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await axios.delete(`${API_BASE}/admin/comments/${id}`, getConfig());
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("delete comment error", err.response?.data || err.message);
      alert("Delete failed");
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: 22, marginBottom: 12 }}>Manage Comments</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ background: "#f3f4f6" }}>
          <tr>
            <th style={th}>User</th>
            <th style={th}>Story</th>
            <th style={th}>Comment</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {comments.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: 20 }}>
                No comments found
              </td>
            </tr>
          ) : (
            comments.map((c) => (
              <tr key={c._id}>
                <td style={td}>{c.author?.username || "—"}</td>
                <td style={td}>{c.story?.title || "—"}</td>
                <td style={td}>
                  {editingId === c._id ? (
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      style={{ width: "100%" }}
                    />
                  ) : (
                    c.content || "—"
                  )}
                </td>
                <td style={td}>
                  {editingId === c._id ? (
                    <>
                      <button
                        onClick={() => saveEdit(c._id)}
                        style={btnPrimary}
                      >
                        Save
                      </button>{" "}
                      <button
                        onClick={() => setEditingId(null)}
                        style={btnSecondary}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(c)}
                        style={btnPrimary}
                      >
                        Edit
                      </button>{" "}
                      <button
                        onClick={() => deleteComment(c._id)}
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

const th = { padding: 8, textAlign: "left", borderBottom: "1px solid #e5e7eb" };
const td = { padding: 8, borderBottom: "1px solid #eee", verticalAlign: "top" };
const btnPrimary = { background: "#0ea5e9", color: "#fff", border: "none", padding: "6px 10px", borderRadius: 6, cursor: "pointer" };
const btnSecondary = { background: "#6b7280", color: "#fff", border: "none", padding: "6px 10px", borderRadius: 6, cursor: "pointer" };
const btnDanger = { background: "#ef4444", color: "#fff", border: "none", padding: "6px 10px", borderRadius: 6, cursor: "pointer" };

export default ManageComments;
