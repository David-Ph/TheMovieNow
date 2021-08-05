const { addMovies, deleteMovies } = require("./movies");
const { addUsers, deleteUsers } = require("./user");
const { addReviews, deleteReviews } = require("./reviews");

async function add() {
  await Promise.all([addMovies(), addUsers()]);
  await addReviews();
}

async function remove() {
  await Promise.all([deleteMovies(), deleteUsers(), deleteReviews()]);
}

if (process.argv[2] === "add") {
  add().then(() => {
    console.log("Seeders success");
    process.exit(0);
  });
} else if (process.argv[2] === "remove") {
  remove().then(() => {
    console.log("Delete data success");
    process.exit(0);
  });
}
