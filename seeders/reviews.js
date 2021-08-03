const faker = require("faker");
const { review } = require("../models");

/* Add seeders */
exports.addReviews = async () => {
  const reviews = await reviews.find();

  for (let i = 0; i < 5; i++) {
    await review.create({
      name_id: faker.commerce.findName(),
      movie_id: faker.commerce.findMovie(),
      rating: faker.number.findRating(),
      textContent: faker.lorem.text(),
    });
  }
  console.log("Review Has Been Seeded");
};

/* Delete seeders */
exports.removeReviews = async () => {
  await review.remove();
  console.log("Review Has Been Removed");
};

module.exports = {
  addReviews,
  removeReviews,
};
