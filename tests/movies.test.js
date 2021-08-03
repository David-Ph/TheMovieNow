const request = require("supertest");
const faker = require("faker");
const jwt = require("jsonwebtoken");
const app = require("../app");
const { posters, titles } = require("../config/moviesInfo");
const categoriesArray = require("../config/categories");
const { Movie } = require("../models");
let data = [];
// let userToken = "";
// let adminToken = "";

beforeAll(async () => {
  data = await Promise.all([Movie.find()]);

  // create user and admin
  //   const employee = await user.create({
  //     name: faker.name.findName(),
  //     email: faker.internet.email(),
  //     password: "Aneh123!!",
  //   });

  //   const admin = await user.create({
  //     name: faker.name.findName(),
  //     email: faker.internet.email(),
  //     password: "Aneh123!!",
  //     role: "admin",
  //   });
  // create a token based off that user or admin
  //   userToken = jwt.sign({ user: employee._id }, process.env.JWT_SECRET);
  //   adminToken = jwt.sign({ user: admin._id }, process.env.JWT_SECRET);
});

describe("/movies POST", () => {
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

  it("Movies must be created", async () => {
    const response = await request(app)
      .post("/movies")
      //   .set("Authorization", `Bearer ${adminToken}`) // set the token in the test
      .send({
        title: randomTitle,
        synopsis: faker.lorem.words(50),
        categories: uniqueCategories,
        trailer: "https://youtube.com",
        releaseDate: "1970-02-05",
        director: faker.name.findName(),
        budget: "65000",
        featuredSong: faker.name.findName(),
        posterImage: randomPosters,
      });

    expect(response.statusCode).toEqual(201);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("trailer not valid", async () => {
    const response = await request(app)
      .post("/movies")
      //   .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: randomTitle,
        synopsis: faker.lorem.words(50),
        categories: uniqueCategories,
        trailer: "not a real trailer",
        releaseDate: faker.date.past(),
        director: faker.name.findName(),
        budget: faker.commerce.price(),
        featuredSong: faker.name.findName(),
        posterImage: randomPosters,
      });
    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Categories not valid", async () => {
    const response = await request(app)
      .post("/movies")
      //   .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: randomTitle,
        synopsis: faker.lorem.words(50),
        categories: ["not a real category"],
        trailer: "https://youtube.com",
        releaseDate: faker.date.past(),
        director: faker.name.findName(),
        budget: faker.commerce.price(),
        featuredSong: faker.name.findName(),
        posterImage: randomPosters,
      });
    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Categories can't be duplicate", async () => {
    const response = await request(app)
      .post("/movies")
      //   .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: randomTitle,
        synopsis: faker.lorem.words(50),
        categories: ["action", "comedy", "action"],
        trailer: "https://youtube.com",
        releaseDate: faker.date.past(),
        director: faker.name.findName(),
        budget: faker.commerce.price(),
        featuredSong: faker.name.findName(),
        posterImage: randomPosters,
      });
    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Budget has to be a number", async () => {
    const response = await request(app)
      .post("/movies")
      //   .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: randomTitle,
        synopsis: faker.lorem.words(50),
        categories: uniqueCategories,
        trailer: "https://youtube.com",
        releaseDate: faker.date.past(),
        director: faker.name.findName(),
        budget: "not a real budget",
        featuredSong: faker.name.findName(),
        posterImage: randomPosters,
      });
    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("releaseDate has to be a date", async () => {
    const response = await request(app)
      .post("/movies")
      //   .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: randomTitle,
        synopsis: faker.lorem.words(50),
        categories: uniqueCategories,
        trailer: "https://youtube.com",
        releaseDate: "not a real date",
        director: faker.name.findName(),
        budget: faker.commerce.price(),
        featuredSong: faker.name.findName(),
        posterImage: randomPosters,
      });
    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });
});

describe("/movies GET", () => {
  it("Movies must exists", async () => {
    const response = await request(app).get("/movies/all");
    //   .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Get movies by page", async () => {
    const response = await request(app).get(
      "/movies?page=2&limit=2&sort_by=title&sort_order=asc"
    );
    //   .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Get movies by page invalid query", async () => {
    const response = await request(app).get(
      "/movies?page=notrealpage&limit=notreallimit"
    );
    //   .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  //   it("Movies must exists", async () => {
  //     const response = await request(app).get("/movies");
  //     //   .set("Authorization", `Bearer ${userToken}`);

  //     expect(response.statusCode).toEqual(200);
  //     expect(response.body).toBeInstanceOf(Object);
  //   });
});
