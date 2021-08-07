const request = require("supertest");
const jwt = require("jsonwebtoken");
const faker = require("faker");
const app = require("../app");
const { Review, Movie, user } = require("../models");

let reviews;
let movies;
let userToken = "";
let usersaya_id = "";
let moviesaya_id = "";

beforeAll(async () => {
  jest.setTimeout(60000); // 1 second
  const usersaya = await user.create({
    fullname: faker.name.findName(),
    email: faker.internet.email(),
    password: "Aneh123!!",
  });
  const movie = await Movie.create({
    title: "movie test",
    synopsis: "synopsis test",
    trailer: "string trailer",
  });
  const myReview = await Review.create({
    user_id: usersaya._id,
    movie_id: movie._id,
    rating: "3",
    text: "not bad",
  });
  movies = await Movie.find();
  reviews = await Review.find();
  usersaya_id = usersaya._id;
  moviesaya_id = movie._id;
  userToken = jwt.sign({ user: usersaya._id }, process.env.JWT_SECRET);
});

describe("/reviews POST", () => {
  it("review must be created", async () => {
    const response = await request(app)
      .post("/reviews")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        movie_id: movies[0]._id,
        rating: Math.floor(Math.random() * 5 + 1).toString(),
        text: faker.lorem.words(50),
      });

    expect(response.statusCode).toEqual(201);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("rating or text field is empty", async () => {
    const response = await request(app)
      .post("/reviews")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        movie_id: moviesaya_id,
        rating: "",
        text: "",
      });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("rating or text field is not send", async () => {
    const response = await request(app)
      .post("/reviews")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        movie_id: moviesaya_id,
      });

    expect(response.statusCode).toEqual(500);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("movie_id not valid", async () => {
    const response = await request(app)
      .post("/reviews")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        movie_id: ["movie not valid"],
        rating: Math.floor(Math.random() * 5 + 1).toString(),
        text: faker.lorem.words(50),
      });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Tried to insert user_id", async () => {
    const response = await request(app)
      .post("/reviews")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        user_id: ["unregistered name"],
        movie_id: moviesaya_id,
        rating: Math.floor(Math.random() * 5 + 1).toString(),
        text: faker.lorem.words(50),
      });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("duplicate user_id and movie_id", async () => {
    const response = await request(app)
      .post("/reviews")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        movie_id: moviesaya_id,
        rating: Math.floor(Math.random() * 5 + 1).toString(),
        text: faker.lorem.words(50),
      });

    expect(response.statusCode).toEqual(500);
    expect(response.body).toBeInstanceOf(Object);
  });
});

describe("/reviews GET", () => {
  it("find all reviews", async () => {
    const response = await request(app).get("/reviews");

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("review routes not found", async () => {
    const response = await request(app).get("/review/");

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("find one review", async () => {
    const response = await request(app).get(`/reviews/${reviews[0]._id}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("one review not found", async () => {
    const response = await request(app).get(
      `/reviews/610aa6c0e334ec5806445084`
    );

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("invalid review id", async () => {
    const response = await request(app).get(`/reviews/asdasdasd`);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("get reviews by movie id", async () => {
    const response = await request(app).get(`/reviews/movie/${movies[0]._id}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("get reviews by movie id not found", async () => {
    const response = await request(app).get(
      `/reviews/movie/610942b93c00c02068f97e18`
    );

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeInstanceOf(Object);
  });
});

describe("/reviews PUT", () => {
  it("update review successfully", async () => {
    const reviewToUpdate = await Review.find({
      user_id: usersaya_id,
    });
    const response = await request(app)
      .put(`/reviews/${reviewToUpdate[0]._id}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        rating: Math.floor(Math.random() * 5 + 1).toString(),
        text: faker.lorem.words(50),
      });

    expect(response.statusCode).toEqual(201);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("edit another user's review should get a forbidden", async () => {
    const response = await request(app)
      .put(`/reviews/${reviews[0]._id}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        rating: Math.floor(Math.random() * 5 + 1),
        text: faker.lorem.words(50),
      });

    expect(response.statusCode).toEqual(403);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("trying to edit user_id and movie_id should fail", async () => {
    const reviewToUpdate = await Review.find({
      user_id: usersaya_id,
    });
    const response = await request(app)
      .put(`/reviews/${reviewToUpdate[0]._id}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        user_id: ["not a real name"],
        movie_id: ["not a real movie"],
        rating: Math.floor(Math.random() * 5 + 1).toString(),
        text: faker.lorem.words(50),
      });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("update review should fail when rating or text is empty", async () => {
    const reviewToUpdate = await Review.find({
      user_id: usersaya_id,
    });
    const response = await request(app)
      .put(`/reviews/${reviewToUpdate[0]._id}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        rating: "",
        text: "",
      });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("update review not found", async () => {
    const reviewToUpdate = await Review.find({
      user_id: usersaya_id,
    });
    const response = await request(app)
      .put(`/reviews/610942b93c00c02068f97e18`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        rating: Math.floor(Math.random() * 5 + 1).toString(),
        text: faker.lorem.words(50),
      });

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeInstanceOf(Object);
  });
});

describe("/reviews DELETE", () => {
  it("Successfully delete review", async () => {
    const reviewToDelete = await Review.find({
      user_id: usersaya_id,
    });
    const response = await request(app)
      .delete(`/reviews/${reviewToDelete[0]._id}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Should get forbidden when a user tries to delete another user's review", async () => {
    const response = await request(app)
      .delete(`/reviews/${reviews[0]._id}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(403);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("delete review not found", async () => {
    const response = await request(app)
      .delete("/reviews/610aa6c0e334ec5806445084")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeInstanceOf(Object);
  });
});
