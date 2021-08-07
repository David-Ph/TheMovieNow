const request = require("supertest");
const faker = require("faker");
const jwt = require("jsonwebtoken");
const app = require("../app");
const { user } = require("../models");
let data = [];
let userToken = "";
let adminToken = "";

beforeAll(async () => {
  data = await user.find();

  const user1 = await user.create({
    fullname: faker.name.findName(),
    email: faker.internet.email(),
    password: "Oke12345!",
  });

  const admin = await user.create({
    fullname: faker.name.findName(),
    email: faker.internet.email(),
    password: "Oke12345!",
    role: "admin",
  });

  userToken = jwt.sign({ user: user1._id }, process.env.JWT_SECRET);
  adminToken = jwt.sign({ user: admin._id }, process.env.JWT_SECRET);
});

describe("User Signup", () => {
  it("Sign up success", async () => {
    const res = await request(app).post("/user/signup").send({
      fullname: faker.name.findName(),
      email: faker.internet.email(),
      password: "Oke12345!",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("Empty Field", async () => {
    const res = await request(app).post("/user/signup").send({
      fullname: "",
      email: faker.internet.email(),
      password: "Oke12345!",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("Minim character username", async () => {
    const res = await request(app).post("/user/signup").send({
      fullname: "ok",
      email: faker.internet.email(),
      password: "Oke12345!",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("Duplicate Email", async () => {
    const res = await request(app).post("/user/signup").send({
      fullname: "Testing aja",
      email: "testing1@gmail.com",
      password: "Oke12345!",
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("Weak password", async () => {
    const res = await request(app).post("/user/signup").send({
      fullname: faker.name.findName(),
      email: faker.internet.email(),
      password: "Useraja",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
  });
});

describe("User Signin", () => {
  it("Signin success", async () => {
    const res = await request(app).post("/user/signin").send({
      email: "testing1@gmail.com",
      password: "Oke12345!",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("Signin empty field", async () => {
    const res = await request(app).post("/user/signin").send({
      email: "",
      password: "Oke12345!",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("Wrong password", async () => {
    const res = await request(app).post("/user/signin").send({
      email: "testing1@gmail.com",
      password: "Oke123",
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toBeInstanceOf(Object);
  });
});

describe("Get my profil", () => {
  it("get my profil success", async () => {
    const res = await request(app)
      .get("/user/getMe")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("No user loggin", async () => {
    const res = await request(app)
      .get("/user/getMe")
      .set("Authorization", `Bearer No user login`);
    expect(res.statusCode).toEqual(403);
    expect(res.body).toBeInstanceOf(Object);
  });
});

// describe("Update User", () => {
//   it("updateUser success", async () => {
//     const res = await request(app)
//       .put(`/user/edit/${user1._id}`)
//       .set("Authorization", `Bearer ${userToken}`)
//       .send({
//         fullname: faker.name.findName(),
//         email: faker.internet.email(),
//         password: "Oke12345!",
//       });
//     expect(res.statusCode).toEqual(201);
//     expect(res.body).toBeInstanceOf(Object);
//   });

//   it("Duplicate Email", async () => {
//     const res = await request(app).post("/user/edit").send({
//       fullname: faker.name.findName(),
//       email: faker.internet.email(),
//       password: "Oke12345!",
//     });
//     expect(res.statusCode).toEqual(500);
//     expect(res.body).toBeInstanceOf(Object);
//   });

//   it("updateUser no user", async () => {
//     const res = await request(app).put("/user/edit").send({
//       fullname: faker.name.findName(),
//       email: faker.internet.email(),
//       password: "Oke12345!",
//     });
//     expect(res.statusCode).toEqual(404);
//     expect(res.body).toBeInstanceOf(Object);
//   });
// });

//BELUM SELESAI
