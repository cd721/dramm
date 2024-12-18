export const mongoConfig = {
  serverUrl: `mongodb+srv://dramm:${encodeURIComponent(process.env.MONGO_INITDB_ROOT_PASSWORD)}@554-final-project.xcldy.mongodb.net/dramm?retryWrites=true&w=majority&appName=554-Final-Project`,
  database: 'dramm'
};