const faker = require("faker");
const { user } = require("../models");

// seeder add
async function addUsers() {
  for (let i = 0; i < 10; i++) {
    await user.create({
      fullname: faker.name.findName(),
      email: faker.internet.email(),
      photo: faker.image.imageUrl(),
      password: "Oke12345!",
    });
  }
  console.log("Users has been seeded");
}

// seeder remove
async function deleteUsers() {
  await user.remove();
  console.log("Users has been deleted");
}

module.exports = {
  addUsers,
  deleteUsers,
};
