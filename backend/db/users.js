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
    async addPlaceForUser(
        uid,
        placeId,
        isBookmarked = false,
        isVisited = false,
        name = "Unknown Place",
        image = "",
        location = [],
        city = "Unknown City",
        state = "Unknown State"
    ) {
        const userCollection = await users();

        const user = await userCollection.findOne({ _id: uid, "places.placeId": placeId });

        if (user) {
            // Update existing place
            const result = await userCollection.updateOne(
                { _id: uid, "places.placeId": placeId },
                {
                    $set: {
                        "places.$.isBookmarked": isBookmarked,
                        "places.$.isVisited": isVisited,
                        "places.$.name": name || "Unknown Place",
                        "places.$.image": image || "",
                        "places.$.location": location.length > 0 ? location : ["No Address Available"],
                        "places.$.city": city || "Unknown City",
                        "places.$.state": state || "Unknown State",
                    }
                }
            );
            return result;
        } else {
            // Add a new place
            const result = await userCollection.updateOne(
                { _id: uid },
                {
                    $addToSet: {
                        places: {
                            placeId,
                            isBookmarked,
                            isVisited,
                            name: name || "Unknown Place",
                            image: image || "",
                            location: location.length > 0 ? location : ["No Address Available"],
                            city: city || "Unknown City",
                            state: state || "Unknown State",
                        }
                    }
                }
            );
            return result;
        }
    },
    async removePlaceForUser(uid, placeId) {
        const userCollection = await users();

        const result = await userCollection.updateOne(
            { _id: uid },
            { $pull: { places: { placeId } } }
        );

        return result;
    },
    async getPlacesForUser(uid, type) {
        const userCollection = await users();

        const foundUser = await userCollection.findOne(
            { _id: uid },
            { projection: { _id: 0, places: 1 } }
        );

        if (!foundUser || !foundUser.places) {
            return [];
        }

        const places = foundUser.places;

        if (type === "bookmarked") {
            return places.filter(place => place.isBookmarked);
        } else if (type === "visited") {
            return places.filter(place => place.isVisited);
        }

        return places;
    },
    async getUserPhoto(uid) {
        if (!uid) throw new Error("User ID is required");
        const userCollection = await users();
        const user = await userCollection.findOne({ _id: uid }, { projection: { photo: 1 } });
        return user?.photo || null;
    },
    async saveUserPhoto(uid, photo) {
        if (!uid) throw new Error("User ID is required");
        if (!photo) throw new Error("Photo is required");

        const userCollection = await users();
        const updateResult = await userCollection.updateOne(
            { _id: uid },
            { $set: { photo } },
            { upsert: true }
        );

        if (!updateResult.matchedCount && !updateResult.upsertedCount) {
            throw new Error("Failed to update user photo");
        }

        return { success: true, photo };
    },
    async updateUserProfile(uid, updateFields) {
        const userCollection = await users();
        const updateResult = await userCollection.updateOne(
            { _id: uid },
            { $set: updateFields }
        );

        if (!updateResult.matchedCount) {
            throw new Error(`User with ID ${uid} not found.`);
        }

        if (!updateResult.modifiedCount) {
            throw new Error("No changes made to the user profile.");
        }

        return { uid, updatedFields: updateFields };
    }
}

export default exportedMethods;