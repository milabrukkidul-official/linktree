# Linktree MI Nurul Islam Labruk Kidul

Website Linktree berbasis Google Spreadsheet, di-host di GitHub Pages.

## Format Google Spreadsheet

Buat spreadsheet dengan 3 kolom:

| kategori    | nama                        | url                              |
|-------------|-----------------------------|----------------------------------|
| Kurikulum   | Jadwal Pelajaran            | https://docs.google.com/...      |
| Kurikulum   | Kalender Akademik           | https://docs.google.com/...      |
| Kepegawaian |                             | https://docs.google.com/...      |
| Kesiswaan   | Data Siswa                  | https://docs.google.com/...      |
| Kesiswaan   | Absensi                     | https://docs.google.com/...      |
| Operator    | Dapodik                     | https://...                      |
| Kehumasan   | Pengumuman                  | https://...                      |

> Jika kolom `nama` kosong dan hanya ada 1 baris per kategori, tombol langsung membuka URL tersebut.
> Jika ada beberapa baris per kategori, akan muncul sub-menu dropdown.

## Cara Setup

### 1. Publish Google Spreadsheet ke CSV
1. Buka Google Spreadsheet Anda
2. Klik **File > Share > Publish to web**
3. Pilih sheet yang ingin dipublish, format **CSV**
4. Klik **Publish**, copy URL yang muncul

### 2. Pasang URL di app.js
Buka `app.js`, ganti baris ini:
```js
const SHEET_URL = "https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/export?format=csv&gid=0";
```
Dengan URL CSV dari langkah 1.

### 3. Deploy ke GitHub Pages
1. Push semua file ke repository GitHub
2. Buka **Settings > Pages**
3. Source: **Deploy from a branch**, pilih `main` / `root`
4. Akses di: `https://username.github.io/nama-repo`

### 4. Ganti Logo
Letakkan file logo dengan nama `logo.png` di folder yang sama.
