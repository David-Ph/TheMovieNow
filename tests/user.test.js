const request = require("supertest");
const faker = require("faker");
const jwt = require("jsonwebtoken");
const app = require("../app");
let Token = "";
let users = "";
let admin = "";

beforeAll(async () => {
  users = await user.create({
    fullname: "Testing aja",
    email: "testing1@gmail.com",
    password: "Oke12345!",
  });

  admin = await user.create({
    fullname: "admin",
    email: "Testing2@gmail.com",
    password: "Oke12345!",
    role: "admin",
  });

  userToken = jwt.sign({ user: users._id }, process.env.JWT_SECRET);
  adminToken = jwt.sign({ user: admin._id }, process.env.JWT_SECRET);
});

describe("User Signup", () => {
  it("Sign up success", async () => {
    const res = await request(app).post("/auth/signup").send({
      fullname: faker.name.findName(),
      email: faker.internet.email(),
      password: "Oke12345!",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("Empty Field", async () => {
    const res = await request(app).post("/auth/signup").send({
      fullname: "",
      email: faker.internet.email(),
      password: "User1234!",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("Minim character username", async () => {
    const res = await request(app).post("/auth/signup").send({
      fullname: "ok",
      email: faker.internet.email(),
      password: "User1234!",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("Duplicate Email", async () => {
    const res = await request(app).post("/auth/signup").send({
      fullname: "Testing aja",
      email: "testing1@gmail.com",
      password: "Oke12345!",
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("Weak password", async () => {
    const res = await request(app).post("/auth/signup").send({
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
    const res = await request(app).post("/auth/signin").send({
      email: "testing1@gmail.com",
      password: "Oke12345!",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("Signin empty field", async () => {
    const res = await request(app).post("/auth/signin").send({
      email: "",
      password: "Oke12345!",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("Wrong password", async () => {
    const res = await request(app).post("/auth/signin").send({
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
      .get("/auth/getMe")
      .set("Authorization", `Bearer ${Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("No user loggin", async () => {
    const res = await request(app)
      .get("/auth/getMe")
      .set("Authorization", `Bearer No user login`);
    expect(res.statusCode).toEqual(403);
    expect(res.body).toBeInstanceOf(Object);
  });
});

// describe("Update User", () => {
//   it("updateUser success", async () => {
//     const res = await request(app)
//       .put(`/auth/edit/${users._id}`)
//       .set("Authorization", `Bearer ${Token}`)
//       .send({
//         fullname: faker.name.findName(),
//         email: faker.internet.email(),
//         password: "Oke12345!",
//       });
//     expect(res.statusCode).toEqual(201);
//     expect(res.body).toBeInstanceOf(Object);
//   });

//   it("Duplicate Email", async () => {
//     const res = await request(app).post("/auth/edit").send({
//       fullname: "Testing aja",
//       email: "testing1@gmail.com",
//       password: "Oke12345!",
//     });
//     expect(res.statusCode).toEqual(500);
//     expect(res.body).toBeInstanceOf(Object);
//   });

//   it("updateUser no user", async () => {
//     const res = await request(app).put(`/auth/edit`).send({
//       fullname: faker.name.findName(),
//       email: faker.internet.email(),
//       password: "User1234!",
//     });
//     expect(res.statusCode).toEqual(404);
//     expect(res.body).toBeInstanceOf(Object);
//   });
// });

//BELUM SELESAI
