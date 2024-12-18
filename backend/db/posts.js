import { posts, users } from '../config/mongoCollections.js'
import { ObjectId } from 'mongodb'
import moment from 'moment'
import dayjs from 'dayjs'
import redis from 'redis'
const client = redis.createClient();
await client.connect().then(() => { });
const exportedMethods = {
    async addPost(uid, caption, photo, location, date, rating, locationId) {
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
        if (location.length === 0)
            throw `Error: invalid location`;

        if (!locationId) throw `Error: You must supply a locationId!`;
        if (typeof locationId !== 'string') throw `Error: locationId must be a string!`;
        locationId = locationId.trim();
        if (locationId.length === 0)
            throw `Error: invalid locationId`;

        if (!date) throw `Error: You must supply a date!`;

        if (!date) throw new Error("You must supply a date!");
        if (!dayjs(date, "YYYY-MM-DD", true).isValid()) {
            throw new Error("Invalid date format. Must be in YYYY-MM-DD format.");
        }
        const formattedDate = dayjs(date, "YYYY-MM-DD").format("MM/DD/YYYY");

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

        console.log(formattedDate);
        let newPost = {
            _id: new ObjectId(),
            userId: uid,
            caption,
            photo,
            location,
            locationId,
            date: formattedDate,
            rating,
            comments: [],
            createdAt: new Date().toISOString()
        };
        const newInsertInformation = await postCollection.insertOne(newPost);
        if (!newInsertInformation.insertedId) {
            throw "Insert failed!";
        }
        await client.flushDb();
        return newPost;
    },
    
    async getAllPosts() {
        const redisKey = "posts";
        const exists = await client.exists(redisKey);
        if(exists) {
            return await client.json.get(redisKey);
        }
        const postCollection = await posts();
        const postList = await postCollection.find({}).toArray();
        await client.json.set(redisKey, '$', postList);
        return postList;
    },
    async getPostsByPlace(placeId) {
        if (!placeId) throw 'Error: You must provide an id to search for';
        if (typeof placeId !== 'string') throw 'Error: id must be a string';
        placeId = placeId.trim();
        if (placeId.length === 0) throw 'Error: id cannot be an empty string or just spaces';

        const redisKey = `postsForPlace:${placeId}`;

        try {
            const cachedPosts = await client.json.get(redisKey);
            if (cachedPosts) {
                return cachedPosts;
            }

            const postCollection = await posts();
            const result = await postCollection.find({ locationId: placeId }).toArray();

            if (!result) {
                throw new Error("No posts found for this place ID");
            }

            await client.json.set(redisKey, '$', result);

            return result;
        } catch (error) {
            console.error("Error in getPostsByPlace:", error.message);
            throw new Error("Unable to fetch posts for the given place");
        }
    },
    async getPostsByUser(userId) {
        if (!userId) throw new Error('Error: You must provide an ID to search for');
        if (typeof userId !== 'string') throw new Error('Error: ID must be a string');
        userId = userId.trim();
        if (userId.length === 0) throw new Error('Error: ID cannot be an empty string or just spaces');

        const redisKey = `postsForUser:${userId}`;

        try {
            const postsByUserExists = await client.exists(redisKey);
            if (postsByUserExists) {
                const postsByUser = await client.json.get(redisKey);
                return postsByUser || [];
            }

            const postCollection = await posts();
            const result = await postCollection.find({ userId }).toArray();

            await client.json.set(redisKey, '$', result || []);

            return result || [];
        } catch (error) {
            console.error('Error in getPostsByUser:', error.message);
            throw new Error('Error: Unable to fetch posts for the given user');
        }
    },
    // async editPost(postId, updatedFields) {
    //     if (!postId) throw 'Error: You must provide an id to search for';
    //     if (typeof postId !== 'string') throw 'Error: id must be a string';
    //     postId = postId.trim();
    //     if (postId.length === 0)
    //         throw 'Error: id cannot be an empty string or just spaces';
    //     if (!ObjectId.isValid(postId)) throw 'Error: invalid object ID';
    //     if (Object.keys(updatedFields).length === 0) throw 'no fields to update'

    //     const postCollection = await posts();
    //     const post = await postCollection.findOne({ _id: new ObjectId(postId) });
    //     if (!post) throw "post not found"

    //     let update = {}

    //     if (!updatedFields) throw "must have updated fields"

    //     if (updatedFields.has("caption")) {
    //         let caption = updatedFields.caption

    //         if (!caption) throw `Error: You must supply a caption!`;
    //         if (typeof caption !== 'string') throw `Error: caption must be a string!`;
    //         caption = caption.trim();
    //         if (caption.length < 50 || caption.length > 500)
    //             throw `Error: caption must be between 50 and 500 characters`;
    //         if (!isNaN(caption))
    //             throw `Error: caption is not a valid value for caption as it only contains digits`;

    //         update.caption = caption
    //     }

    //     if (updatedFields.has("photo")) {
    //         update.photo = updatedFields.photo
    //     }

    //     if (updatedFields.has('location')) {
    //         let location = updatedFields.location

    //         if (!location) throw `Error: You must supply a location!`;
    //         if (typeof location !== 'string') throw `Error: location must be a string!`;
    //         location = location.trim();
    //         if (location.length < 5 || location.length > 25)
    //             throw `Error: location must be between 5 and 25 characters`;
    //         if (!isNaN(location))
    //             throw `Error: location is not a valid value for location as it only contains digits`;
    //         update.location = location
    //     }

    //     if (updatedFields.has("date")) {
    //         let date = updatedFields.date

    //         if (!date) throw `Error: You must supply a date!`;
    //         const today = moment().format("MM/DD/YYYY");
    //         if (!moment(date, "MM/DD/YYYY", true).isValid() || !moment(date, "MM/DD/YYYY", true).isSameOrBefore(today, "day")) {
    //             throw "Invalid Date. Must be in MM/DD/YYYY format before today.";
    //         }
    //         update.date = date
    //     }

    //     if (updatedFields.has("rating")) {
    //         let rating = updatedFields.rating
    //         if (!rating) throw `Error: You must supply a rating!`;
    //         if (typeof rating !== 'number') {
    //             throw "rating must be a number"
    //         }
    //         if (isNaN(rating) || rating < 0 || rating > 10) {
    //             throw "invalid rating"
    //         }
    //         const parts = rating.toString().split('.');
    //         if (parts.length > 1 && parts[1].length > 1) {
    //             throw "rating must only have one decimal point"
    //         }
    //         update.rating = rating

    //     }

    //     const updateResult = await postCollection.updateOne(
    //         { _id: new ObjectId(postId) },
    //         { $set: update }
    //     );

    //     if (!updateResult.modifiedCount) {
    //         throw "no changes made";
    //     }

    //     await client.flushDb();

    //     return { postId, updatedFields: update };
    // },
    

    async addComment(postId, uid, comment, name) {
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

        if (!name) throw "must provide name"
        if (typeof name !== 'string') throw 'Error: name must be a string';
        name = name.trim();
        if (name.length === 0)
            throw 'Error: name cannot be an empty string or just spaces';
        if (name.length > 25)
            throw "name must be less than 50 chars"


        const postCollection = await posts();
        const post = await postCollection.findOne({ _id: new ObjectId(postId) });
        if (!post) throw "post not found"
        const userCollection = await users();
        const user = await userCollection.findOne({ _id: uid });
        if (!user) throw "invalid user"
        const newComment = {
            userId: uid,
            name,
            comment
        }

        let updated = await postCollection.updateOne(
            { _id: new ObjectId(postId) },
            { $push: { comments: newComment } }
        )
        if (!updated.modifiedCount) {
            throw "The commend could not be added to the post.";
        }
        
        await client.del("posts");
        await client.del("postsForUser*");
        await client.del("postsForPlace*");

        return newComment;

    }
}

export default exportedMethods;