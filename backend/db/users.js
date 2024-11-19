import { users } from '../config/mongoCollections.js'
import ObjectId from 'mongodb'

//TODO: error handling
const exportedMethods = {
    async getAllUsers() {
        const userCollection = await users();
        const userList = await userCollection.find({}).toArray();
        return userList;
    },

    async getUserById(id) {
        if (id === undefined) throw 'You must provide an ID';
        const userCollection = await users();
        const user = await userCollection.findOne({ _id: id });


        return user;
    },
    async addUserIfNotExists(uid) {

        let user = await this.getUserById(uid);
        if (!user) {



            let newUser = {
                _id: uid,
                places: [],
                streak: 0
            };

            const userCollection = await users();
            const newInsertInformation = await userCollection.insertOne(newUser);

            if (!newInsertInformation.insertedId) {
                throw "Insert failed!";
            }


            return { signupCompleted: true };
        }
    },

    async addPlaceForUser(uid, placeId) {
        const userCollection = await users();
        let result = await userCollection.updateOne({ _id: uid }, { $addToSet: { places: placeId } });
        console.log(result)
        return result;
    },
    async getPlacesForUser(uid) {
        const userCollection = await users();

        const foundPlaces = await userCollection.findOne(
            { _id: uid },
            { projection: { _id: 0, 'places.$': 1 } }
        );
        return foundPlaces;
    }
}


export default exportedMethods;