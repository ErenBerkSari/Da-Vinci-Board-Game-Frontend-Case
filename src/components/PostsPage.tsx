import { useEffect, useState } from "react";
import { getPosts } from "../services/api";
import type { Post } from "../types";
import "../css/PostsPage.css";

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState<Post>({
    userId: 1,
    id: 0,
    title: "",
    body: "",
  });
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; post: Post | null }>({
    show: false,
    post: null
  });

  // İlk yüklemede postları getir
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await getPosts();
        setPosts(data);
      } catch (error) {
        addToast("Postlar yüklenirken hata oluştu!", "error");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  // Toast ekleme fonksiyonu
  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now();
    const newToast: Toast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
    
    // 3 saniye sonra toast'ı kaldır
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  // Toast kaldırma fonksiyonu
  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Post ekle
  const addPost = () => {
    if (!newPost.title.trim()) {
      addToast("Lütfen başlık alanını doldurun!", "error");
      return;
    }

    // Karakter sınırı kontrolleri
    if (newPost.title.length > 150) {
      addToast("Başlık en fazla 150 karakter olabilir!", "error");
      return;
    }

    const newId = posts.length > 0 ? Math.max(...posts.map((p) => p.id)) + 1 : 1;

    setPosts([...posts, { ...newPost, id: newId }]);
    setNewPost({ userId: 1, id: 0, title: "", body: "" });
    addToast(`"${newPost.title}" başarıyla eklendi!`, "success");
  };

  // Silme onayı gösterme
  const showDeleteConfirm = (post: Post) => {
    setDeleteConfirm({ show: true, post });
  };

  // Silme onayını kapatma
  const hideDeleteConfirm = () => {
    setDeleteConfirm({ show: false, post: null });
  };

  // Post silme (onaylandıktan sonra)
  const confirmDeletePost = () => {
    if (deleteConfirm.post) {
      const postToDelete = deleteConfirm.post;
      setPosts(posts.filter((p) => p.id !== postToDelete.id));
      addToast(`"${postToDelete.title}" başarıyla silindi!`, "success");
      hideDeleteConfirm();
    }
  };

  // Post düzenlemeye başla
  const startEdit = (post: Post) => {
    setEditingPost({ ...post });
  };

  // Düzenlemeyi kaydet
  const saveEdit = () => {
    if (editingPost) {
      // Validasyon kontrolü
      if (!editingPost.title.trim()) {
        addToast("Lütfen başlık alanını doldurun!", "error");
        return;
      }

      // Karakter sınırı kontrolleri
      if (editingPost.title.length > 150) {
        addToast("Başlık en fazla 150 karakter olabilir!", "error");
        return;
      }

      setPosts(posts.map((p) => (p.id === editingPost.id ? editingPost : p)));
      addToast(`"${editingPost.title}" başarıyla güncellendi!`, "success");
      setEditingPost(null);
    }
  };

  // Düzenlemeyi iptal et
  const cancelEdit = () => {
    setEditingPost(null);
    addToast("Düzenleme iptal edildi", "info");
  };

  // Enter tuşu ile kaydetme
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // Arama kutusunu temizle
  const clearSearch = () => {
    setSearchTerm("");
  };

  // Arama terimine göre filtreleme
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm) ||
      post.userId.toString().includes(searchTerm)
  );

  return (
    <div
      style={{
        color: "#566787",
        background: "#f7f5f2",
        fontFamily: "Roboto, sans-serif",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast-${toast.type}`}
            onClick={() => removeToast(toast.id)}
          >
            <div className="toast-content">
              <span className="toast-icon">
                {toast.type === 'success' && '✅'}
                {toast.type === 'error' && '❌'}
                {toast.type === 'info' && 'ℹ️'}
              </span>
              <span className="toast-message">{toast.message}</span>
            </div>
            <button 
              className="toast-close"
              onClick={(e) => {
                e.stopPropagation();
                removeToast(toast.id);
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="modal-overlay" onClick={hideDeleteConfirm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Postu Sil</h3>
              <button className="modal-close" onClick={hideDeleteConfirm}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="warning-icon">⚠️</div>
              <p>
                <strong>"{deleteConfirm.post?.title}"</strong> postunu silmek istediğinizden emin misiniz?
              </p>
              
            </div>
            <div className="modal-footer">
              <button 
                className="btn-cancel" 
                onClick={hideDeleteConfirm}
              >
                İptal
              </button>
              <button 
                className="btn-delete" 
                onClick={confirmDeletePost}
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="main-container">
        <div className="table-responsive">
          <div className="table-wrapper">
            {/* Table Title */}
            <div className="table-title">
              <h2>
                Post <b>Yönetimi</b>
              </h2>
              <div className="search-box">
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Post ara..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="form-control"
                  />
                  <span 
                    className={`input-group-addon ${searchTerm ? 'clearable' : ''}`}
                    onClick={clearSearch}
                    style={{ cursor: searchTerm ? 'pointer' : 'default' }}
                    title={searchTerm ? 'Aramayı temizle' : 'Ara'}
                  >
                    {searchTerm ? '✕' : '🔍'}
                  </span>
                </div>
              </div>
            </div>

            {/* Add New Post Form */}
            <div className="add-post-form">
              <h4>
                Yeni Post Ekle
              </h4>
              <div className="form-grid">
                <input
                  placeholder="User ID"
                  type="number"
                  value={newPost.userId}
                  onChange={(e) => setNewPost({ ...newPost, userId: parseInt(e.target.value) || 1 })}
                />
                <input
                  placeholder="Başlık"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  maxLength={150}
                />
                <button
                  onClick={addPost}
                  className="add-btn"
                >
                  Ekle
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="table-container">
              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p className="loading-text">Postlar yükleniyor...</p>
                </div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User ID</th>
                      <th>Başlık</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPosts.map((post) => (
                      <tr 
                        key={post.id}
                        className={editingPost?.id === post.id ? 'editing' : ''}
                      >
                        <td>#{post.id}</td>
                        <td>
                          {editingPost?.id === post.id ? (
                            <input
                              type="number"
                              value={editingPost.userId}
                              onChange={(e) =>
                                setEditingPost({ ...editingPost, userId: parseInt(e.target.value) || 1 })
                              }
                              className="edit-input"
                              placeholder="User ID"
                            />
                          ) : (
                            post.userId
                          )}
                        </td>
                        <td>
                          {editingPost?.id === post.id ? (
                            <input
                              value={editingPost.title}
                              onChange={(e) =>
                                setEditingPost({ ...editingPost, title: e.target.value })
                              }
                              onKeyDown={handleKeyPress}
                              className="edit-input"
                              placeholder="Başlık"
                              autoFocus
                              maxLength={150}
                            />
                          ) : (
                            <span style={{ fontWeight: "500" }}>{post.title}</span>
                          )}
                        </td>
                        <td>
                          {editingPost?.id === post.id ? (
                            <div className="action-buttons">
                              <button
                                onClick={saveEdit}
                                className="save-btn"
                                title="Kaydet (Ctrl+Enter)"
                              >
                                Kaydet
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="cancel-btn"
                                title="İptal (Esc)"
                              >
                                İptal
                              </button>
                            </div>
                          ) : (
                            <div className="action-buttons">
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  startEdit(post);
                                }}
                                className="action-btn edit"
                                title="Düzenle"
                              >
                                ✏️
                              </a>
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  showDeleteConfirm(post);
                                }}
                                className="action-btn delete"
                                title="Sil"
                              >
                                🗑️
                              </a>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {!loading && filteredPosts.length === 0 && (
              <div className="empty-state">
                {searchTerm
                  ? "Arama kriterinize uygun post bulunamadı."
                  : "Henüz post bulunmuyor."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostsPage;