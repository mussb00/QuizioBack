const request = require('supertest')

const app = require('../../server')

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const {User} = require('../../dbConfig/init.js')
const {verifyToken} = require('../../Middleware/auth')
const dotenv = require('dotenv');
const { reset } = require('nodemon');
dotenv.config()


describe("Auth tests", () => {
  let api
  beforeAll(async () => {
      
  
       api = app.listen(5000, () => console.log("test server is running on 5000"));
       process.env.CONNECTION_URL = process.env.TEST_CONNECTION_URL
    //   console.log("URL1", process.env.CONNECTION_URL);
      // console.log("URL2", process.env.TEST_CONNECTION_URL);
      
     await mongoose.connect(
         process.env.CONNECTION_URL,
         {
           useNewUrlParser: true,
         },
         () => {
           console.log("connected to test db");
         }
       ); 
       await User.deleteMany({});
      })
      
      
      
      
      
    beforeEach(async ()=>{

    })
    afterEach(async () => {

    });
    
    afterAll(async () => {
      
      await api.close();
      await mongoose.connection.close();
 
    
    });



    it("1. gets to  home '/'  with code 200", async () =>{
      const res = await request(api).get("/");
      expect(res.statusCode).toEqual(200);
  })


it("2. can register  new user", async () =>{
  const res = await request(api)
  .post("/auth/register")
  .send({
      email:"testuser@test.com",
      username:"testuser",
      password:"qwerty" })
      .set("Content-Type", "application/json")
    .expect(201) 

  });

  it("2.1 can register another new user", async () =>{
    const res = await request(api)
    .post("/auth/register")
    .send({
        email:"testuser77@test.com",
        username:"testuser77",
        password:"qwerty" })
        .set("Content-Type", "application/json")
      .expect(201) 
  
    });

  // ??
it("3. can not register a user with invalid email", async () =>{
  const res = await request(api)
  .post("/auth/register")
  .send({
    
      username:"testuser",
      password:"qwerty" })
      .set("Content-Type", "application/json")
    .expect(401)
   

  });



it("4.  can login registered user", async () =>{
  const resTestLogin = await request(api)
  .post("/auth/login")
  .send({
      email:"testuser@test.com",
  
      password:"qwerty" })
      .set("Content-Type", "application/json")
    .expect(200)
 
    console.log('from test 4', resTestLogin.body.token)   

  })

    it("5. can not login not registered user", async () =>{
      const res = await request(api)
      .post("/auth/login")
      .send({
          email:"notUser@test.com",
          password:"qwerty" })
          .set("Content-Type", "application/json")
        .expect(401)

})


it("6.  can not login registered user with wrong password", async () =>{
  const res = await request(api)
  .post("/auth/login")
  .send({
      email:"testuser@test.com",
  
      password:"notpassword" })
      .set("Content-Type", "application/json")
    .expect(401)
  })

  it("7. gets updates score", async () =>{
  //   have to add token !  
  // create new user
 // const res = await request(api)
 // .post("/auth/register")
 // .send({ 
  //    email:"testuser77@test.com",
   //   username:"testuser77",
    //  password:"qwerty" })
   //   .set("Content-Type", "application/json")
   // .expect(201) 

    // login this user to get token
    const getToken = await request(api)
  .post("/auth/login")
  .send({
      email:"testuser77@test.com", password:"qwerty" })
      .set("Content-Type", "application/json")

 
    console.log('from test 7', getToken.body.token)   
    const testToken=getToken.body.token

    const test = await request(api)
    .patch("/user/testuser1@test.com")
    .send({
           email:"testuser1@test.com",
           total_scors : 3})
    .set('authorization', testToken)
    .expect(200)
          
    
    console.log('from test 7 patch ', test)
    }) 

      
})
