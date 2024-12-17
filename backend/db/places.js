import { places } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import redis from 'redis';
const client = redis.createClient({
 url: 'redis://cache:6379', 
      socket: {
    connectTimeout: 50000,
  },
});await client.connect().then(() => { });

let exportedMethods = {
    async getAllPlaces() {
        const redisKey = "places"
        const exists = await client.exists(redisKey);
        if (exists) {
            const allPlaces =
                await client.json.get(redisKey);
            return allPlaces;
        }

        const placeCollection = await places();
        const allPlaces = await placeCollection.find({}).toArray();
        await client.json.set(redisKey, '$', allPlaces);

        return allPlaces;
    },

    async getPlaceById(id) {
        const redisKey = `place:${id}`;
        const placeExists = await client.exists(redisKey);

        if (placeExists) {
            const place =
                await client.json.get(redisKey);
            return place;
        }
        const placeCollection = await places();
        const place = await placeCollection.findOne({ _id: new ObjectId(id) });
        if (!place) {
            throw "Error: place not found";
        }

        await client.json.set(redisKey, '$', place);

        return place;
    },

    async addPlace(place_id, name) {
        let newplace = {
            _id: place_id,
            name: name, reviews: [], rating: null
        }

        const placeCollection = await places();

        const newInsertInformation = await placeCollection.insertOne(newplace);

        if (!newInsertInformation.insertedId) {
            throw "Insert failed!";
        }
        await client.flushDb();
        return await this.getPlaceById(newInsertInformation.insertedId.toString());
    },

    async addReviewToPlace(placeId, post, poster_id) {
        const newReview = {
            _id: new ObjectId(),
            review: post,
            poster_id: poster_id,

        }

        const placeCollection = await places();

        const result =
            await placeCollection.updateOne(
                { _id: placeId },
                { $push: { reviews: newReview } }
            );

        await client.flushDb();
        return result;
    }



};
export default exportedMethods;
