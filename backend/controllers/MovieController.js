const { user } = require('../prismaClient');
const MovieService = require('../services/MovieService');


class MovieController {
  
  static async addMovie(req, res) {
    const { title, movieId } = req.body;
    let { label } = req.body;
    const userId = req.user.id;
    
    console.info("User ID:", userId);

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!title || !movieId) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    if (!label) {
      label = "PretendoAssistir";
    }

    try {
      const movie = await MovieService.addMovie(userId, title, label, movieId);
      res.status(200).json(movie);
    } catch (err) {
      console.log("Error Add Movie: ", err);
      res.status(400).json({ error: "Failed to add movie" });
    }
  }

  static async deleteMovie(req, res) {
    const userId = req.user.id;
    const movieId = req.params.id;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!movieId) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    try {
      await MovieService.deleteMovie(userId, movieId);
      res.status(200).json({ message: "Movie deleted successfully" });
    } catch (err) {
      console.log("Failed to delete movie: ", err);
      res.status(400).json({ error: "Failed to delete movie" });
    }
  }


  static async updateLike(req, res) {
    
    const userId = req.user.id;
    const movieId = req.params.id;
    const { like } = req.body;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      await MovieService.updateLiked(userId, movieId, like);
      res.status(200).json({ message: "Like updated successfully" });
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: "Failed to update like" });
    }

  }

  static async GetOneMovieByUser(req, res){
    const userId = req.user.id;
    const movieId = req.params.id;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      const movie = await MovieService.GetOneMovieByUser(userId, movieId);
      res.status(200).json(movie);
    } catch (err) {
      console.log("Failed Get One Movie: ", err);
      res.status(400).json({ error: "Failed to get movie" });
    }
  }

  static async updateFavorite(req, res) {
    
    const userId = req.user.id;
    const movieId = req.params.id;
    const { favorite } = req.body;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      await MovieService.updateFavorite(userId, movieId, favorite);
      res.status(200).json({ message: "Favorite updated successfully" });
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: "Failed to update like" });
    }

  }

  static async getUserMovies(req, res) {
    const userId = req.user.id;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    
    try {
      const movies = await MovieService.getUserMovies(userId);
      res.json(movies);
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: err.message });
    }
  }

  // Buscar na API TMDB
  static async getMovieList(req, res) {
    const title  = req.params.title;
    const userId = req.user.id;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      const result = await MovieService.getMovieList(title);
      
      if (!result || result.status_code === 34) {
          res.status(404).json({ error: "Movie not found" });
          return;
      }
      
      if (result.results && result.results.length > 0) {

        const movies = result.results.map(movie => {
          return {
              id: movie.id,
              title: movie.title
          };
        });

        res.status(200).json({
            movies
        });
      } 
      
    } catch (error) {
        console.log("Error fetching data: ", error);
        res.status(500).json({ error: "Error fetching data, please try again" });
    }

  }

  // Buscar na API TMDB
  static async getMovieDetails(req, res) {
    const id = req.params.id;
    const userId = req.user.id;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      const movie = await MovieService.getUserMoviesDetails(id);
    
      if (!movie || movie.status_code === 34) {
          res.status(404).json({ error: "Movie not found" });
          return;
      }

      res.status(200).json(movie);

    } catch (error) {
        console.log("Error fetching data: ", error);
        res.status(500).json({ error: "Error fetching data, please try again" });
    }
  }

  static async updateRating(req, res) {
    const userId = req.user.id;
    const movieId = req.params.id;
    const { rating } = req.body;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      await MovieService.updateRatingMovie(userId, movieId, rating);
      res.status(200).json({ message: "Rating updated successfully" });
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: "Failed to update rating" });
    }
  }

  static async updateLabel(req, res) {
    const userId = req.user.id;
    const movieId = req.params.id;
    const { label } = req.body;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      await MovieService.updateLabelMovie(userId, movieId, label);
      res.status(200).json({ message: "Label updated successfully" });
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: "Failed to update label" });
    }
  }

}

module.exports = MovieController;
