import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchGallery, uploadImage, likeImage } from '../services/api';
import { BACKEND_URL } from '../config';

// ─── Skeleton loader for initial fetch ───────────────────────────────────────
const SkeletonCard = () => (
  <div style={{
    borderRadius: 12,
    overflow: 'hidden',
    background: '#f0f0f0',
    animation: 'pulse 1.4s ease-in-out infinite',
  }}>
    <div style={{ height: 180, background: '#e0e0e0' }} />
    <div style={{ padding: '12px 14px' }}>
      <div style={{ height: 14, width: '60%', background: '#e0e0e0', borderRadius: 6, marginBottom: 8 }} />
      <div style={{ height: 12, width: '40%', background: '#e0e0e0', borderRadius: 6 }} />
    </div>
  </div>
);

// ─── Toast notification ───────────────────────────────────────────────────────
const Toast = ({ message, type }) => {
  if (!message) return null;
  const bg = type === 'error' ? '#e53e3e' : type === 'success' ? '#276749' : '#1a202c';
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      background: bg, color: '#fff', padding: '10px 18px',
      borderRadius: 8, fontSize: 13, fontWeight: 500,
      boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
      animation: 'slideUp 0.2s ease',
    }}>
      {message}
    </div>
  );
};

// ─── Lightbox ─────────────────────────────────────────────────────────────────
const Lightbox = ({ images, currentIndex, onClose, onPrev, onNext }) => {
  const img = images[currentIndex];
  if (!img) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Viewing: ${img.title}`}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.88)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Close lightbox"
        style={navBtnStyle({ position: 'absolute', top: 20, right: 20 })}
      >✕</button>

      {/* Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        aria-label="Previous image"
        style={navBtnStyle({ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' })}
      >‹</button>

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        aria-label="Next image"
        style={navBtnStyle({ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)' })}
      >›</button>

      {/* Content */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 14,
          overflow: 'hidden', maxWidth: 680, width: '92%',
          boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
        }}
      >
        <img
          src={`${BACKEND_URL}${img.imageUrl}`}
          alt={img.title}
          onError={(e) => { e.target.src = 'https://placehold.co/680x400/1a1a2e/c9a227?text=Image+not+found'; }}
          style={{ width: '100%', maxHeight: 420, objectFit: 'contain', display: 'block', background: '#f7f7f7' }}
        />
        <div style={{ padding: '16px 20px' }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>{img.title}</h3>
          {img.description && (
            <p style={{ margin: '6px 0 0', fontSize: 13, color: '#666' }}>{img.description}</p>
          )}
          <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 13, color: '#888' }}>
            <span>❤️ {img.likes}</span>
            <span>👁️ {img.views}</span>
            <span>📅 {new Date(img.date).toLocaleDateString()}</span>
            <span>👤 {img.uploadedBy || 'Fan'}</span>
          </div>
          <p style={{ margin: '10px 0 0', fontSize: 12, color: '#bbb', textAlign: 'right' }}>
            {currentIndex + 1} / {images.length}
          </p>
        </div>
      </div>
    </div>
  );
};

const navBtnStyle = (extra = {}) => ({
  background: 'rgba(255,255,255,0.15)',
  border: 'none', color: '#fff',
  fontSize: 24, cursor: 'pointer',
  width: 42, height: 42, borderRadius: '50%',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  backdropFilter: 'blur(4px)',
  transition: 'background 0.15s',
  ...extra,
});

// ─── Upload Zone ──────────────────────────────────────────────────────────────
const UploadZone = ({ onFileSelect }) => {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) onFileSelect(file);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Click or drag to upload an image"
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      style={{
        border: `2px dashed ${dragging ? '#667eea' : '#ccc'}`,
        borderRadius: 12, padding: '32px 24px',
        textAlign: 'center', cursor: 'pointer',
        background: dragging ? '#f0f4ff' : '#fafafa',
        transition: 'all 0.15s',
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 8 }}>📸</div>
      <p style={{ margin: 0, fontWeight: 500, color: '#444' }}>Click or drag an image here</p>
      <p style={{ margin: '4px 0 0', fontSize: 12, color: '#aaa' }}>JPG, PNG, WEBP supported</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => { const f = e.target.files[0]; if (f) onFileSelect(f); }}
      />
    </div>
  );
};

// ─── Gallery Card ─────────────────────────────────────────────────────────────
const GalleryCard = ({ img, index, onOpen, onLike }) => (
  <article
    role="button"
    tabIndex={0}
    aria-label={`View ${img.title}`}
    onClick={() => onOpen(index)}
    onKeyDown={(e) => { if (e.key === 'Enter') onOpen(index); }}
    style={{
      borderRadius: 12, overflow: 'hidden',
      background: '#fff', border: '1px solid #eee',
      cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s',
      outline: 'none',
    }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
  >
    <img
      src={`${BACKEND_URL}${img.imageUrl}`}
      alt={img.title}
      loading="lazy"
      onError={(e) => { e.target.src = 'https://placehold.co/400x250/1a1a2e/c9a227?text=Image+not+found'; }}
      style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
    />
    <div style={{ padding: '12px 14px' }}>
      <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {img.title}
      </h4>
      <div style={{ display: 'flex', gap: 10, marginTop: 8, fontSize: 12, color: '#888', flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          aria-label={`Like ${img.title}, currently ${img.likes} likes`}
          onClick={(e) => { e.stopPropagation(); onLike(img._id); }}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 0, fontSize: 12, color: '#e05',
            display: 'flex', alignItems: 'center', gap: 3,
          }}
        >
          ❤️ {img.likes}
        </button>
        <span>👁️ {img.views}</span>
        <span>📅 {new Date(img.date).toLocaleDateString()}</span>
        <span>👤 {img.uploadedBy || 'Fan'}</span>
      </div>
      {img.description && (
        <p style={{ margin: '8px 0 0', fontSize: 12, color: '#999', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {img.description}
        </p>
      )}
    </div>
  </article>
);

// ─── Main GalleryPage ─────────────────────────────────────────────────────────
const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'info' }), duration);
  }, []);

  const revokePreview = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  // ── Data fetching ─────────────────────────────────────────────────────────────
  const loadGallery = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchGallery();
      setImages(data.data || []);
    } catch (err) {
      setError('Failed to load gallery. Please try again.');
      console.error('[GalleryPage] loadGallery failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  // ── File selection ────────────────────────────────────────────────────────────
  const handleFileSelect = useCallback((file) => {
    revokePreview();
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  }, [revokePreview]);

  const handleCancelUpload = useCallback(() => {
    revokePreview();
    setSelectedFile(null);
    setPreview(null);
  }, [revokePreview]);

  // ── Upload ────────────────────────────────────────────────────────────────────
  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('data', JSON.stringify({
      title: 'Fan Memory',
      description: 'Shared from gallery',
      uploadedBy: 'Fan',
    }));
    try {
      await uploadImage(formData);
      await loadGallery();
      handleCancelUpload();
      showToast('Memory shared successfully! 🎉', 'success');
    } catch (err) {
      console.error('[GalleryPage] Upload failed:', err);
      showToast('Upload failed. Please try again.', 'error');
    } finally {
      setUploading(false);
    }
  };

  // ── Like (optimistic update) ──────────────────────────────────────────────────
  const handleLike = useCallback(async (id) => {
    // Optimistic: update immediately, revert on failure
    setImages((prev) =>
      prev.map((img) => img._id === id ? { ...img, likes: img.likes + 1 } : img)
    );
    try {
      await likeImage(id);
    } catch (err) {
      console.error('[GalleryPage] Like failed:', err);
      // Revert
      setImages((prev) =>
        prev.map((img) => img._id === id ? { ...img, likes: img.likes - 1 } : img)
      );
      showToast('Could not save like. Try again.', 'error');
    }
  }, [showToast]);

  // ── Lightbox ──────────────────────────────────────────────────────────────────
  const openLightbox = useCallback((index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  }, []);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  // Keyboard navigation — stable ref avoids stale closures
  const lightboxRef = useRef({ open: false, goPrev: null, goNext: null, close: null });
  useEffect(() => {
    lightboxRef.current = { open: lightboxOpen, goPrev, goNext, close: closeLightbox };
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxRef.current.open) return;
      if (e.key === 'ArrowLeft') lightboxRef.current.goPrev();
      if (e.key === 'ArrowRight') lightboxRef.current.goNext();
      if (e.key === 'Escape') lightboxRef.current.close();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ── Cleanup object URLs on unmount ────────────────────────────────────────────
  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="gallery-page">
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
        @keyframes slideUp { from{transform:translateY(12px);opacity:0} to{transform:translateY(0);opacity:1} }
        .gallery-page * { box-sizing: border-box; }
      `}</style>

      <Toast message={toast.message} type={toast.type} />

      {/* ── Upload Section ── */}
      <div className="upload-section" style={{ marginBottom: 32 }}>
        <UploadZone onFileSelect={handleFileSelect} />

        {preview && (
          <div className="upload-preview" style={{
            marginTop: 16, borderRadius: 12, overflow: 'hidden',
            border: '1px solid #eee', background: '#fff',
          }}>
            <img
              src={preview}
              alt="Upload preview"
              style={{ width: '100%', maxHeight: 260, objectFit: 'cover', display: 'block' }}
            />
            <div className="preview-actions" style={{ display: 'flex', gap: 10, padding: '12px 16px' }}>
              <button
                onClick={handleUpload}
                disabled={uploading}
                style={primaryBtnStyle}
              >
                {uploading ? 'Uploading…' : 'Share Memory'}
              </button>
              <button
                onClick={handleCancelUpload}
                disabled={uploading}
                style={secondaryBtnStyle}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Gallery Grid ── */}
      {loading ? (
        <div style={gridStyle}>
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#e53e3e' }}>
          <p style={{ fontSize: 15, margin: 0 }}>{error}</p>
          <button onClick={loadGallery} style={{ ...primaryBtnStyle, marginTop: 16 }}>Retry</button>
        </div>
      ) : (
        <div className="gallery-grid" style={gridStyle}>
          {images.length === 0 ? (
            <p className="no-images" style={{
              gridColumn: '1 / -1', textAlign: 'center',
              color: '#aaa', fontSize: 15, padding: '48px 0',
            }}>
              No memories yet. Be the first to upload! 📷
            </p>
          ) : (
            images.map((img, idx) => (
              <GalleryCard
                key={img._id}
                img={img}
                index={idx}
                onOpen={openLightbox}
                onLike={handleLike}
              />
            ))
          )}
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <Lightbox
          images={images}
          currentIndex={currentIndex}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </div>
  );
};

// ─── Shared styles ────────────────────────────────────────────────────────────
const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  gap: 16,
};

const primaryBtnStyle = {
  padding: '9px 20px', borderRadius: 8,
  background: '#1a1a2e', color: '#fff',
  border: 'none', cursor: 'pointer',
  fontSize: 13, fontWeight: 600,
  transition: 'opacity 0.15s',
};

const secondaryBtnStyle = {
  padding: '9px 20px', borderRadius: 8,
  background: '#f0f0f0', color: '#333',
  border: 'none', cursor: 'pointer',
  fontSize: 13, fontWeight: 500,
};

export default GalleryPage;