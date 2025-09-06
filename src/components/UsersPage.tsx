import { useEffect, useState } from "react";
import { getUsers } from "../services/api";
import type { User } from "../types";
import "../css/UsersPage.css";

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState<User>({
    id: 0,
    name: "",
    username: "",
    email: "",
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; user: User | null }>({
    show: false,
    user: null
  });
  const [postsModal, setPostsModal] = useState<{ show: boolean; user: User | null; posts: any[] }>({
    show: false,
    user: null,
    posts: []
  });

  // İlk yüklemede kullanıcıları getir
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        addToast("Kullanıcılar yüklenirken hata oluştu!", "error");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
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

  // Kullanıcı ekle
  const addUser = () => {
    if (!newUser.name || !newUser.username || !newUser.email) {
      addToast("Lütfen tüm alanları doldurun!", "error");
      return;
    }

    // Karakter sınırı kontrolleri
    if (newUser.name.length > 30) {
      addToast("Ad Soyad en fazla 30 karakter olabilir!", "error");
      return;
    }
    if (newUser.username.length > 20) {
      addToast("Kullanıcı adı en fazla 20 karakter olabilir!", "error");
      return;
    }
    if (newUser.email.length > 40) {
      addToast("E-posta en fazla 40 karakter olabilir!", "error");
      return;
    }

    const newId =
      users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;

    setUsers([...users, { ...newUser, id: newId }]);
    setNewUser({ id: 0, name: "", username: "", email: "" });
    addToast(`${newUser.name} başarıyla eklendi!`, "success");
  };

  // Silme onayı gösterme
  const showDeleteConfirm = (user: User) => {
    setDeleteConfirm({ show: true, user });
  };

  // Silme onayını kapatma
  const hideDeleteConfirm = () => {
    setDeleteConfirm({ show: false, user: null });
  };

  // Kullanıcı silme (onaylandıktan sonra)
  const confirmDeleteUser = () => {
    if (deleteConfirm.user) {
      const userToDelete = deleteConfirm.user;
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      addToast(`${userToDelete.name} başarıyla silindi!`, "success");
      hideDeleteConfirm();
    }
  };

  // Kullanıcı düzenlemeye başla
  const startEdit = (user: User) => {
    setEditingUser({ ...user }); // Orijinal kullanıcı verisinin kopyasını oluştur
  };

  // Düzenlemeyi kaydet
  const saveEdit = () => {
    if (editingUser) {
      // Validasyon kontrolü
      if (!editingUser.name.trim() || !editingUser.username.trim() || !editingUser.email.trim()) {
        addToast("Lütfen tüm alanları doldurun!", "error");
        return;
      }

      // Karakter sınırı kontrolleri
      if (editingUser.name.length > 30) {
        addToast("Ad Soyad en fazla 30 karakter olabilir!", "error");
        return;
      }
      if (editingUser.username.length > 20) {
        addToast("Kullanıcı adı en fazla 20 karakter olabilir!", "error");
        return;
      }
      if (editingUser.email.length > 40) {
        addToast("E-posta en fazla 40 karakter olabilir!", "error");
        return;
      }

      // Email format kontrolü
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editingUser.email)) {
        addToast("Geçerli bir e-posta adresi girin!", "error");
        return;
      }

      setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)));
      addToast(`${editingUser.name} başarıyla güncellendi!`, "success");
      setEditingUser(null);
    }
  };

  // Düzenlemeyi iptal et
  const cancelEdit = () => {
    setEditingUser(null);
    addToast("Düzenleme iptal edildi", "info");
  };

  // Enter tuşu ile kaydetme
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
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
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm) ||
      user.username.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
  );

  // Kullanıcının postlarını getir
  const fetchUserPosts = async (user: User) => {
    try {
      setLoading(true);
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`);
      const posts = await response.json();
      setPostsModal({ show: true, user, posts });
    } catch (error) {
      addToast("Postlar yüklenirken hata oluştu!", "error");
    } finally {
      setLoading(false);
    }
  };

  // Posts modal'ını kapat
  const closePostsModal = () => {
    setPostsModal({ show: false, user: null, posts: [] });
  };

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
              <h3>Kullanıcıyı Sil</h3>
              <button className="modal-close" onClick={hideDeleteConfirm}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="warning-icon">⚠️</div>
              <p>
                <strong>{deleteConfirm.user?.name}</strong> kullanıcısını silmek istediğinizden emin misiniz?
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
                onClick={confirmDeleteUser}
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Posts Modal */}
      {postsModal.show && (
        <div className="modal-overlay" onClick={closePostsModal}>
          <div className="modal-content posts-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{postsModal.user?.name} - Postları</h3>
              <button className="modal-close" onClick={closePostsModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="posts-list">
                {postsModal.posts.length > 0 ? (
                  postsModal.posts.map((post) => (
                    <div key={post.id} className="post-item">
                      <div className="post-header">
                        <span className="post-id">#{post.id}</span>
                        <span className="post-user-id">User ID: {post.userId}</span>
                      </div>
                      <h4 className="post-title">{post.title}</h4>
                      <p className="post-body">{post.body}</p>
                    </div>
                  ))
                ) : (
                  <div className="empty-posts">
                    <p>Bu kullanıcının henüz postu bulunmuyor.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-cancel" 
                onClick={closePostsModal}
              >
                Kapat
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
                Kullanıcı <b>Yönetimi</b>
              </h2>
              <div className="search-box" id="users-search-box">
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Kullanıcı ara..."
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

            {/* Add New User Form */}
            <div className="add-user-form" id="users-add-form">
              <h4>
                Yeni Kullanıcı Ekle
              </h4>
              <div className="form-grid" id="users-form-grid">
                <input
                  placeholder="Ad Soyad"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  maxLength={30}
                />
                <input
                  placeholder="Kullanıcı Adı"
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                  maxLength={20}
                />
                <input
                  placeholder="E-posta"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  maxLength={40}
                  type="email"
                />
                <button
                  onClick={addUser}
                  className="add-btn"
                  id="users-add-btn"
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
                  <p className="loading-text">Kullanıcılar yükleniyor...</p>
                </div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Ad Soyad</th>
                      <th>Kullanıcı Adı</th>
                      <th>E-posta</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr 
                        key={user.id}
                        className={editingUser?.id === user.id ? 'editing' : ''}
                      >
                        <td>#{user.id}</td>
                        <td>
                          {editingUser?.id === user.id ? (
                            <input
                              value={editingUser.name}
                              onChange={(e) =>
                                setEditingUser({
                                  ...editingUser,
                                  name: e.target.value,
                                })
                              }
                              onKeyDown={handleKeyPress}
                              className="edit-input"
                              autoFocus
                              placeholder="Ad Soyad"
                              maxLength={30}
                            />
                          ) : (
                            <span style={{ fontWeight: "500" }}>{user.name}</span>
                          )}
                        </td>
                        <td>
                          {editingUser?.id === user.id ? (
                            <input
                              value={editingUser.username}
                              onChange={(e) =>
                                setEditingUser({
                                  ...editingUser,
                                  username: e.target.value,
                                })
                              }
                              onKeyDown={handleKeyPress}
                              className="edit-input"
                              placeholder="Kullanıcı Adı"
                              maxLength={20}
                            />
                          ) : (
                            <span style={{ color: "#6c757d" }}>
                              @{user.username}
                            </span>
                          )}
                        </td>
                        <td>
                          {editingUser?.id === user.id ? (
                            <input
                              value={editingUser.email}
                              onChange={(e) =>
                                setEditingUser({
                                  ...editingUser,
                                  email: e.target.value,
                                })
                              }
                              onKeyDown={handleKeyPress}
                              className="edit-input"
                              placeholder="E-posta"
                              type="email"
                              maxLength={40}
                            />
                          ) : (
                            <span style={{ color: "#6c757d" }}>{user.email}</span>
                          )}
                        </td>
                        <td>
                          {editingUser?.id === user.id ? (
                            <div className="action-buttons">
                              <button
                                onClick={saveEdit}
                                className="save-btn"
                                title="Kaydet (Enter)"
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
                                  fetchUserPosts(user);
                                }}
                                className="action-btn posts"
                                title="Postları Görüntüle"
                              >
                                📝
                              </a>
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  startEdit(user);
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
                                  showDeleteConfirm(user);
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

            {!loading && filteredUsers.length === 0 && (
              <div className="empty-state">
                {searchTerm
                  ? "Arama kriterinize uygun kullanıcı bulunamadı."
                  : "Henüz kullanıcı bulunmuyor."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersPage;
