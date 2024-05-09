const express = require('express');
const xlsx = require('xlsx');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());




// Menentukan folder untuk menyimpan file-file statis seperti HTML, CSS, dan JavaScript
app.use(express.static(path.join(__dirname, 'public')));

// Rute untuk mengakses formulir HTML
app.get('/form', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

// === route tambah data ke excel === //
app.get('/tambah', (req, res) => {
  // Mengirimkan formulir HTML
  res.sendFile(path.join(__dirname, 'public', 'form.html'));
});
// === route tambah data ke excel === //
app.post('/tambah', (req, res) => {
  try {
      const workbook = xlsx.readFile('data.xlsx');
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      let data = xlsx.utils.sheet_to_json(sheet);

      // Mendapatkan data dari formulir
      const newData = {
          id: data.length + 1, // ID unik berdasarkan jumlah data saat ini
          judul: req.body.judul,
          Link: req.body.link
      };

      // Menambahkan data baru ke array data
      data.push(newData);

      // Membuat lembar kerja baru dari array data yang diperbarui
      const newWorksheet = xlsx.utils.json_to_sheet(data);
      const newWorkbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);

      // Menyimpan file Excel yang diperbarui
      xlsx.writeFile(newWorkbook, 'data.xlsx');

      res.send(`Data berhasil ditambahkan dan file Excel berhasil diperbarui. Data baru: ${JSON.stringify(newData)}`);
  } catch (error) {
      res.status(500).send('Gagal menambahkan data ke file Excel');
  }
});



// === api json data === //
app.get('/api/data', (req,res) => {
  try {
    const workbook = xlsx.readFile('data.xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    let data = xlsx.utils.sheet_to_json(sheet);
      res.json(data);
  } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Gagal mengambil data dari file Excel');
  }
});

//  === server yang berjalan === //
app.listen(4000, () => {
  console.log('Server Running');
});
