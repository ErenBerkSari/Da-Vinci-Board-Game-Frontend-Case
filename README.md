# Kullanıcı ve Post Yönetim Sistemi

JSONPlaceholder API'sinden örnek verilerle tam CRUD işlemleri yapabilen modern React + TypeScript + Vite uygulaması. Bu proje, responsive UI geliştirme yeteneğini ve örnek verilerle çalışma becerisini göstermektedir.

## ✨ Özellikler

- **Kullanıcı Yönetimi**: Kullanıcılar için tam CRUD işlemleri (Oluştur, Oku, Güncelle, Sil)
- **Post Yönetimi**: Kullanıcı ilişkisi ile postlar için tam CRUD işlemleri
- **Responsive Tasarım**: Ant Design bileşenleri ile modern, kullanıcı dostu arayüz
- **Veri İlişkileri**: userId üzerinden kullanıcılar ve postlar arasındaki ilişkiyi gösterir
- **Arama ve Filtreleme**: Hem kullanıcılar hem de postlar için gerçek zamanlı arama
- **Bildirim Sistemi**: Tüm işlemler için kullanıcı geri bildirimi
- **TypeScript**: Uygulama genelinde tam tip güvenliği
- **ESLint**: Linting hataları olmadan kod kalitesi zorunluluğu

##  Veri Yapısı

### Kullanıcılar
- `id`: Benzersiz tanımlayıcı
- `name`: Tam ad
- `username`: Kullanıcı adı
- `email`: E-posta adresi

### Postlar
- `userId`: Kullanıcı referansı (ilişki alanı)
- `id`: Benzersiz tanımlayıcı
- `title`: Post başlığı
- `body`: Post içeriği

## 🛠️ Teknoloji Yığını

- **Frontend**: React 19.1.1
- **Dil**: TypeScript 5.8.3
- **Build Aracı**: Vite 7.1.2
- **UI Kütüphanesi**: Ant Design 5.27.3
- **HTTP İstemcisi**: Axios 1.11.0
- **Yönlendirme**: React Router DOM 7.8.2
- **Stil**: CSS Modülleri
- **Linting**: TypeScript desteği ile ESLint

## 📦 Kurulum

1. **Depoyu klonlayın**
   ```bash
   git clone <depo-url>
   cd fe-case
   ```

2. **Bağımlılıkları yükleyin**
   ```bash
   npm install
   ```

3. **Geliştirme sunucusunu başlatın**
   ```bash
   npm run dev
   ```

4. **Tarayıcınızı açın**
   `http://localhost:5173` adresine gidin

##  Mevcut Komutlar

- `npm run dev` - Geliştirme sunucusunu başlat
- `npm run build` - Üretim için derle
- `npm run preview` - Üretim derlemesini önizle
- `npm run lint` - ESLint çalıştır

##  Proje Yapısı
src/
├── components/ # React bileşenleri
│ ├── HomePage.tsx # Navigasyon ile ana sayfa
│ ├── UsersPage.tsx # Kullanıcı yönetim arayüzü
│ └── PostsPage.tsx # Post yönetim arayüzü
├── services/ # API servisleri
│ └── api.ts # HTTP istemci yapılandırması
├── types/ # TypeScript tip tanımları
│ └── index.ts # User ve Post arayüzleri
├── css/ # Bileşen özel stilleri
│ ├── HomePage.css
│ ├── UsersPage.css
│ └── PostsPage.css
├── App.tsx # Ana uygulama bileşeni
└── main.tsx # Uygulama giriş noktası

### Temel Özellikler

### Ana Sayfa
- Temiz, modern giriş sayfası
- Kullanıcılar ve Postlar bölümleri için navigasyon kartları

### Kullanıcı Yönetimi
- Tüm kullanıcıları responsive tabloda görüntüleme
- Form doğrulama ile yeni kullanıcı ekleme
- Mevcut kullanıcı bilgilerini düzenleme
- Onay diyalogu ile kullanıcı silme
- Ad, kullanıcı adı veya e-posta ile kullanıcı arama
- Modal'da kullanıcının postlarını görüntüleme

### Post Yönetimi
- Kullanıcı bilgileri ile tüm postları görüntüleme
- Kullanıcı seçimi ile yeni post ekleme
- Mevcut postları düzenleme
- Onay ile post silme
- Başlık veya içerik ile post arama
- Kullanıcıya göre post filtreleme

### Veri İlişkileri
- Postlar `userId` ile kullanıcılara bağlanır
- Kullanıcının postları kullanıcı yönetim sayfasından görüntülenebilir
- Post oluşturma geçerli bir kullanıcı seçimi gerektirir

## �� API Entegrasyonu

Uygulama veri kaynağı olarak [JSONPlaceholder](https://jsonplaceholder.typicode.com/) kullanır:
- **Kullanıcılar**: `https://jsonplaceholder.typicode.com/users`
- **Postlar**: `https://jsonplaceholder.typicode.com/posts`

## 🎨 UI/UX Özellikleri

- **Modern Tasarım**: Temiz, profesyonel arayüz
- **Responsive Düzen**: Masaüstü, tablet ve mobilde çalışır
- **Yükleme Durumları**: Veri işlemleri sırasında görsel geri bildirim
- **Hata Yönetimi**: Kullanıcı dostu hata mesajları
- **Onay Diyalogları**: Yanlışlıkla silmeyi önler
- **Bildirim Sistemi**: Başarı ve hata geri bildirimi
- **Arama İşlevselliği**: Gerçek zamanlı filtreleme
- **Modal Pencereler**: Detaylı görünümler ve formlar

## 🔧 Geliştirme

### Kod Kalitesi
- Tip güvenliği için TypeScript
- Kod kalitesi için ESLint
- Tutarlı kod formatlaması
- Bileşen tabanlı mimari

## 🚀 Canlı Demo
