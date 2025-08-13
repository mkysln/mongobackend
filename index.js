const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB bağlantısı başarılı"))
.catch(err => console.error("❌ MongoDB bağlantı hatası:", err));

// User modeli
const User = mongoose.model('User', {
  name: String,
  email: String,
});

// GET: /users
app.get('/users', async (req, res) => {
  console.log("🔍 [GET] /users endpoint çağrıldı");

  try {
    const users = await User.find();
    console.log(`📤 ${users.length} kullanıcı gönderildi`);
    res.json(users);
  } catch (err) {
    console.error("❌ Kullanıcıları çekerken hata:", err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// POST: /users
app.post('/users', async (req, res) => {
  console.log("📝 [POST] /users endpoint çağrıldı");
  console.log("📦 Gelen veri:", req.body);

  try {
    const user = new User(req.body);
    await user.save();
    console.log(`✅ Yeni kullanıcı eklendi: ${user.name} (${user.email})`);
    res.status(201).json(user);
  } catch (err) {
    console.error("❌ Kullanıcı ekleme hatası:", err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Movie modeli
const Movie = mongoose.model('Movie', new mongoose.Schema({}, { strict: false }), 'movies');

// GET: /movies
app.get('/movies', async (req, res) => {
  console.log("🎬 [GET] /movies endpoint çağrıldı");

  try {
    const movies = await Movie.find().limit(20); // Limit koy, yoksa yüzlerce veri çeker
    console.log(`🎥 ${movies.length} film gönderildi`);
    res.json(movies);
  } catch (err) {
    console.error("❌ Filmleri çekerken hata:", err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// GET: /movies/:id
app.get('/movies/:id', async (req, res) => {
  console.log(`🎯 [GET] /movies/${req.params.id} endpoint çağrıldı`);

  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      console.log("⚠️ Film bulunamadı");
      return res.status(404).json({ error: 'Film bulunamadı' });
    }

    console.log(`🎥 Film bulundu: ${movie._id}`);
    res.json(movie);
  } catch (err) {
    console.error("❌ Film çekme hatası:", err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Server başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Sunucu çalışıyor → http://localhost:${PORT}`);
});
