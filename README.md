# Ryo Dev Extension

Ryo Dev Extension adalah sebuah extension untuk Visual Studio Code yang membantu membuka dua terminal dan menjalankan perintah `npm run dev` dan `npm run serve` secara otomatis.

## Fitur

- Membuka dua terminal di VS Code
- Menjalankan perintah `npm run dev` di terminal pertama
- Menjalankan perintah `npm run serve` di terminal kedua
- Menghentikan kedua terminal dengan perintah `Ryo: Stop Dev Serve`

## Instalasi

1. **Clone repositori ini** (atau download source code) ke dalam folder pilihan kamu.

   ```sh
   git clone https://github.com/budi-imam-prasetyo/Ryo-Dev
   cd Ryo-Dev
   ```
2. **Install dependencies** dengan menjalankan perintah berikut:

   ```sh
   npm install
   ```
4. **Kompilasi kode TypeScript**:

   ```sh
   npm run compile
   ```
5. **Buat Paket `.vsix`**:

   ```sh
   vsce package
   ```
6. **Install Extension** di VS Code:

   - Buka VS Code.
   - Tekan `Ctrl + Shift + P` untuk membuka Command Palette.
   - Ketik `Extensions: Install from VSIX...` dan pilih opsi yang muncul.
   - Pilih file `.vsix` yang telah kamu buat.

## Penggunaan

1. Tekan `Ctrl + Shift + P` untuk membuka Command Palette.
2. Ketik `Ryo: Dev Serve` dan pilih perintah yang muncul untuk memulai terminal.
3. Tekan `Ctrl + Shift + P` dan ketik `Ryo: Stop Dev Serve` untuk menghentikan terminal.

## Pengembangan

Jika ingin berkontribusi atau mengembangkan extension ini lebih lanjut:

1. **Fork repositori ini** dan clone ke lokal.
2. Buat branch baru untuk fitur atau perbaikan yang akan ditambahkan.
   ```sh
   git checkout -b feature-branch-name
   ```
3. Buat perubahan yang diinginkan dan commit perubahan tersebut.
   ```sh
   git commit -m "Deskripsi perubahan"
   ```
4. Push branch tersebut ke repositori forked.
   ```sh
   git push origin feature-branch-name
   ```
5. Buat pull request di GitHub.

## Lisensi

Extension ini dilisensikan di bawah [MIT License](https://github.com/budi-imam-prasetyo/Ryo-Dev/blob/main/LICENSE).
