const faker = require("faker");
const { user } = require("../models");

// seeder add
async function addUsers() {
  for (let i = 0; i < 10; i++) {
    await user.create({
      name: faker.name.findName(),
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
