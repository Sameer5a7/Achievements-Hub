import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000";

const ManagePosts = () => {
  const [posts, setPosts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: "", content: "" });

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

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/admin/posts`, getConfig());
      if (data.success) setPosts(data.posts || []);
      else alert("Failed to fetch posts");
    } catch (err) {
      console.error("fetch posts error", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const startEdit = (p) => {
    setEditingId(p._id);
    setForm({ title: p.title || "", content: p.content || "" });
  };

  const saveEdit = async (id) => {
    try {
      const { data } = await axios.put(
        `${API_BASE}/admin/posts/${id}`,
        form,
        getConfig()
      );
      if (data.success) {
        setPosts((prev) => prev.map((x) => (x._id === id ? data.post : x)));
        setEditingId(null);
      } else {
        alert("Update failed");
      }
    } catch (err) {
      console.error("update post error", err.response?.data || err.message);
      alert("Update failed");
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await axios.delete(`${API_BASE}/admin/posts/${id}`, getConfig());
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("delete post error", err.response?.data || err.message);
      alert("Delete failed");
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: 22, marginBottom: 12 }}>Manage Posts</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ background: "#f3f4f6" }}>
          <tr>
            <th style={th}>Title</th>
            <th style={th}>Author</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", padding: 20 }}>
                No posts found
              </td>
            </tr>
          ) : (
            posts.map((p) => (
              <tr key={p._id}>
                <td style={td}>
                  {editingId === p._id ? (
                    <>
                      <input
                        value={form.title}
                        onChange={(e) =>
                          setForm({ ...form, title: e.target.value })
                        }
                        style={{ width: "100%" }}
                      />
                      <textarea
                        value={form.content}
                        onChange={(e) =>
                          setForm({ ...form, content: e.target.value })
                        }
                        style={{ width: "100%", marginTop: 6 }}
                      />
                    </>
                  ) : (
                    <>
                      <strong>{p.title}</strong>
                      <p style={{ marginTop: 4, color: "#555" }}>
                        {p.content?.slice(0, 120)}...
                      </p>
                    </>
                  )}
                </td>
                <td style={td}>{p.author?.username || p.author || "—"}</td>
                <td style={td}>
                  {editingId === p._id ? (
                    <>
                      <button
                        onClick={() => saveEdit(p._id)}
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
                        onClick={() => startEdit(p)}
                        style={btnPrimary}
                      >
                        Edit
                      </button>{" "}
                      <button
                        onClick={() => deletePost(p._id)}
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

export default ManagePosts;
