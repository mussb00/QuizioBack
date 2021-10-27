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
  let api
  beforeAll(async () => {
      
      //launch server
       api = app.listen(5000, () => console.log("test server is running on 5000"));
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
      })
      
      
      
      
      
      beforeEach(async ()=>{
      })
    afterEach(async () => {
    

      
    });
    
    afterAll(async () => {
      
      await api.close();
      await mongoose.connection.close();
 
    
    });


it("gets to  home '/'  with code 200", async () =>{
    const res = await request(api).get("/");
    expect(res.statusCode).toEqual(200);
})


it("can register  new user2", async () =>{
  const res = await request(api)
  .post("/auth/register")
  .send({
      email:"test7@test.com",
      username:"testuser4",
      password:"qwerty" })
      .set("Content-Type", "application/json")
    .expect(201)
   // expect(res.body).toHaveProperty("newUser");
   

  });
it("can create another  new user2", async () =>{
  const res = await request(api)
  .post("/auth/register")
  .send({
      email:"test77@test.com",
      username:"testuser77",
      password:"qwerty" })
      .set("Content-Type", "application/json")
    .expect(201)
   // expect(res.body).toHaveProperty("newUser");
   

  });

})


