const faker = require("faker");
const { Movie } = require("../models");
const categoriesArray = require("../config/categories");

/* 
const result = Array.from(new Set(ages));
*/

// seeder add
async function addMovies() {
  for (let i = 0; i < 10; i++) {
    const uniqueCategories = Array.from(
      new Set([
        categoriesArray[Math.floor(Math.random() * categoriesArray.length)],
        categoriesArray[Math.floor(Math.random() * categoriesArray.length)],
        categoriesArray[Math.floor(Math.random() * categoriesArray.length)],
        categoriesArray[Math.floor(Math.random() * categoriesArray.length)],
      ])
    );

    let movie = await Movie.create({
      title: faker.name.findName(),
      synopsis: faker.lorem.text(),
      categories: uniqueCategories,
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
