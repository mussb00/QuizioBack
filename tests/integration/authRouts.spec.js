const request = require('supertest')

const app = require('../../server')

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const {User} = require('../../dbConfig/init.js')
const {verifyToken} = require('../../Middleware/auth')
const dotenv = require('dotenv');
dotenv.config()


describe("Auth tests", () => {
    let api;
    beforeAll(async () => {
      //launch server
      api = app.listen(5000, () => console.log("test server launched on 5000"));
      //connect to test db
      mongoose.connect(
        process.env.TEST_CONNECTION_URL,
        {
          useNewUrlParser: true,
        },
        () => {
          console.log("connected to test db");
        }
      );
     
   // const Users =  await User.find();
   // console.log('test', Users)
    });
    afterAll(async () => {
      //close connections after test suite runs
      await api.close();
      await mongoose.connection.close();
    });


it("gets to  home '/'  with code 200", async () =>{
    const res = await request(api).get("/");
    expect(res.statusCode).toEqual(200);
})


it("can register  new user", async () =>{
  const res = await request(api)
  .post("/auth/register")
  .send({
      email:"test4@test.com",
      username:"testuser4",
      password:"qwerty" })
      .set("Content-Type", "application/json")
    .expect(201)
    expect(res.body).toHaveProperty("newUser");
    const token = res.headers['auth-token']

  });

  /*
  it("can not register  new user with no valid email", async () =>{
    const res =await request(api)
    .post("/auth/register")
    .send({
        email:"test",
        username:"testuser",
        password:"qwerty" })
        .set("Content-Type", "application/json")
      .expect(500)
    });
    */
    
    it("allows login of existing user", async () => {
      // create new user
      const testUser = await request(api)
        .post('/auth/register')
        .send({
          email:"test5@test.com",
          username:"testuser5",
          password:"qwerty" })
          .set("Content-Type", "application/json")

        // need to add token??

        // then login
        const res = await request(api)
        .post('/auth/login')
        .send({
          email:"test5@test.com",
          password:"qwerty" })
          .set("Content-Type", "application/json")
          .expect(200)
          
        

});

})