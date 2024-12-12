import { posts, users } from '../config/mongoCollections.js'
import {ObjectId} from 'mongodb'
import moment from 'moment'
import dayjs from 'dayjs'
const exportedMethods = {
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
        if (caption.length < 50 || caption.length > 500)
            throw `Error: caption must be between 50 and 500 characters`;
        if (!isNaN(caption))
            throw `Error: caption is not a valid value for caption as it only contains digits`;

        if (!location) throw `Error: You must supply a location!`;
        if (typeof location !== 'string') throw `Error: location must be a string!`;
        location = location.trim();
        if (location.length < 5 || location.length > 25)
            throw `Error: location must be between 5 and 25 characters`;
        if (!isNaN(location))
            throw `Error: location is not a valid value for location as it only contains digits`;
        console.log(date)
        if (!date) throw `Error: You must supply a date!`;

        const [year, month, day] = date.split("-"); 
        const formattedDate = `${month}/${day}/${year}`; 
        const today = dayjs().format("MM/DD/YYYY");
        if (!dayjs(formattedDate, "MM/DD/YYYY", true).isValid() || dayjs(formattedDate, "MM/DD/YYYY", true).isAfter(today, "day")) {
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
            date: formattedDate,
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

        if (!updatedFields) throw "must have updated fields"

        if (updatedFields.has("caption")) {
            let caption = updatedFields.caption

            if (!caption) throw `Error: You must supply a caption!`;
            if (typeof caption !== 'string') throw `Error: caption must be a string!`;
            caption = caption.trim();
            if (caption.length < 50 || caption.length > 500)
                throw `Error: caption must be between 50 and 500 characters`;
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
            const today = moment().format("MM/DD/YYYY");
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
        if (!postId) throw 'Error: You must provide an id to search for';
        if (typeof postId !== 'string') throw 'Error: id must be a string';
        postId = postId.trim();
        if (postId.length === 0)
            throw 'Error: id cannot be an empty string or just spaces';
        if (!ObjectId.isValid(postId)) throw 'Error: invalid object ID';

        if (!uid) throw 'Error: You must provide an id to search for';
        if (typeof uid !== 'string') throw 'Error: id must be a string';
        uid = uid.trim();
        if (uid.length === 0)
            throw 'Error: id cannot be an empty string or just spaces';

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
        if (!postId) throw 'Error: You must provide an id to search for';
        if (typeof postId !== 'string') throw 'Error: id must be a string';
        postId = postId.trim();
        if (postId.length === 0)
            throw 'Error: id cannot be an empty string or just spaces';
        if (!ObjectId.isValid(postId)) throw 'Error: invalid object ID';

        if (!uid) throw 'Error: You must provide an id to search for';
        if (typeof uid !== 'string') throw 'Error: id must be a string';
        uid = uid.trim();
        if (uid.length === 0)
            throw 'Error: id cannot be an empty string or just spaces';
        if (!comment) throw "must provide comment"
        if (typeof comment !== 'string') throw 'Error: comment must be a string';
        comment = comment.trim();
        if (comment.length === 0)
            throw 'Error: comment cannot be an empty string or just spaces';
        if (comment.length > 50)
            throw "comment must be less than 50 chars"

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