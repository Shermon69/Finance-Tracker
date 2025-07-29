const request = require("supertest");
const app = require("../index");
const { connectTestDB, closeTestDB, clearTestDB } = require("../config/DbTest");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

let token;
let userId;
let goalId;

beforeAll(async () => {
    await connectTestDB();

    // Creating a test user
    const user = await User.create({
        name: "Test User",
        email: "test@example.com",
        password: "test123",
    });

    userId = user._id;
    token = `Bearer ${jwt.sign({ id: user._id }, process.env.JWT_SECRET || "testsecret", { expiresIn: "1h" })}`;
});

afterAll(async () => {
    await closeTestDB();
});

beforeEach(async () => {
    await clearTestDB();
});

describe("Goal API Testing", () => {

    it("Should create a new goal", async () => {
        const res = await request(app)
            .post("/api/users/goals")
            .set("Authorization", token)
            .send({
                name: "Save for Car",
                targetAmount: 5000,
                deadline: "2025-12-31"
            });

        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body[0]).toHaveProperty("_id");

        goalId = res.body[0]._id; // Storing goal ID for next tests
    });

    it("Should fetch all goals for the user", async () => {
        const res = await request(app)
            .get("/api/users/goals")
            .set("Authorization", token);

        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    it("Should update goal progress", async () => {
        const res = await request(app)
            .put(`/api/users/goals/${goalId}`)
            .set("Authorization", token)
            .send({ amount: 2500 });

        expect(res.status).toBe(200);
        expect(res.body.savedAmount).toBe(2500);
    });

    it("Should notify the user when goal is achieved", async () => {
        // Update goal progress to achieve the target
        await request(app)
            .put(`/api/users/goals/${goalId}`)
            .set("Authorization", token)
            .send({ amount: 5000 });

        // Fetch user to check notifications
        const user = await User.findById(userId);
        const lastNotification = user.notification[user.notification.length - 1];

        expect(lastNotification.message).toContain("Congratulations! You have achieved your goal");
    });

});

