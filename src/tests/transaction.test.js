const request = require("supertest");
const app = require("../index");
const { connectTestDB, closeTestDB, clearTestDB } = require("../config/DbTest");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

let token;

beforeAll(async () => {
    await connectTestDB();

    const user = await User.create({
        name: "Test User",
        email: "test@example.com",
        password: "test123",
    });

    token = `Bearer ${jwt.sign({ id: user._id }, process.env.JWT_SECRET || "testsecret", { expiresIn: "1h" })}`;
});

afterAll(async () => {
    await closeTestDB();
});

beforeEach(async () => {
    await clearTestDB();
});

describe("Transaction API Testing", () => {
    it("Should create a new transaction", async () => {
        const res = await request(app)
            .post("/api/transactions")
            .set("Authorization", token)
            .send({
                type: "expense",
                catagory: "Food",
                amount: 1000,
                currency: "USD",
                baseCurrency: "USD",
                note: "Lunch",
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("_id");
        expect(res.body.amount).toBe(1000);
    });

    it("Should fetch all transactions for the user", async () => {
        await Transaction.create({
            user: new mongoose.Types.ObjectId(),
            type: "income",
            catagory: "Salary",
            amount: 5000,
            currency: "USD",
            baseCurrency: "USD",
        });

        const res = await request(app)
            .get("/api/transactions")
            .set("Authorization", token);

        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });
});
