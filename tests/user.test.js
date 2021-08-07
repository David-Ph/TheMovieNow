const request = require("supertest");
const faker = require("faker");
const jwt = require("jsonwebtoken");
const app = require("../app");
const { user } = require("../models");
let data = [];
let userToken = "";
let adminToken = "";

beforeEach(async () => {
  jest.setTimeout(60000);
});

beforeAll(async () => {
  data = await user.find();

  const user1 = await user.create({
    fullname: faker.name.findName(),
    email: "unittest@email.com",
    password: "Oke12345!",
  });

  const admin = await user.create({
    fullname: faker.name.findName(),
    email: "admintest@email.com",
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

  it("Empty Field should fail", async () => {
    const res = await request(app).post("/user/signup").send({
      fullname: "",
      email: faker.internet.email(),
      password: "Oke12345!",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("Minim character username should fail", async () => {
    const res = await request(app).post("/user/signup").send({
      fullname: "ok",
      email: faker.internet.email(),
      password: "Oke12345!",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("Duplicate Email should fail", async () => {
    const res = await request(app).post("/user/signup").send({
      fullname: "Testing aja",
      email: data[0].email,
      password: "Oke12345!",
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("Weak password should fail", async () => {
    const res = await request(app).post("/user/signup").send({
      fullname: faker.name.findName(),
      email: faker.internet.email(),
      password: "Useraja",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("Invalid email should fail", async () => {
    const res = await request(app).post("/user/signup").send({
      fullname: faker.name.findName(),
      email: "notrealemail",
      password: "Oke12345!23",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
  });
});

describe("User Signin", () => {
  it("Signin success", async () => {
    const res = await request(app).post("/user/signin").send({
      email: "unittest@email.com",
      password: "Oke12345!",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("Signin empty field should fail", async () => {
    const res = await request(app).post("/user/signin").send({
      email: "",
      password: "Oke12345!",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("Wrong password should fail", async () => {
    const res = await request(app).post("/user/signin").send({
      email: "testing1@gmail.com",
      password: "Oke123",
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toBeInstanceOf(Object);
  });
});

describe("Get my profile", () => {
  it("get my profil success", async () => {
    const res = await request(app)
      .get("/user/getMe")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("No user logged in and should fail", async () => {
    const res = await request(app)
      .get("/user/getMe")
      .set("Authorization", `Bearer No user login`);
    expect(res.statusCode).toEqual(403);
    expect(res.body).toBeInstanceOf(Object);
  });
});

describe("Update User", () => {
  it("updateUser success", async () => {
    const res = await request(app)
      .put(`/user/edit`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        fullname: faker.name.findName(),
        email: faker.internet.email(),
        password: "Oke12345!",
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("Duplicate Email and should fail", async () => {
    const res = await request(app)
      .put("/user/edit")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        fullname: faker.name.findName(),
        email: data[0].email,
        password: "Oke12345!",
      });
    expect(res.statusCode).toEqual(500);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("empty fullname should fail", async () => {
    const res = await request(app)
      .put("/user/edit")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        fullname: "",
        email: faker.internet.email(),
        password: "Oke12345!",
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("fullname length less than 3 should fail", async () => {
    const res = await request(app)
      .put("/user/edit")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        fullname: "da",
        email: faker.internet.email(),
        password: "Oke12345!",
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("updating invalid email should fail", async () => {
    const res = await request(app)
      .put("/user/edit")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        fullname: "daddy",
        email: "notanemail",
        password: "Oke12345!",
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("updating weak password should fail", async () => {
    const res = await request(app)
      .put("/user/edit")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        fullname: "daddy",
        email: faker.internet.email(),
        password: "hehe",
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("updating user without auth token should fail", async () => {
    const res = await request(app).put("/user/edit").send({
      fullname: faker.name.findName(),
      email: faker.internet.email(),
      password: "Oke12345!",
    });

    expect(res.statusCode).toEqual(403);
    expect(res.body).toBeInstanceOf(Object);
  });
});

//BELUM SELESAI
