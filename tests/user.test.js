const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = require("../src/app.js");
const User = require("../src/models/user");

const userOneId = new mongoose.Types.ObjectId;

const userOne = {
    _id: userOneId,
    name: "one",
    email:"one@gmal.com",
    password:"samplepasswordone",
    tokens:[{
       token: jwt.sign({_id : userOneId },process.env.JWT_SEC)
    }]
}

//provides same environment ot every test
beforeEach(async ()=>{
    await User.deleteMany();
    await new User(userOne).save();
});

afterEach(()=>{
    
});

test("signup new user",async () =>{
    const res = await request(app).post("/user").send({
        name: "prj",
        email:"prj@gmal.com",
        password:"samplepassword77"
    }).expect(201);

    //assertion to checkdatabse response
    const user = await User.findById(res.body.user._id);
    expect(user).not.toBeNull();
         
    expect(user.password).not.toBe("samplepassword77");// should be encrypted

    expect(res.body).toMatchObject({
      user:{
         name: "prj",
         email:"prj@gmal.com",
      },
        token: user.tokens[0].token
    });
});

test("log in new user",async () =>{
    const res = await request(app).post("/user/login").send({
        email:userOne.email,
        password:userOne.password
    }).expect(200);

    const user  = await User.findById(userOneId);
    expect(res.body.token).toBe(user.tokens[1].token);
});


test("non existent user",async () =>{
    await request(app).post("/user/login").send({
        email:userOne.email,
        password:"incorrect"
    }).expect(400);
});


test("get user profile",async () =>{
    await request(app).get("/user/me")
                      .set("Authorization",`Bearer ${userOne.tokens[0].token}`)
                      .send().expect(200);
});


test("should not get unauthorized user profile",async () =>{
    await request(app).get("/user/me")
                      .send().expect(401);
});

test("delete user account",async () =>{
    await request(app).delete("/user/me")
                      .set("Authorization",`Bearer ${userOne.tokens[0].token}`)
                      .send().expect(200);
    
    //Assertion to check if user is deleted
    const user = await User.findById(userOneId);
    expect(user).toBeNull();
                                    
});

test("should not delete unauthorized user account",async () =>{
    await request(app).get("/user/me")
                      .send().expect(401);
});


test("update user data",async () =>{
    await request(app).patch("/user/me")
                      .set("Authorization",`Bearer ${userOne.tokens[0].token}`)
                      .send({
                          name: "newprj" 
                      }).expect(200);
    const user = await User.findById(userOneId);
    expect(user.name).toEqual("newprj");
});


test("should not update unauthorized user data",async () =>{
    await request(app).patch("/user/me")
                      .send({
                          name: "newprj" 
                      }).expect(401);
});


//TODO: Tests for user Profile