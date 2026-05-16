jest.setTimeout(20000);
const request = require("supertest");
const app = require("../app");

const db = require("../models/db-handler");
const Trip = require("../models/trips");

jest.setTimeout(20000);

beforeAll(async () => {
  await db.connect();
});

afterEach(async () => {
  await db.clearDatabase();
});

afterAll(async () => {
  await db.closeDatabase();
});

describe("GET /trips", () => {

  test("Doit retourner les trajets correspondants", async () => {

    const response = await request(app)
      .get("/trips")
      .query({
        depart: "Paris",
        arrivee: "Lyon",
        jour: "2026-05-21",
      });

    expect(response.statusCode).toBe(200);

    expect(response.body.result).toBe(true);

    expect(Array.isArray(response.body.trips)).toBe(true);
  });

  test("Doit retourner 400 si paramètres manquants", async () => {

    const response = await request(app)
    .get("/trips")
    .query({
      depart: "Paris",
    });

    expect(response.statusCode).toBe(400);

    expect(response.body.result).toBe(false);

    expect(response.body.error).toBe(
    "Veuillez renseigner depart, arrivee et jour"
    );
  });
});

describe("POST /trips/selectrip", () => {

  test("Doit créer un trajet", async () => {

    const response = await request(app)
      .post("/trips/selectrip")
      .send({
        depart: "Paris",
        arrivee: "Marseille",
        jour: "2026-05-25",
        prix: 80,
      });

    expect(response.statusCode).toBe(200);

    expect(response.body.result).toBe(true);

    const trip = await Trip.findOne({
      departure: "Paris",
    });

    expect(trip).not.toBeNull();

    expect(trip.arrival).toBe("Marseille");
  });

  test("Doit refuser un trajet incomplet", async () => {

    const response = await request(app)
        .post("/trips/selectrip")
        .send({
        depart: "Paris",
        });

    expect(response.body.result).toBe(false);

    expect(response.body.error).toBe(
        "Le trajet n'est pas complet!"
    );
  });

  test("Doit refuser un trajet déjà existant", async () => {

    await Trip.create({
        departure: "Paris",
        arrival: "Lyon",
        date: "2026-05-25",
        price: 90,
    });

    const response = await request(app)
        .post("/trips/selectrip")
        .send({
        depart: "Paris",
        arrivee: "Lyon",
        jour: "2026-05-25",
        prix: 90,
        });

    expect(response.body.result).toBe(false);

    expect(response.body.error).toBe(
        "Ce trajet existe déjà"
    );
  });
});

describe("GET /trips/panier", () => {

  test("Doit retourner les trajets sélectionner dans le panier", async () => {

    const response = await request(app)
      .get("/trips/panier");

    expect(response.statusCode).toBe(200);

    expect(response.body.result).toBe(true);

    expect(Array.isArray(response.body.trips)).toBe(true);
  });
});

describe("GET /trips/book", () => {

  test("Doit retourner les trajets acheter dans le book", async () => {

    const response = await request(app)
      .get("/trips/book");

    expect(response.statusCode).toBe(200);

    expect(response.body.result).toBe(true);

    expect(Array.isArray(response.body.trips)).toBe(true);
  });
});