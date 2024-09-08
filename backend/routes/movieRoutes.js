const express = require('express');
const MovieController = require('../controllers/MovieController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.post('/add', authenticateToken, MovieController.addMovie);
router.post('/:id/liked', authenticateToken, MovieController.updateLike);
router.post('/:id/favorite', authenticateToken, MovieController.updateFavorite);
router.post('/:id/rating', authenticateToken, MovieController.updateRating);
router.post('/:id/label', authenticateToken, MovieController.updateLabel);

router.get('/user', authenticateToken, MovieController.getUserMovies);
router.get('/:id/user', authenticateToken, MovieController.GetOneMovieByUser);
router.get('/search/:title', authenticateToken, MovieController.getMovieList);
router.get('/:id/details', authenticateToken, MovieController.getMovieDetails);

router.delete('/:id/delete', authenticateToken, MovieController.deleteMovie);

module.exports = router;
