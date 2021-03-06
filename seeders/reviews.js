const faker = require("faker");
const { Review, Movie, user } = require("../models");

async function addReviews() {
  const users = await user.find();
  const movies = await Movie.find();

  for (let userIndex = 0; userIndex < users.length; userIndex++) {
    for (let movieIndex = 0; movieIndex < movies.length; movieIndex++) {
      const newReview = await Review.create({
        user_id: users[userIndex]._id,
        movie_id: movies[movieIndex]._id,
        rating: Math.floor(Math.random() * 5 + 1),
        text: faker.lorem.words(50),
      });
    }
  }

  console.log("Reviews has been added");
}

/* Delete seeders */
async function deleteReviews() {
  await Review.remove();
  console.log("Reviews has been removed");
}

module.exports = {
  addReviews,
  deleteReviews,
};
