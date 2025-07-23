const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

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

// Server başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Sunucu çalışıyor → http://localhost:${PORT}`);
});
