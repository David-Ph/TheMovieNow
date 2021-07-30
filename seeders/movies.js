const faker = require("faker");
const { Movie } = require("../models");

const categoriesArray = [
  "Action",
  "Adventure",
  "Anime",
  "Comedy",
  "Horror",
  "Romance",
];

// seeder add
async function addMovies() {
  for (let i = 0; i < 10; i++) {
    let movie = await Movie.create({
      title: faker.name.findName(),
      synopsis: faker.lorem.text(),
      categories: [
        categoriesArray[Math.floor(Math.random() * categoriesArray.length)],
        categoriesArray[Math.floor(Math.random() * categoriesArray.length)],
        categoriesArray[Math.floor(Math.random() * categoriesArray.length)],
      ],
      trailer: "https://youtube.com",
      releaseDate: faker.date.past(),
      director: faker.name.findName(),
      budget: faker.commerce.price(),
      featuredSong: faker.name.findName(),
      avgRating: Math.floor(Math.random() * 5 + 1),
    });
  }
  console.log("Movies has been seeded");
}

// seeder remove
async function deleteMovies() {
  await Movie.remove();
  console.log("Movies has been removed");
}

module.exports = {
  addMovies,
  deleteMovies,
};
