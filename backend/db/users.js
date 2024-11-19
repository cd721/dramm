import {users} from '../config/mongoCollections.js'

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
                uid: uid,
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
}


export default exportedMethods;