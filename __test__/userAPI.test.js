const request = require("supertest");
const app = "http://localhost:3002";
const {
  connect,
  disconnect,
  cleanData,
} = require("../__helper__/mongodb.memory.test.helper");

beforeAll(async () => {
  await connect();
});

afterAll(async () => {
  await disconnect();
});

beforeEach(async () => {
  await cleanData();
});

const registerUserPayload = {
  name: "sunima",
  email: "sunima@gmail.com",
  password: "sunima",
  contactNo: "9813299299",
  gender: "FEMALE",
  vehicleType: "TWO_WHEELER",
  isBookingUser: true,
};

describe("POST /register", () => {
  test("responds with a 201 status code", async () => {
    const response = await request(app)
      .post("/register-user")
      .send(registerUserPayload);

    expect(response.statusCode).toBe(200);
  });

  test("responds with a 400 status code when required fields are missing", async () => {
    const { name, ...payloadWithoutName } = registerUserPayload;

    const response = await request(app)
      .post("/register")
      .send(payloadWithoutName);

    expect(response.statusCode).toBe(400);
  });
});

describe("POST /login", () => {
  test("responds with a 200 status code and a JWT token", async () => {
    const response = await request(app)
      .post("/login")
      .send({ email: "sunima@gmail.com", password: "sunima" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  test("responds with a 401 status code when credentials are incorrect", async () => {
    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "wrongpassword" });

    expect(response.statusCode).toBe(401);
  });
});
