export const mongoConfig = {
  //serverUrl: `mongodb://mongo:27017/`, //changed from localhost
  // `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongo:27017/admin`, //changed from localhost

  serverUrl: 
  `mongodb+srv://dramm:${process.env.MONGO_INITDB_ROOT_PASSWORD}@554-final-project.xcldy.mongodb.net/?retryWrites=true&w=majority&appName=554-Final-Project`,
  database: 'dramm'
};