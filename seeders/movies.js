const faker = require("faker");
const { Movie } = require("../models");
const { posters, titles } = require("../config/moviesInfo");
const categoriesArray = require("../config/categories");

/* 
const result = Array.from(new Set(ages));
*/

// seeder add
async function addMovies() {
  for (let i = 0; i < 33; i++) {
    // create a unique array from randomized categories
    const uniqueCategories = Array.from(
      new Set([
        categoriesArray[Math.floor(Math.random() * categoriesArray.length)],
        categoriesArray[Math.floor(Math.random() * categoriesArray.length)],
        categoriesArray[Math.floor(Math.random() * categoriesArray.length)],
        categoriesArray[Math.floor(Math.random() * categoriesArray.length)],
      ])
    );

    const randomPosters = posters[Math.floor(Math.random() * posters.length)];
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];

    let movie = await Movie.create({
      title: randomTitle + " " + i,
      synopsis: faker.lorem.words(50),
      categories: uniqueCategories,
      trailer: "https://youtube.com",
      releaseDate: faker.date.past(),
      director: faker.name.findName(),
      budget: faker.commerce.price(),
      featuredSong: faker.name.findName(),
      posterImage: randomPosters,
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
