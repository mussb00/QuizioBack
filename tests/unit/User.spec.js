
const request = require('supertest')

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const {User} = require('../../dbConfig/init.js')
const {verifyToken} = require('../../Middleware/auth')
const dotenv = require('dotenv');
dotenv.config()


//  what elese to import??




describe("User schema tests", () => {
    beforeAll(async () => {
        mongoose.connect(process.env.TEST_CONNECTION_URL, {
            useNewUrlParser: true
        }, () => {
            console.log('connected to test db')
        })
        await User.deleteMany({});
    })
    afterEach(async () => {
        await User.deleteMany({})
    })
    afterAll(async () => {
        await mongoose.connection.close()
    })



    it('has a module that is defined', () => {
        expect(User).toBeDefined();
    })

    it("creates a user", async () => {
        const testUser = new User({name: "test",email:"test@test.com",password:"qwerty"})
        await testUser.save();
        const foundUser = await User.findOne({name: "test"});
        expect(foundUser.name).toEqual(testUser.name)
    })

    it('does not create user without required info', async() => {
        const testUser = new User({name: 'test2'})
        expect(testUser.save()).rejects
    })

})
