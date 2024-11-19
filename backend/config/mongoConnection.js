// import {MongoClient} from 'mongodb';
// import {mongoConfig} from './settings.js';

// let _connection = undefined;
// let _db = undefined;

// const dbConnection = async () => {
//   if (!_connection) {
//     _connection = await MongoClient.connect(mongoConfig.serverUrl);
//     _db = _connection.db(mongoConfig.database);
//   }

//   return _db;
// };
// const closeConnection = async () => {
//   await _connection.close();
// };

// export {dbConnection, closeConnection};

import {MongoClient} from 'mongodb';
const settings = {
  mongoConfig: {
    serverUrl: 'mongodb://localhost:27017/',
    database: 'movies'
  }
};
const mongoConfig = settings.mongoConfig;

let _connection = undefined;
let _db = undefined;

const dbConnection = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl);
    _db = _connection.db(mongoConfig.database);
  }

  return _db;
};
const closeConnection = async () => {
  await _connection.close();
};

export {dbConnection, closeConnection};