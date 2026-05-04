import { useState, useEffect } from "react";
import { fetchGallery, uploadImage, likeImage } from "../services/api";
import { BACKEND_URL } from "../config";

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadGallery = () => {
    setLoading(true);
    fetchGallery()
      .then((data) => setImages(data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append(
      "data",
      JSON.stringify({
        title: "Fan Memory",
        description: "Shared from gallery",
        uploadedBy: "Fan",
      }),
    );
    try {
      await uploadImage(formData);
      await loadGallery();
      setSelectedFile(null);
      setPreview(null);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const handleLike = async (id) => {
    await likeImage(id);
    loadGallery(); // refresh likes count
  };

  if (loading) return <div className="loader"></div>;

  return (
    <div className="gallery-page">
      <div className="upload-section">
        <div
          className="upload-card"
          onClick={() => document.getElementById("galleryFileInput").click()}
        >
          📸 Click to upload a memory
          <input
            id="galleryFileInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
        {preview && (
          <div className="upload-preview">
            <img src={preview} alt="Preview" />
            <div className="preview-actions">
              <button onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Share Memory"}
              </button>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setPreview(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="gallery-grid">
        {images.length === 0 && (
          <p className="no-images">No memories yet. Be the first to upload!</p>
        )}
        {images.map((img) => (
          <div key={img._id} className="gallery-card">
            <img
              src={`${BACKEND_URL}${img.imageUrl}`}
              alt={img.title}
              onError={(e) =>
                (e.target.src =
                  "https://placehold.co/400x250/1a1a2e/c9a227?text=Image+not+found")
              }
            />
            <div className="card-info">
              <h4>{img.title}</h4>
              <div className="card-meta">
                <span
                  onClick={() => handleLike(img._id)}
                  style={{ cursor: "pointer" }}
                >
                  ❤️ {img.likes}
                </span>
                <span>👁️ {img.views}</span>
                <span>📅 {new Date(img.date).toLocaleDateString()}</span>
                <span>👤 {img.uploadedBy || "Fan"}</span>
              </div>
              {img.description && (
                <p className="card-desc">{img.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;
