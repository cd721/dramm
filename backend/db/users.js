import { users } from '../config/mongoCollections.js';

// TODO: error handling + photo error handling for posts
const exportedMethods = {
    async getAllUsers() {
        const userCollection = await users();
        const userList = await userCollection.find({}).toArray();
        return userList;
    },

    async getUserById(id) {
        if (!id) throw new Error('You must provide an ID');
        const userCollection = await users();
        const user = await userCollection.findOne({ _id: id });
        if (!user) throw new Error(`User with ID ${id} not found`);
        return user;
    },

    async addUserIfNotExists(uid) {
        if (!uid) throw new Error('User ID is required');
        let user = await this.getUserById(uid);
        if (!user) {
            const newUser = {
                _id: uid,
                places: [],
                streak: 0,
            };

            const userCollection = await users();
            const newInsertInformation = await userCollection.insertOne(newUser);

            if (!newInsertInformation.insertedId) {
                throw new Error('Insert failed!');
            }

            return { signupCompleted: true };
        }
        return { signupCompleted: false };
    },

    async addPlaceForUser(
        uid,
        placeId,
        isBookmarked = false,
        isVisited = false,
        name = "Unknown Place",
        image = "",
        location = ["No Address Available"],
        city = "Unknown City",
        state = "Unknown State"
    ) {
        if (!uid || !placeId) {
            throw new Error("User ID and Place ID are required");
        }

        const userCollection = await users();

        const user = await userCollection.findOne({ _id: uid, "places.placeId": placeId });

        if (user) {
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
                    },
                }
            );

            if (!result.modifiedCount) {
                throw new Error("Place update failed");
            }
            return { updated: true };
        } else {
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
                        },
                    },
                }
            );

            if (!result.modifiedCount && !result.upsertedCount) {
                throw new Error("Place insertion failed");
            }
            return { inserted: true };
        }
    },

    async removePlaceForUser(uid, placeId) {
        if (!uid || !placeId) {
            throw new Error("User ID and Place ID are required");
        }

        const userCollection = await users();

        const result = await userCollection.updateOne(
            { _id: uid },
            { $pull: { places: { placeId } } }
        );

        if (!result.modifiedCount) {
            throw new Error("Failed to remove place");
        }

        return { removed: true };
    },

    async getPlacesForUser(uid, type) {
        if (!uid) throw new Error("User ID is required");

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
        if (!uid || !updateFields) {
            throw new Error("User ID and fields to update are required");
        }

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
    },
};

export default exportedMethods;