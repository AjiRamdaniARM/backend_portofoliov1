const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 4000;



// Middleware untuk menetapkan header CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Mengizinkan akses dari domain yang sesuai
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // Metode HTTP yang diizinkan
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Header yang diizinkan dalam permintaan
  res.setHeader('Access-Control-Allow-Credentials', true); // Mengizinkan pengiriman kredensial (misalnya, cookie)
  if (req.method === 'OPTIONS') {
      // Respon untuk permintaan pra-fligh (preflight)
      res.sendStatus(200);
  } else {
      next(); // Lanjutkan ke middleware berikutnya
  }
});

// Middleware untuk membaca data formulir
app.use(bodyParser.urlencoded({ extended: false }));

// Menampilkan formulir
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Menangani permintaan POST dari formulir
app.post("/submit", (req, res) => {
    const { name, data } = req.body;

    // Membuat objek baru dari data formulir
    const newData = {
        name: name,
        data: data
    };

    // Membaca data JSON yang sudah ada
    fs.readFile('data.json', (err, existingData) => {
        if (err && err.code === 'ENOENT') {
            // Jika file data.json belum ada, buat array kosong
            existingData = '[]';
        } else if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Parsing data JSON yang sudah ada
        const parsedData = JSON.parse(existingData);

        // Menambahkan data baru ke dalam array
        parsedData.push(newData);

        // Menyimpan data baru ke dalam file data.json
        fs.writeFile('data.json', JSON.stringify(parsedData, null, 2), (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.send('Data berhasil disimpan');
        });
    });
});

app.get("/api", (req, res) => {
  fs.readFile('data.json', (err, data) => {
      if (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
          return;
      }
      const jsonData = JSON.parse(data);
      res.json(jsonData);
  });
});


// Menjalankan server
app.listen(port, () => {
    console.log(`Server berjalan pada port ${port}`);
});
