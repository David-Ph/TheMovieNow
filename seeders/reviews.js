const faker = require("faker");
const { Review, Movie, user } = require("../models");

/* Add seeders */
async function addReviews() {
  const users = await user.find();
  const movies = await Movie.find();

  for (let userIndex = 0; userIndex < users.length; userIndex++) {
    for (let movieIndex = 0; movieIndex < movies.length; movieIndex++) {
      const newReview = Review.create({
        user_id: users[userIndex]._id,
        movie_id: movies[movieIndex]._id,
        rating: Math.floor(Math.random() * 5 + 1),
        text: faker.lorem.words(50),
      });
    }
  }
}

/* Delete seeders */
async function removeReviews() {
  await Review.remove();
  console.log("Reviews has been removed");
}

module.exports = {
  addReviews,
  removeReviews,
};
