const express = require('express');
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const helmet = require('helmet');


const app = express();

const cors =  require('cors');

app.use(express.json());
app.use(helmet());

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', "DELETE"],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions));

app.use('/auth', authRoutes);
app.use('/movies', movieRoutes);

app.route('/').get((req, res) => {
  res.send('Hello World!');
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});
