import { Link } from "react-router-dom";
import "../css/HomePage.css";

function HomePage() {
  return (
    <div className="home-container">
      <div className="welcome-section">
        <h1 className="welcome-title">Yönetim Paneli</h1>
        <p className="welcome-subtitle">İşlemlerinizi seçin</p>
      </div>
      
      <div className="operations-grid">
        <Link to="users" className="operation-card">
          <div className="card-icon user-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <h3 className="card-title">Kullanıcı İşlemleri</h3>
          <p className="card-description">Kullanıcıları görüntüle, ekle, düzenle ve sil</p>
        </Link>

        <Link to="posts" className="operation-card">
          <div className="card-icon post-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
          </div>
          <h3 className="card-title">Post İşlemleri</h3>
          <p className="card-description">Postları görüntüle, ekle, düzenle ve sil</p>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
