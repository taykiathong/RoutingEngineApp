const {MongoClient} = require('mongodb');
//const db = require("./../js/db.js").dbUtils;
const url = 'mongodb://127.0.0.1:27017';
const databaseName = 'RoutingEngineDB';

describe('Test insert function', () => {
  let connection;
  let db1;

  beforeAll(async () => {
    connection = await MongoClient.connect(url, {
      useNewUrlParser: true,
    });
    db1 = await connection.db(databaseName);
  });

  afterAll(async () => {
    await connection.close();
    await db1.close();
  });

  it('insert doc into db', async () => {

    const mockUser = {_id: '23121234', firstName: 'firstName', lastName: 'lastName', chatMode: "chat", top: "CPF Pay Out"};

    try{
    await db.insertOne(mockUser,'user');
    const users = db1.collection('user');
    const insertedUser = await users.findOne({firstName: 'firstName'});
    expect(insertedUser).toEqual(mockUser);
  } catch (err){
    console.log("User already exists!");
  } 
  });

  it('search for doc in db', async () => {
    const mockUser = {_id: '23121234', firstName: 'firstName', lastName: 'lastName', chatMode: "chat", top: "CPF Pay Out"};
    const user = db1.collection("user");

    try{
      await user.insertOne(mockUser);
      const resultUser = await db.search({id: "some_user_id"}, "user");
      expect(resultUser).toEqual(mockUser);
    } catch(err) {
      console.log("User already exists!");
    }
  });

  it('update doc in db', async () => {
    try{
      await db.update({firstName: "firstName"}, {lastName: "lastName"}, "user");
      const user = db1.collection("user");
      const resultUser = await user.findOne({id: "some_user_id"});
      expect(resultUser.lastName).toBe("lastName");
    } catch(err){
      console.log("Error: " + err);
    }
  });

  it('find docs matching query in db', async () => {
    try{
      const users = db.findAll({top: "CPF payout"}, "user");
      const user = db1.collection("user");
      const results = user.find({top: "CPF payout"}).toArray();
      expect(results).toEqual(users);
    } catch (err) {
      console.log("Error: " + err);
    }
  });

  it('delete doc in db', async () => {
    try{
      await db.delete({top: "CPF payout"}, "user");
      const user = db1.collection("user");
      const resultUser = await user.findOne({top: "CPF payout"});
      expect(resultUser).toBe(null);
    } catch(err){
      console.log("Error: " + err);
    }
  });
});





//const {MongoClient} = require('mongodb');

// beforeAll(async () => {
//     const url = 'mongodb://127.0.0.1:27017'
//     await MongoClient.connect(url, { useNewUrlParser: true })
//   })

//   it('should insert a doc into collection', async () => {
//     const user = db.collection('user');

//     const mockUser = {firstName: 'firstName', lastName: 'lastName'};
//     await user.insertOne(mockUser);

//     const insertedUser = await user.findOne({firstName: 'firstName'});
//     expect(insertedUser).toEqual(mockUser);
//   });




//   //cleans up database after each test
//   async function removeAllCollections () {
//     const collections = Object.keys(MongoClient.connection.collections)
//     for (const collectionName of collections) {
//       const collection = MongoClient.connection.collections[collectionName]
//       await collection.deleteMany()
//     }
//   }
  
//   afterEach(async () => {
//     await removeAllCollections()
//   })





//   //checking if user was saved to database 

//   //const user = require('../model/User') // Link to your user model

// it('Should save user to database', async done => {
//   const res = await request.post('/signup')
// 	.send({
//       firstName: 'firstName',
//       lastName: 'lastName'
//     })

//   // Searches the user in the database
//   const user = await User.findOne({ firstName: 'firstName' })

//   done()
// })

// it('Should save user to database', async done => {
//     // Sends request...
    
//     // Searches the user in the database
//     const user = await User.findOne({ chatMode: 'chat' })
//     expect(user.firstName).toBeTruthy()
//     expect(user.lastName).toBeTruthy()
  
//     done()
//   })

// //checking if returned object contains the info about the user

// it('Should save user to database', async done => {
//     // Sends request...
    
//     // Searches the user in the database... 
  
//     // Ensures response contains name and email 
//     expect(res.body.firstName).toBeTruthy()
//     expect(res.body.lastName).toBeTruthy()
//     done()
//   })