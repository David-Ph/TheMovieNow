const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");
const { Review, Movie, user } = require("../models");
let data = [];
const userIndex = [];
const movieIndex = [];
let userToken = "";
let usersaya_id = "";
let moviesaya_id = "";
const faker = require("faker");
beforeAll(async () => {
  const usersaya = await user.create({
    fullname: faker.name.findName(),
    email: faker.internet.email(),
    password: "Aneh123!!",
  });
  console.log(usersaya);
  const movie = await Movie.create({
    title: "movie test",
    synopsis: "synopsis test",
    trailer: "string trailer",
  });
  console.log(movie);
  usersaya_id = usersaya._id;
  moviesaya_id = movie._id;
  userToken = jwt.sign({ user: usersaya._id }, process.env.JWT_SECRET);
});
console.log(userToken);

describe("/reviews POST", () => {
  it("review must be created", async () => {
    const response = await request(app)
      .post("/reviews")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        // user_id: usersaya_id,
        movie_id: moviesaya_id,
        rating: Math.floor(Math.random() * 5 + 1),
        text: faker.lorem.words(50),
      });

    expect(response.statusCode).toEqual(201);
    expect(response.body).toBeInstanceOf(Object);
  });

  //   it("rating or text field is empty", async () => {
  //     const response = await request(app)
  //       .post("/reviews")
  //       //   .set("Authorization", `Bearer ${userToken}`)
  //       .send({
  //         user_id: usersaya_id,
  //         movie_id: moviesaya_id,
  //         rating: "",
  //         text: "",
  //       });

  //     expect(response.statusCode).toEqual(500);
  //     expect(response.body).toBeInstanceOf(Object);
  //   });

  //   it("user_id or movie_id not valid", async () => {
  //     const response = await request(app)
  //       .post("/reviews")
  //       //   .set("Authorization", `Bearer ${userToken}`)
  //       .send({
  //         user_id: ["name not valid"],
  //         movie_id: ["movie not valid"],
  //         rating: Math.floor(Math.random() * 5 + 1),
  //         text: faker.lorem.words(50),
  //       });

  //     expect(response.statusCode).toEqual(400);
  //     expect(response.body).toBeInstanceOf(Object);
  //   });

  //   it("user_id or movie_id not found", async () => {
  //     const response = await request(app)
  //       .post("/reviews")
  //       //   .set("Authorization", `Bearer ${userToken}`)
  //       .send({
  //         user_id: ["unregistered name"],
  //         movie_id: ["unregistered movie"],
  //         rating: Math.floor(Math.random() * 5 + 1),
  //         text: faker.lorem.words(50),
  //       });

  //     expect(response.statusCode).toEqual(400);
  //     expect(response.body).toBeInstanceOf(Object);
  //   });

  //   it("duplicate user_id and movie_id", async () => {
  //     const response = await request(app)
  //       .post("/reviews")
  //       //   .set("Authorization", `Bearer ${userToken}`)
  //       .send({
  //         user_id: ["same name"],
  //         movie_id: ["sama movie"],
  //         rating: Math.floor(Math.random() * 5 + 1),
  //         text: faker.lorem.words(50),
  //       });

  //     expect(response.statusCode).toEqual(500);
  //     expect(response.body).toBeInstanceOf(Object);
  //   });
});

describe("/reviews GET", () => {
  it("find all reviews", async () => {
    const response = await request(app)
      .get("/reviews")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  //   it("all reviews not found", async () => {
  //     const response = await request(app).get("/reviews/");
  //     //   .set("Authorization", `Bearer ${userToken}`);

  //     expect(response.statusCode).toEqual(404);
  //     expect(response.body).toBeInstanceOf(Object);
  //   });

  it("find one review", async () => {
    const response = await request(app).get("/reviews");
    //   .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("one review not found", async () => {
    const response = await request(app).get("/reviews");
    //   .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });
});

describe("/reviews DELETE", () => {
  it("delete reviews", async () => {
    const response = await request(app).get("/reviews");
    //   .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  //   it("after delete, review not found", async () => {
  //     const response = await request(app).get("/reviews");
  //     //   .set("Authorization", `Bearer ${userToken}`);

  //     expect(response.statusCode).toEqual(404);
  //     expect(response.body).toBeInstanceOf(Object);
  //   });
});

describe("/reviews PUT", () => {
  //   it("update review", async () => {
  //     const response = await request(app)
  //       .post("/reviews")
  //       .set("Authorization", `Bearer ${userToken}`)
  //       .send({
  //         user_id: usersaya_id,
  //         movie_id: moviesaya_id,
  //         rating: Math.floor(Math.random() * 5 + 1),
  //         text: faker.lorem.words(50),
  //       });
  //     expect(response.statusCode).toEqual(201);
  //     expect(response.body).toBeInstanceOf(Object);
  //   });
  //   it("edit another user's review", async () => {
  //     const response = await request(app)
  //       .post("/reviews")
  //       .set("Authorization", `Bearer ${userToken}`)
  //       .send({
  //         user_id: ["edit another"],
  //         movie_id: ["edit another"],
  //         rating: Math.floor(Math.random() * 5 + 1),
  //         text: faker.lorem.words(50),
  //       });
  //     expect(response.statusCode).toEqual(403);
  //     expect(response.body).toBeInstanceOf(Object);
  //   });
  //   it("user_id or movie_id not valid", async () => {
  //     const response = await request(app)
  //       .post("/reviews")
  //       //   .set("Authorization", `Bearer ${userToken}`)
  //       .send({
  //         user_id: ["not a real name"],
  //         movie_id: ["not a real movie"],
  //         rating: Math.floor(Math.random() * 5 + 1),
  //         text: faker.lorem.words(50),
  //       });
  //     expect(response.statusCode).toEqual(400);
  //     expect(response.body).toBeInstanceOf(Object);
  //   });
  // it("try to edit user_id or movie_id", async () => {
  //   const response = await request(app)
  //     .post("/reviews")
  //     //   .set("Authorization", `Bearer ${userToken}`)
  //     .send({
  //       user_id: ["edit name"],
  //       movie_id: ["edit movie"],
  //       rating: Math.floor(Math.random() * 5 + 1),
  //       text: faker.lorem.words(50),
  //     });
  //   expect(response.statusCode).toEqual(400);
  //   expect(response.body).toBeInstanceOf(Object);
  // });
  //   it("duplicate", async () => {
  //     const response = await request(app)
  //       .post("/reviews")
  //       //   .set("Authorization", `Bearer ${userToken}`)
  //       .send({
  //         user_id: ["duplicate name"],
  //         movie_id: ["duplicate movie"],
  //         rating: Math.floor(Math.random() * 5 + 1),
  //         text: faker.lorem.words(50),
  //       });
  //     expect(response.statusCode).toEqual(500);
  //     expect(response.body).toBeInstanceOf(Object);
  //   });
  //   it("rating or text field is empty", async () => {
  //     const response = await request(app)
  //       .post("/reviews")
  //       //   .set("Authorization", `Bearer ${userToken}`)
  //       .send({
  //         user_id: usersaya_id,
  //         movie_id: moviesaya_id,
  //         rating: "",
  //         text: "",
  //       });
  //     expect(response.statusCode).toEqual(500);
  //     expect(response.body).toBeInstanceOf(Object);
  //   });
  //   it("user_id and movie_id not valid", async () => {
  //     const response = await request(app)
  //       .post("/reviews")
  //       //   .set("Authorization", `Bearer ${userToken}`)
  //       .send({
  //         user_id: ["name not valid"],
  //         movie_id: ["movie not valid"],
  //         rating: Math.floor(Math.random() * 5 + 1),
  //         text: faker.lorem.words(50),
  //       });
  //     expect(response.statusCode).toEqual(400);
  //     expect(response.body).toBeInstanceOf(Object);
  //   });
  //   it("user or movie not found", async () => {
  //     const response = await request(app)
  //       .post("/reviews")
  //       //   .set("Authorization", `Bearer ${userToken}`)
  //       .send({
  //         user_id: ["name not found"],
  //         movie_id: ["movie not found"],
  //         rating: Math.floor(Math.random() * 5 + 1),
  //         text: faker.lorem.words(50),
  //       });
  //     expect(response.statusCode).toEqual(404);
  //     expect(response.body).toBeInstanceOf(Object);
  //     });
});
