const { addMovies, deleteMovies } = require("./movies");
const { addUsers, deleteUsers } = require("./user");

async function add() {
  await Promise.all([addMovies(), addUsers()]);
}

async function remove() {
  await Promise.all([deleteMovies(), deleteUsers()]);
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
