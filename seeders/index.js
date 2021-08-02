const { addMovies, deleteMovies } = require("./movies");

async function add() {
  await addMovies();
}

async function remove() {
  await deleteMovies();
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

//User
const { addUsers, deleteUsers } = require("./user");

async function add() {
  await addUsers();
}

async function remove() {
  await deleteUsers();
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
