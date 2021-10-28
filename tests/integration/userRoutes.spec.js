const request = require('supertest')

const app = require('../../server')

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const {User} = require('../../dbConfig/init.js')
const {verifyToken} = require('../../Middleware/auth')
const dotenv = require('dotenv');
dotenv.config()


describe("ueserRoutes tests", () => {
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
