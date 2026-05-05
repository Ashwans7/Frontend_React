import { useState, useRef } from "react";
import Navbar from "../Components/NavBar";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [data, setData] = useState({
    title: "",
    subtitle: "",
    description: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name } = e.target;
    setData({
      ...data,
      [name]: name === "image" ? e.target.files[0] : e.target.value,
    });
  };

 const editBlog = async (e) => {
  e.preventDefault();

  if (!data.title || !data.subtitle || !data.description) {
    alert("All fields are required");
    return;
  }

  const response = await axios.patch(
    "http://localhost:3000/blog/" + id,
    data,
    { headers: { "Content-type": "multipart/form-data" } }
  );

  if (response) navigate("/");
};

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f7f4", fontFamily: "'Georgia', serif" }}>
      <Navbar />
      <div style={{ maxWidth: "680px", margin: "48px auto", padding: "0 24px 64px" }}>

        {/* Header */}
        <div style={{ marginBottom: "36px" }}>
          <p style={{ fontSize: "13px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#9a8f7e", marginBottom: "8px" }}>
            Edit a Blog
          </p>
          <h1 style={{ fontSize: "36px", fontWeight: "400", color: "#1a1814", lineHeight: "1.2", margin: "0" }}>
            Wanna Edit A Blog?
          </h1>
        </div>

        <form onSubmit={editBlog}>

          {/* Title */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", color: "#6b6355", marginBottom: "8px" }}>Title</label>
            <input
              type="text"
              name="title"
              placeholder="Your blog title..."
              value={data.title}
              onChange={handleChange}
              style={{ width: "100%", padding: "12px 14px", fontSize: "15px", border: "1.5px solid #d6d0c4", borderRadius: "8px", backgroundColor: "#faf9f6", boxSizing: "border-box" }}
            />
          </div>

          {/* Subtitle */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", color: "#6b6355", marginBottom: "8px" }}>Subtitle</label>
            <input
              type="text"
              name="subtitle"
              placeholder="A short tagline or hook..."
              value={data.subtitle}
              onChange={handleChange}
              style={{ width: "100%", padding: "12px 14px", fontSize: "15px", border: "1.5px solid #d6d0c4", borderRadius: "8px", backgroundColor: "#faf9f6", boxSizing: "border-box" }}
            />
          </div>

          {/* Image Upload */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", color: "#6b6355", marginBottom: "8px" }}>Cover Image</label>
            <div
              onClick={() => fileInputRef.current.click()}
              style={{ border: "1.5px dashed #c8c0b4", borderRadius: "10px", height: "160px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "8px", backgroundColor: "#faf9f6", cursor: "pointer" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9a8f7e" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="3"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <span style={{ fontSize: "13px", color: "#9a8f7e" }}>
                {data.image ? data.image.name : "Click to upload image"}
              </span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              style={{ display: "none" }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: "28px" }}>
            <label style={{ display: "block", fontSize: "13px", color: "#6b6355", marginBottom: "8px" }}>Description</label>
            <textarea
              name="description"
              placeholder="Write your blog content here..."
              value={data.description}
              onChange={handleChange}
              rows={8}
              style={{ width: "100%", padding: "12px 14px", fontSize: "15px", border: "1.5px solid #d6d0c4", borderRadius: "8px", backgroundColor: "#faf9f6", boxSizing: "border-box", resize: "vertical", lineHeight: "1.7" }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              type="submit"
              style={{ padding: "13px 32px", backgroundColor: "#1a1814", color: "#fff", border: "none", borderRadius: "8px", fontSize: "15px", cursor: "pointer" }}
            >
              Update post
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              style={{ padding: "13px 24px", backgroundColor: "transparent", color: "#9a8f7e", border: "1px solid #d6d0c4", borderRadius: "8px", fontSize: "15px", cursor: "pointer" }}
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EditBlog;