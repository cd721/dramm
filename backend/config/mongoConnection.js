import { MongoClient } from 'mongodb';
import { mongoConfig } from './settings.js';

let _connection = undefined;
let _db = undefined;

const dbConnection = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl);
    _db = _connection.db(mongoConfig.database);

  }
  console.log("***CONNECTION:   "+ `${process.env.MONGO_INITDB_ROOT_PASSWORD}`)
  return _db;
};
const closeConnection = async () => {
  await _connection.close();
};

export { dbConnection, closeConnection };

