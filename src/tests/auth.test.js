const request = require("supertest");
const app = require("../index");
const { connectTestDB, closeTestDB, clearTestDB } = require("../config/DbTest");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

beforeAll(async () => {
    await connectTestDB();

    const hashedPassword = await bcrypt.hash("test123", 10);

    await User.create({
        name: "Test User",
        email: "test@example.com",
        password: hashedPassword,  //Storing hashed password
    });
});

afterAll(async () => {
    await closeTestDB();
});

beforeEach(async () => {
    await clearTestDB();
});

describe("Auth API Testing", () => {
    it("Should register a new user", async () => {
        const res = await request(app).post("/api/auth/register").send({
            name: "Test User",
            email: "test@example.com",
            password: "test123",
        });
        
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("token");
    });

    it("Should login an existing user", async () => {
        await User.create({
            name: "Test User",
            email: "test@example.com",
            password: "test123",
        });
        const hashedPassword = await bcrypt.hash("test123", 10);

        const res = await request(app).post("/api/auth/login").send({
            email: "test@example.com",
            password: hashedPassword,
        });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("token");
    });
});
