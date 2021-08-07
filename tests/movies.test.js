const request = require("supertest");
const faker = require("faker");
const jwt = require("jsonwebtoken");
const app = require("../app");
const { posters, titles } = require("../config/moviesInfo");
const categoriesArray = require("../config/categories");
const { Movie, user } = require("../models");
let data = [];
let userToken = "";
let adminToken = "";

beforeAll(async () => {
  data = await Promise.all([Movie.find()]);
  // create user and admin
  const employee = await user.create({
    fullname: faker.name.findName(),
    email: faker.internet.email(),
    password: "Aneh123!!",
  });

  const admin = await user.create({
    fullname: faker.name.findName(),
    email: faker.internet.email(),
    password: "Aneh123!!",
    role: "admin",
  });
  // create a token based off that user or admin
  userToken = jwt.sign({ user: employee._id }, process.env.JWT_SECRET);
  adminToken = jwt.sign({ user: admin._id }, process.env.JWT_SECRET);
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
      .set("Authorization", `Bearer ${adminToken}`) // set the token in the test
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
      .set("Authorization", `Bearer ${adminToken}`)
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

  it("title empty", async () => {
    const response = await request(app)
      .post("/movies")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "",
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
      .set("Authorization", `Bearer ${adminToken}`)
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
      .set("Authorization", `Bearer ${adminToken}`)
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
      .set("Authorization", `Bearer ${adminToken}`)
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
      .set("Authorization", `Bearer ${adminToken}`)
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

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Get movies by page", async () => {
    const response = await request(app).get(
      "/movies?page=2&limit=2&sort_by=title&sort_order=asc"
    );

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Get movies by page invalid query", async () => {
    const response = await request(app).get(
      "/movies?page=notrealpage&limit=notreallimit"
    );

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Get movies by page not found", async () => {
    const response = await request(app).get("/movies?page=999");

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Get movies by category", async () => {
    const response = await request(app).get("/movies/categories/comedy");

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Get movies by category with queries", async () => {
    const response = await request(app).get(
      "/movies/categories/comedy?page=2&limit=2&sort_by=title&sort_order=asc"
    );

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("get movie by invalid categories", async () => {
    const response = await request(app).get("/movies/categories/qwewee");

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("with invalid category or no movie is found", async () => {
    const response = await request(app).get("/movies/categories/qwewee");

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("with invalid queries", async () => {
    const response = await request(app).get(
      "/movies/categories/comedy?page=qwe&limit=qwe&sort_by=title&sort_order=asd"
    );

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Get movies by title", async () => {
    const response = await request(app).get("/movies/search?title=ultr");

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Get movies by title with page and limit params", async () => {
    const response = await request(app).get(
      "/movies/search?title=ave&page=2&limit=2"
    );

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Get movies by title with page, limit, sort_by, and sort_order params", async () => {
    const response = await request(app).get(
      "/movies/search?title=ave&page=2&limit=2&sort_order=asc&sort_by=title"
    );

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Get movies by title no movie found", async () => {
    const response = await request(app).get(
      "/movies/search?title=nowayamoviehasthistitle"
    );

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Get movies by title with invalid queries", async () => {
    const response = await request(app).get(
      "/movies/search?title=ave&page=notapage&limit=notalimit"
    );

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Get movies by id", async () => {
    const randomMovieId = data[0][0]._id;

    const response = await request(app).get(`/movies/${randomMovieId}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Get movies count", async () => {
    const response = await request(app).get(`/movies/count`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });
});

describe("/movies PUT", () => {
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

  it("Movies must be updated", async () => {
    const randomMovieId = data[0][5]._id;
    const response = await request(app)
      .put(`/movies/${randomMovieId}`)
      .set("Authorization", `Bearer ${adminToken}`) // set the token in the test
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

  it("Movies not found", async () => {
    const response = await request(app)
      .put(`/movies/61051040ceb9384922f48b24`)
      .set("Authorization", `Bearer ${adminToken}`) // set the token in the test
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

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeInstanceOf(Object);
  });
});

describe("/movies DELETE", () => {
  it("Movies must be deleted", async () => {
    const randomMovieId = data[0][data[0].length - 5]._id;
    const response = await request(app)
      .delete(`/movies/${randomMovieId}`)
      .set("Authorization", `Bearer ${adminToken}`); // set the token in the test

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Movies not found", async () => {
    const response = await request(app)
      .delete(`/movies/61051040ceb9384922f48b24`)
      .set("Authorization", `Bearer ${adminToken}`); // set the token in the test

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeInstanceOf(Object);
  });
});

describe("/categories GET", () => {
  it("Must get all categories", async () => {
    const response = await request(app).get(`/movies/categories/all`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });
});
