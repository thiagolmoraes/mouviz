const prisma = require('../prismaClient');

class Movie {
  // Criar um novo filme
  static async create(userId, title, label, movieId) {
    return await prisma.movie.create({
      data: {
        movieId,
        title,
        label,
        userId
      },
    });
  }

  // Busca todos filmes do usuário
  static async findAllMoviesByUser(userId) {
    const movies = await prisma.movie.findMany({ where: { userId } });
    return movies.map(movie => ({
      id: movie.id,
      movieId: movie.movieId,
      title: movie.title,
      liked: movie.liked,
      label: movie.label,
      isFavorite: movie.isFavorite,
      rating: movie.rating
    }));
  }

  // Busca um filme do usuário pelo ID do Filme
  static async findById(userId, id) {
    return await prisma.movie.findFirst({ 
      where: { userId: userId, id: parseInt(id,10) } 
    });
  }

  // Busca um filme do usuário pelo MovieId do Filme
  static async findByMovieId(userId, movieId) {
    return await prisma.movie.findFirst({ 
      where: { userId: userId, movieId: parseInt(movieId, 10) } 
    });
  }

  static async updateRating(userId, movieId, rating) {
    return await prisma.movie.update({
      where: {
        userId_movieId: {
          userId: userId,
          movieId: parseInt(movieId, 10)
        }
      },
      data: {
        rating: Number(rating),
      },
    });
  }

  static async updateLabel(userId, movieId, label) {
    return await prisma.movie.update({
      where: {
        userId_movieId: {
          userId: userId,
          movieId: parseInt(movieId, 10)
        }
      },
      data: {
        label: label,
      },
    });
  }

  static async markLiked(userId, movieId, like) {
    return await prisma.movie.update({
      where: { 
        userId_movieId: {
          userId: userId, 
          movieId: parseInt(movieId, 10) 
        }
      },
      data: {
        liked: like,
      },
    });
  }

  static async markFavorite(userId, movieId, favorite) {
    return await prisma.movie.update({
      where: { 
        userId_movieId: {
          userId: userId, 
          movieId: parseInt(movieId, 10) 
        }
      },
      data: {
        isFavorite: favorite,
      },
    });
  }

  static async deleteMovieById(userId, movieId) {
    return await prisma.movie.delete({
      where: {
        userId_movieId: {
          userId: userId,
          movieId: parseInt(movieId, 10)
        }
      },
    });
  }

}

module.exports = Movie;
