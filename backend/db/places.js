import { places } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

let exportedMethods = {
    async getAllPlaces() {
        const placeCollection = await places();
        return await placeCollection.find({}).toArray();
    },

    async getPlaceById(id) {
        const placeCollection = await places();
        const place = await placeCollection.findOne({ _id: new ObjectId(id) });
        if (!place) {
            throw "Error: place not found";
        }
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

        return await this.getPlaceById(newInsertInformation.insertedId.toString());
    },

    async addReviewToPlace(placeId,post,poster_id) {
        const newReview = {
            _id:new ObjectId(),
            review: post,
            poster_id:poster_id,

        }

        const placeCollection = await places();

        const result =
        await placeCollection.updateOne(
            { _id: placeId},
            { $push: { reviews: newReview } }
         );
         return result;
    }

    

};
export default exportedMethods;