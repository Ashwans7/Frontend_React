import { useState, useRef } from "react";
import Navbar from "../Components/NavBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateBlog() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [data, setData] = useState({
    title: "",
    subtitle: "",
    image: null,
    description: "",
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setData({ ...data, image: file });
      if (file) {
        setPreview(URL.createObjectURL(file));
      }
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!data.title.trim()) return setError("Title is required.");
    if (!data.subtitle.trim()) return setError("Subtitle is required.");
    if (!data.image) return setError("Please upload an image.");
    if (!data.description.trim()) return setError("Description is required.");

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("subtitle", data.subtitle);
    formData.append("description", data.description);
    formData.append("image", data.image);

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3000/blog", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (<> <div style={{ minHeight: "100vh", backgroundColor: "#f8f7f4", fontFamily: "'Georgia', serif" }}>
      <Navbar />

      <div style={{ maxWidth: "680px", margin: "48px auto", padding: "0 24px 64px" }}>

        {/* Header */}
        <div style={{ marginBottom: "36px" }}>
          <p style={{ fontSize: "13px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#9a8f7e", marginBottom: "8px" }}>
            New post
          </p>
          <h1 style={{ fontSize: "36px", fontWeight: "400", color: "#1a1814", lineHeight: "1.2", margin: "0" }}>
            Write something worth reading
          </h1>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {/* Title */}
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Title</label>
            <input
              type="text"
              name="title"
              placeholder="Your blog title..."
              value={data.title}
              onChange={handleChange}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#1a1814"}
              onBlur={e => e.target.style.borderColor = "#d6d0c4"}
            />
          </div>

          {/* Subtitle */}
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Subtitle</label>
            <input
              type="text"
              name="subtitle"
              placeholder="A short tagline or hook..."
              value={data.subtitle}
              onChange={handleChange}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#1a1814"}
              onBlur={e => e.target.style.borderColor = "#d6d0c4"}
            />
          </div>

          {/* Image Upload */}
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Cover Image</label>

            {/* Preview area */}
            <div
              onClick={() => fileInputRef.current.click()}
              style={{
                border: "1.5px dashed #c8c0b4",
                borderRadius: "10px",
                overflow: "hidden",
                cursor: "pointer",
                backgroundColor: "#faf9f6",
                transition: "border-color 0.2s",
                height: preview ? "auto" : "160px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "8px",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#1a1814"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#c8c0b4"}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  style={{ width: "100%", maxHeight: "300px", objectFit: "cover", display: "block" }}
                />
              ) : (
                <>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9a8f7e" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="3"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span style={{ fontSize: "13px", color: "#9a8f7e" }}>Click to upload image</span>
                </>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              style={{ display: "none" }}
            />

            {preview && (
              <button
                type="button"
                onClick={() => { setPreview(null); setData({ ...data, image: null }); fileInputRef.current.value = ""; }}
                style={{ marginTop: "8px", fontSize: "12px", color: "#9a8f7e", background: "none", border: "none", cursor: "pointer", padding: "0", textDecoration: "underline" }}
              >
                Remove image
              </button>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: "28px" }}>
            <label style={labelStyle}>Description</label>
            <textarea
              name="description"
              placeholder="Write your blog content here..."
              value={data.description}
              onChange={handleChange}
              rows={8}
              style={{ ...inputStyle, resize: "vertical", lineHeight: "1.7" }}
              onFocus={e => e.target.style.borderColor = "#1a1814"}
              onBlur={e => e.target.style.borderColor = "#d6d0c4"}
            />
          </div>

          {/* Error message */}
          {error && (
            <div style={{
              marginBottom: "20px",
              padding: "12px 16px",
              backgroundColor: "#fef2f2",
              border: "1px solid #fca5a5",
              borderRadius: "8px",
              color: "#b91c1c",
              fontSize: "14px",
            }}>
              {error}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "13px 32px",
                backgroundColor: loading ? "#9a8f7e" : "#1a1814",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "15px",
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.02em",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={e => { if (!loading) e.target.style.backgroundColor = "#2d2926" }}
              onMouseLeave={e => { if (!loading) e.target.style.backgroundColor = "#1a1814" }}
            >
              {loading ? "Publishing..." : "Publish post"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              style={{
                padding: "13px 24px",
                backgroundColor: "transparent",
                color: "#9a8f7e",
                border: "1px solid #d6d0c4",
                borderRadius: "8px",
                fontSize: "15px",
                cursor: "pointer",
                transition: "color 0.2s, border-color 0.2s",
              }}
              onMouseEnter={e => { e.target.style.color = "#1a1814"; e.target.style.borderColor = "#1a1814"; }}
              onMouseLeave={e => { e.target.style.color = "#9a8f7e"; e.target.style.borderColor = "#d6d0c4"; }}
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div> </>
   
  );
}

const labelStyle = {
  display: "block",
  fontSize: "12px",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#7a7163",
  marginBottom: "8px",
  fontFamily: "'Georgia', serif",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  fontSize: "15px",
  border: "1px solid #d6d0c4",
  borderRadius: "8px",
  backgroundColor: "#ffffff",
  color: "#1a1814",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
  fontFamily: "inherit",
};

export default CreateBlog;
