
# Dev Serve Extension

Dev Serve Extension adalah sebuah extension untuk Visual Studio Code yang membantu membuka dua terminal dan menjalankan perintah `npm run dev` dan `npm run serve` secara otomatis.

## Fitur

- Membuka dua terminal di VS Code
- Menjalankan perintah `npm run dev` di terminal pertama
- Menjalankan perintah `npm run serve` di terminal kedua

## Instalasi

1. **Clone repositori ini** (atau download source code) ke dalam folder pilihan kamu.

   ```sh
   git clone https://github.com/username/repository-name
   cd your-extension-folder
   ```
2. **Install dependencies** dengan menjalankan perintah berikut:

   ```sh
   npm install
   ```
3. **Kompilasi kode TypeScript**:

   ```sh
   npm run compile
   ```
4. **Jalankan Extension** di VS Code:

   - Tekan `F5` untuk membuka jendela baru VS Code dengan extension terinstall.

## Penggunaan

1. Tekan `Ctrl + Shift + P` untuk membuka Command Palette.
2. Ketik `Dev Serve` dan pilih perintah yang muncul.
3. Dua terminal akan terbuka:
   - Terminal pertama akan menjalankan `npm run dev`
   - Terminal kedua akan menjalankan `npm run serve`

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

Extension ini dilisensikan di bawah [MIT License](https://github.com/username/repository-name/blob/main/LICENSE).
