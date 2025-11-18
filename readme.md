# 📚 MyDiary - Buku Harian Digital  
A Multi-Page Application built with **HTML**, **Tailwind CSS**, and **Vanilla JavaScript**, tanpa framework JS.  
Aplikasi ini menyediakan fitur catatan, to-do list, mood tracker harian, dan pencatatan keuangan sederhana dalam bentuk **Multi-Page Application (MPA)**.

---

# ⚙️ Tujuan Project

Project ini dibuat sebagai aplikasi produktivitas dengan empat fitur utama:
1. **Notes** — catatan teks dan editor mini.
2. **Todo List** — daftar tugas harian atau mingguan.
3. **Mood Tracker** — pencatatan mood per hari.
4. **Finance Tracker** — pencatatan pengeluaran, pemasukan, dan statistik dasar.
5. **Dashboard** — ringkasan semua fitur.

Project ini juga dirancang agar mudah dikembangkan menggunakan **AI assistant**, dengan spesifikasi dan batasan tertentu.


---

# 🧭 Cara Kerja Aplikasi (Konsep MPA)

Aplikasi ini **bukan SPA**, tapi **MPA (Multi-Page Application)**.

Artinya:
- Setiap halaman adalah file HTML terpisah.
- User berpindah halaman dengan `<a href="...">`.
- Tidak ada router JS.
- Data tetap konsisten karena disimpan di `localStorage`.

**Keuntungan MPA:**
- AI dapat membangun halaman per halaman.
- Developer dapat memperbaiki modul tertentu tanpa memengaruhi halaman lain.
- Struktur lebih sederhana, tetapi fleksibel untuk logika kompleks.

---

# 🔒 Standar Penyimpanan Data

Semua data aplikasi ini disimpan di **localStorage** dengan key sebagai berikut:

| Fitur | Key |
|------|-----|
| Notes | `notes_data` |
| Todo | `todo_data` |
| Mood | `mood_data` |
| Finance | `finance_data` |

Struktur data harus berupa *array of objects*.

Contoh format:

```json
[
  {
    "id": "xxxx",
    "title": "Catatan",
    "content": "Isi catatan",
    "created_at": 1733124123
  }
]

---
