import { users } from '../config/mongoCollections.js';
import redis from "redis";
import { checkId } from './validate.js';
const client = redis.createClient();
await client.connect().then(() => { });
// TODO: error handling + photo error handling for posts
const exportedMethods = {
    async getAllUsers() {
        const redisKey = "users";
        const exists = await client.exists(redisKey);
        if (exists) {
            return await client.json.get(redisKey);
        }
        const userCollection = await users();
        const userList = await userCollection.find({}).toArray();
        return userList;
    },

    async getUserById(id) {
        if (!id) throw new Error('You must provide an ID');
        if (!checkId(id)){
            throw new Error('Invalid ID');
        }
        const redisKey = `user:${id}`;
        const exists = await client.exists(redisKey);
        if (exists) {
            return await client.json.get(redisKey);
        }
        const userCollection = await users();
        const user = await userCollection.findOne({ _id: id });
        if (!user) throw new Error(`User with ID ${id} not found`);
        await client.json.set(redisKey, "$", user);
        return user;
    },
    // NEED FIREBASE TO VALIDATE IF UID EXISTS ON FIREBASE
    async addUserIfNotExists(uid) {
        if (!uid) throw new Error('User ID is required');
      
        if (!checkId(uid)){
            throw new Error('Invalid ID');
        }
      
        const userCollection = await users();
        const existingUser = await userCollection.findOne({ _id: uid });
        if (!existingUser) {
            const newUser = {
                _id: uid,
                places: [],
                streak: 0,
            };

            const newInsertInformation = await userCollection.insertOne(newUser);

            if (!newInsertInformation.insertedId) {
                throw new Error('Insert failed!');
            }
            await client.del("users");
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
        state = "Unknown State",
        rating = null
    ) {
        if (!uid || !placeId) {
            throw new Error("User ID and Place ID are required");
        }
        if (!checkId(uid) || !checkId(placeId)){
            throw new Error('Invalid ID');
        }

        const userCollection = await users();

        // Check if the place already exists for the user
        const existingPlace = await userCollection.findOne({
            _id: uid,
            "places.placeId": placeId,
        });

        if (existingPlace) {
            // Update existing place with only provided fields
            const updateFields = {
                "places.$.isBookmarked": isBookmarked,
                "places.$.isVisited": isVisited,
                ...(rating !== null && { "places.$.rating": rating }), // Update rating only if provided
            };

            const result = await userCollection.updateOne(
                { _id: uid, "places.placeId": placeId },
                { $set: updateFields }
            );

            if (!result.modifiedCount) {
                throw new Error("Failed to update place for user");
            }

            console.log("Existing place updated successfully:", result);
            return { updated: true };
        } else {
            // Add a new place
            const newPlace = {
                placeId,
                isBookmarked,
                isVisited,
                name: name || "Unknown Place",
                image: image || "",
                location: location.length > 0 ? location : ["No Address Available"],
                city: city || "Unknown City",
                state: state || "Unknown State",
                rating,
            };

            const result = await userCollection.updateOne(
                { _id: uid },
                { $addToSet: { places: newPlace } }
            );

            if (!result.modifiedCount) {
                throw new Error("Failed to add new place for user");
            }

            console.log("New place added successfully:", result);
            await client.del("placesForUser*");
            return { inserted: true };
        }
    },

    async removePlaceForUser(uid, placeId) {
        if (!uid || !placeId) {
            throw new Error("User ID and Place ID are required");
        }
        if (!checkId(uid) || !checkId(placeId)){
            throw new Error('Invalid ID');
        }

        const userCollection = await users();

        const result = await userCollection.updateOne(
            { _id: uid },
            { $pull: { places: { placeId } } }
        );

        if (!result.modifiedCount) {
            throw new Error("Failed to remove place");
        }

        await client.del("placesForUser*");

        return { removed: true };
    },

    async getPlacesForUser(uid, type) {
        if (!uid) throw new Error("User ID is required");
        if (!checkId(uid) ){
            throw new Error('Invalid ID');
        }

        let redisKey = "";
        if (type === "bookmarked" || type === 'visited') {
            redisKey = `placesForUser:${uid}:${type}`;
        } else {
            redisKey = `placesForUser:${uid}`;

        }
        let placesForUserExists = await client.exists(redisKey)

        if (placesForUserExists) {
            const placesForUser =
                await client.json.get(redisKey);

            return placesForUser;
        }
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
            const bookmarkedPlaces = places.filter(place => place.isBookmarked);

            await client.json.set(redisKey, "$", bookmarkedPlaces);

            return bookmarkedPlaces;
        } else if (type === "visited") {
            const visitedPlaces = places.filter(place => place.isVisited);
            await client.json.set(redisKey, "$", visitedPlaces);

            return visitedPlaces;
        }

        await client.json.set(redisKey, "$", places);

        return places;
    },

    async getUserPhoto(uid) {
        if (!uid) throw new Error("User ID is required");
        if (!checkId(uid) ){
            throw new Error('Invalid ID');
        }
        const userCollection = await users();
        const user = await userCollection.findOne({ _id: uid }, { projection: { photo: 1 } });
        return user?.photo || null;
    },

    async saveUserPhoto(uid, photo) {
        if (!uid) throw new Error("User ID is required");
        if (!photo) throw new Error("Photo is required");
        if (!checkId(uid)){
            throw new Error('Invalid ID');
        }

        const redisKey = `user:${id}`
        const userCollection = await users();
        const updateResult = await userCollection.updateOne(
            { _id: uid },
            { $set: { photo } },
            { upsert: true }
        );

        if (!updateResult.matchedCount && !updateResult.upsertedCount) {
            throw new Error("Failed to update user photo");
        }

        await client.del(redisKey);
        return { success: true, photo };
    },

    async updateUserProfile(uid, updateFields) {
        if (!uid || !updateFields) {
            throw new Error("User ID and fields to update are required");
        }
        if (!checkId(uid)){
            throw new Error('Invalid ID');
        }

        const redisKey = `user:${uid}`

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
        await client.del(redisKey);
        return { uid, updatedFields: updateFields };
    },
};

export default exportedMethods;