import { users, posts } from '../config/mongoCollections.js'
import ObjectId from 'mongodb'
import moment from 'moment'

//TODO: error handling + photo error handling? for posts
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
    },
    async addPost(uid, caption, photo, location, date, rating) {
        const postCollection = await posts();
        const userCollection = await users();
        const user = await userCollection.findOne({ _id: uid });
        if (!user) {
            throw "User not found"
        }

        if (!caption) throw `Error: You must supply a caption!`;
        if (typeof caption !== 'string') throw `Error: caption must be a string!`;
        caption = caption.trim();
        if (caption.length < 50 || caption.length > 2000)
            throw `Error: caption must be between 50 and 2000 characters`;
        if (!isNaN(caption))
            throw `Error: caption is not a valid value for caption as it only contains digits`;

        if (!location) throw `Error: You must supply a location!`;
        if (typeof location !== 'string') throw `Error: location must be a string!`;
        location = location.trim();
        if (location.length < 5 || location.length > 25)
            throw `Error: location must be between 5 and 25 characters`;
        if (!isNaN(location))
            throw `Error: location is not a valid value for location as it only contains digits`;

        if (!date) throw `Error: You must supply a date!`;
        if (!moment(date, "MM/DD/YYYY", true).isValid() || !moment(date, "MM/DD/YYYY", true).isSameOrBefore(today, "day")) {
            throw "Invalid Date. Must be in MM/DD/YYYY format before today.";
        }

        if (!rating) throw `Error: You must supply a rating!`;
        if (typeof rating !== 'number') {
            throw "rating must be a number"
        }
        if (isNaN(rating) || rating < 0 || rating > 10) {
            throw "invalid rating"
        }
        const parts = rating.toString().split('.');
        if (parts.length > 1 && parts[1].length > 1) {
            throw "rating must only have one decimal point"
        }
        let newPost = {
            _id: new ObjectId(),
            userId: uid,
            caption,
            photo,
            location,
            date,
            rating,
            likes: [],
            comments: []
        };
        const newInsertInformation = await postCollection.insertOne(newPost);
        if (!newInsertInformation.insertedId) {
            throw "Insert failed!";
        }
        return { signupCompleted: true };
    },
    async deletePost(postId) {
        if (!postId) throw 'Error: You must provide an id to search for';
        if (typeof postId !== 'string') throw 'Error: id must be a string';
        postId = postId.trim();
        if (postId.length === 0)
            throw 'Error: id cannot be an empty string or just spaces';
        if (!ObjectId.isValid(postId)) throw 'Error: invalid object ID';

        const postCollection = await posts();
        try {
            const result = await postCollection.findOneAndDelete({ _id: postId });
            if (!result.value) {
                throw "item not deleted"
            }
        } catch (e) {
            throw e
        }


        return { deleted: true }


    },
    async getAllPosts() {
        const postCollection = await posts();
        const postList = await postCollection.find({}).toArray();
        return postList;
    },
    async editPost(postId, updatedFields) {
        if (!postId) throw 'Error: You must provide an id to search for';
        if (typeof postId !== 'string') throw 'Error: id must be a string';
        postId = postId.trim();
        if (postId.length === 0)
            throw 'Error: id cannot be an empty string or just spaces';
        if (!ObjectId.isValid(postId)) throw 'Error: invalid object ID';
        if (Object.keys(updatedFields).length === 0) throw 'no fields to update'

        const postCollection = await posts();
        const post = await postCollection.findOne({ _id: postId });
        if (!post) throw "post not found"

        let update = {}

        if (updatedFields.has("caption")) {
            let caption = updatedFields.caption

            if (!caption) throw `Error: You must supply a caption!`;
            if (typeof caption !== 'string') throw `Error: caption must be a string!`;
            caption = caption.trim();
            if (caption.length < 50 || caption.length > 2000)
                throw `Error: caption must be between 50 and 2000 characters`;
            if (!isNaN(caption))
                throw `Error: caption is not a valid value for caption as it only contains digits`;

            update.caption = caption
        }

        if (updatedFields.has("photo")) {
            update.photo = updatedFields.photo
        }

        if (updatedFields.has('location')) {
            let location = updatedFields.location

            if (!location) throw `Error: You must supply a location!`;
            if (typeof location !== 'string') throw `Error: location must be a string!`;
            location = location.trim();
            if (location.length < 5 || location.length > 25)
                throw `Error: location must be between 5 and 25 characters`;
            if (!isNaN(location))
                throw `Error: location is not a valid value for location as it only contains digits`;
            update.location = location
        }

        if (updatedFields.has("date")) {
            let date = updatedFields.date

            if (!date) throw `Error: You must supply a date!`;
            if (!moment(date, "MM/DD/YYYY", true).isValid() || !moment(date, "MM/DD/YYYY", true).isSameOrBefore(today, "day")) {
                throw "Invalid Date. Must be in MM/DD/YYYY format before today.";
            }
            update.date = date
        }

        if (updatedFields.has("rating")) {
            let rating = updatedFields.rating
            if (!rating) throw `Error: You must supply a rating!`;
            if (typeof rating !== 'number') {
                throw "rating must be a number"
            }
            if (isNaN(rating) || rating < 0 || rating > 10) {
                throw "invalid rating"
            }
            const parts = rating.toString().split('.');
            if (parts.length > 1 && parts[1].length > 1) {
                throw "rating must only have one decimal point"
            }
            update.rating = rating

        }

        const updateResult = await postCollection.updateOne(
            { _id: postId },
            { $set: update }
        );

        if (!updateResult.modifiedCount) {
            throw "no changes made";
        }
        return { postId, updatedFields: update };
    },
    async addLike(postId, uid){

        const postCollection = await posts();
        const post = await postCollection.findOne({ _id: postId });
        if (!post) throw "post not found"
        const userCollection = await users();
        const user = await userCollection.findOne({ _id: uid });
        if (!user) throw "invalid user"
        try{
            let updated = await post.updateOne(
                {_id: postId},
                {$push: {likes: uid}}
            )
            if (!updated.modifiedCount) {
                throw "no changes made";
            }

        } catch(e){
            throw e
        }
        return {updated: true}
        
    },
    async addComment(postId, uid, comment ){
        const postCollection = await posts();
        const post = await postCollection.findOne({ _id: postId });
        if (!post) throw "post not found"
        const userCollection = await users();
        const user = await userCollection.findOne({ _id: uid });
        if (!user) throw "invalid user"
        const newComment = {
            userId : uid,
            comment
        }
        try{
            let updated = await post.updateOne(
                {_id: postId},
                {$push: {comments: newComment}}
            )
            if (!updated.modifiedCount) {
                throw "no changes made";
            }
        } catch(e){
            throw e
        }
        return {updated: true}

    }
}

export default exportedMethods;