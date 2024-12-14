import users from '../db/users.js';
import posts from '../db/posts.js';
import moment from "moment"
import { ObjectId } from 'mongodb';
import dayjs from 'dayjs';
// TODO: error handling, figure out photo error handling for posts

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

const constructorMethod = (app) => {
    app.get("/users/:uid/places", async (req, res) => {
        try {
            const places = await users.getPlacesForUser(req.params.uid);
            return res.status(200).json(places);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    });

    app.patch("/users/:uid/places/:placeId", async (req, res) => {
        try {
            const result = await users.addPlaceForUser(req.params.uid, req.params.placeId);
            return res.status(200).json(result);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    });

    app.get("/users", async (req, res) => {
        try {
            const allUsers = await users.getAllUsers();
            return res.status(200).json(allUsers);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    });

    app.get("/users/:uid", async (req, res) => {
        try {
            const user = await users.getUserById(req.params.uid);
            return res.status(200).json(user);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    });

    app.post('/users/:uid', async (req, res) => {
        try {
            const result = await users.addUserIfNotExists(req.params.uid);
            return res.status(200).json(result);
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }
    });

    app.get("/users/:uid/photo", async (req, res) => {
        try {
            const photo = await users.getUserPhoto(req.params.uid);
            if (!photo) return res.status(404).json({ error: "User photo not found" });
            return res.status(200).json({ photo });
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    });

    app.patch('/users/:uid/photo', async (req, res) => {
        try {
            const { photo } = req.body;

            if (!photo) {
                return res.status(400).json({ error: "Photo is required in the request body" });
            }

            const buffer = Buffer.from(photo.split(",")[1], "base64");

            if (buffer.length > MAX_FILE_SIZE) {
                return res.status(413).json({ error: "Photo size exceeds 2 MB limit." });
            }

            const result = await users.updateUserProfile(req.params.uid, { photo });
            return res.status(200).json({ success: true, result });
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    });

    app.patch('/users/:uid/details', async (req, res) => {
        try {
            const { displayName, zipCode, bio } = req.body;

            const updateFields = {};
            if (displayName) updateFields.displayName = displayName;
            if (zipCode) updateFields.zipCode = zipCode;
            if (bio) updateFields.bio = bio;

            if (Object.keys(updateFields).length === 0) {
                return res.status(400).json({ error: "No fields to update" });
            }

            const result = await users.updateUserProfile(req.params.uid, updateFields);
            return res.status(200).json({ success: true, result });
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    });

    app.get("/posts/byLocation/:id", async (req, res) =>{
        let placeId = req.params.id
        if (!placeId) return res.status(400).json({ error: "Must provide id" });
        if (typeof placeId !== 'string') return res.status(400).json({ error: "ID must be string" });
        placeId = placeId.trim();
        if (placeId.length === 0)
            return res.status(400).json({ error: "ID cant be empty string" });

        try {
            const postPlace = await posts.getPostsByPlace(placeId)
            return res.status(200).json(postPlace);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    })

    app.post('/posts/:uid', async (req, res) => {
        
        let { caption, photo, location, date, rating, locationId } = req.body

        if (!caption) return res.status(400).json({ error: "You must supply a caption!" });
        if (typeof caption !== 'string') return res.status(400).json({ error: "Caption must be a string!" });
        caption = caption.trim();
        if (caption.length < 50 || caption.length > 500)
            return res.status(400).json({ error: "Caption must be between 50 and 500 characters" });
        if (!isNaN(caption))
            return res.status(400).json({ error: "Caption is not a valid value as it only contains digits" });

        if (!location) return res.status(400).json({ error: "You must supply a location!" });
        if (typeof location !== 'string') return res.status(400).json({ error: "Location must be a string!" });
        location = location.trim();
        if (location.length === 0)
            return res.status(400).json({ error: "Location invalid" });

        if (!locationId) return res.status(400).json({ error: "You must supply a locationId!" });
        if (typeof locationId !== 'string') return res.status(400).json({ error: "locationId must be a string!" });
        locationId = locationId.trim();
        if (locationId.length === 0)
            return res.status(400).json({ error: "locationId invalid" });
        
        if (!date) return res.status(400).json({ error: "You must supply a date!" });

        const [year, month, day] = date.split("-"); 
        const formattedDate = `${month}/${day}/${year}`; 
        const today = dayjs().format("MM/DD/YYYY");
        if (!dayjs(formattedDate, "MM/DD/YYYY", true).isValid() || dayjs(formattedDate, "MM/DD/YYYY", true).isAfter(today, "day")) {
            return res.status(400).json({ error: "Invalid Date. Must be in MM/DD/YYYY format and before today." });
            
        }

    

        if (!rating) return res.status(400).json({ error: "You must supply a rating!" });
        if (typeof rating !== 'number') {
            return res.status(400).json({ error: "Rating must be a number" });
        }
        if (isNaN(rating) || rating < 0 || rating > 10) {
            return res.status(400).json({ error: "Invalid rating" });
        }
        const parts = rating.toString().split('.');
        if (parts.length > 1 && parts[1].length > 1) {
            return res.status(400).json({ error: "Rating must only have one decimal point" });
        }
        if (photo) {
            const buffer = Buffer.from(photo.split(",")[1], "base64");
            if (buffer.length > MAX_FILE_SIZE) {
                return res.status(413).json({ error: "Photo size exceeds 2 MB limit." });
            }
        }


        try {
            const result = await posts.addPost(req.params.uid, caption, photo, location, date, rating, locationId);
            return res.status(200).json(result);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    });

    app.get("/posts", async (req, res) => {
        try {
            const allPosts = await posts.getAllPosts();
            return res.status(200).json(allPosts);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    });

   

    app.delete("/posts/:id", async (req, res) => {
        let postId = req.params.id
        if (!postId) return res.status(400).json({ error: "Must provide id" });
        if (typeof postId !== 'string') return res.status(400).json({ error: "ID must be string" });
        postId = postId.trim();
        if (postId.length === 0)
            return res.status(400).json({ error: "ID cant be empty string" });
        if (!ObjectId.isValid(postId)) return res.status(400).json({ error: "Invalid object ID" });

        try {
            const deletedPost = await posts.deletePost(postId)
            return res.status(200).json(deletedPost);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    });

    app.patch("/posts/:id", async (req, res) => {
        let postId = req.params.id
        let { updatedFields } = req.params.body

        try {
            if (!postId) return res.status(400).json({ error: "You must provide an id to search for" });
            if (typeof postId !== 'string') return res.status(400).json({ error: "ID must be a string" });
            postId = postId.trim();
            if (postId.length === 0)
                return res.status(400).json({ error: "ID cannot be an empty string or just spaces" });
            if (!ObjectId.isValid(postId)) return res.status(400).json({ error: "Invalid object ID" });
            if (Object.keys(updatedFields).length === 0) return res.status(400).json({ error: "No fields to update" });

            if (!updatedFields) return res.status(400).json({ error: "Must have updated fields!" });

            if (updatedFields.has("caption")) {
                let caption = updatedFields.caption;

                if (!caption) return res.status(400).json({ error: "You must supply a caption!" });
                if (typeof caption !== 'string') return res.status(400).json({ error: "Caption must be a string!" });
                caption = caption.trim();
                if (caption.length < 50 || caption.length > 500)
                    return res.status(400).json({ error: "Caption must be between 50 and 500 characters" });
                if (!isNaN(caption))
                    return res.status(400).json({ error: "Caption is not a valid value as it only contains digits" });

            }

            if (updatedFields.has("photo")) {
                let photo = updatedFields.photo
                const buffer = Buffer.from(photo.split(",")[1], "base64");
                if (buffer.length > MAX_FILE_SIZE) {
                    return res.status(413).json({ error: "Photo size exceeds 2 MB limit." });
                }
            }


            if (updatedFields.has("location")) {
                let location = updatedFields.location;

                if (!location) return res.status(400).json({ error: "You must supply a location!" });
                if (typeof location !== 'string') return res.status(400).json({ error: "Location must be a string!" });
                location = location.trim();
                if (location.length < 5 || location.length > 25)
                    return res.status(400).json({ error: "Location must be between 5 and 25 characters" });
                if (!isNaN(location))
                    return res.status(400).json({ error: "Location is not a valid value as it only contains digits" });
            }

            if (updatedFields.has("date")) {
                let date = updatedFields.date;

                if (!date) return res.status(400).json({ error: "You must supply a date!" });
                const today = moment().format("MM/DD/YYYY");
                if (!moment(date, "MM/DD/YYYY", true).isValid() || !moment(date, "MM/DD/YYYY", true).isSameOrBefore(today, "day")) {
                    return res.status(400).json({ error: "Invalid Date. Must be in MM/DD/YYYY format and before today." });
                }
            }

            if (updatedFields.has("rating")) {
                let rating = updatedFields.rating;
                if (!rating) return res.status(400).json({ error: "You must supply a rating!" });
                if (typeof rating !== 'number') {
                    return res.status(400).json({ error: "Rating must be a number" });
                }
                if (isNaN(rating) || rating < 0 || rating > 10) {
                    return res.status(400).json({ error: "Invalid rating" });
                }
                const parts = rating.toString().split('.');
                if (parts.length > 1 && parts[1].length > 1) {
                    return res.status(400).json({ error: "Rating must only have one decimal point" });
                }
            }

            let result = await posts.editPost(postId, updatedFields)
            return res.status(200).json(result);

        } catch (e) {
            return res.status(500).json({ error: e.message });
        }

    });

    app.patch("/posts/likes/:uid", async (req, res) => {
        let uid = req.params.uid
        let { postId } = req.body

        if (!postId) return res.status(400).json({ error: "Must provide id" });
        if (typeof postId !== 'string') return res.status(400).json({ error: "ID must be string" });
        postId = postId.trim();
        if (postId.length === 0)
            return res.status(400).json({ error: "ID cant be empty string" });
        if (!ObjectId.isValid(postId)) return res.status(400).json({ error: "Invalid object ID" });

        if (!uid) return res.status(400).json({ error: "Must provide id" });
        if (typeof uid !== 'string') return res.status(400).json({ error: "ID must be string" });
        uid = uid.trim();
        if (uid.length === 0)
            return res.status(400).json({ error: "ID cant be empty string" });

        try {
            let result = await posts.addLike(postId, uid)
            return res.status(200).json(result)

        } catch (e) {
            return res.status(500).json({ error: e.message });
        }

    });

    app.patch("/posts/comments/:uid", async (req, res) => {
        let uid = req.params.uid
        let { postId, comment, name } = req.body

        if (!postId) return res.status(400).json({ error: "Must provide id" });
        if (typeof postId !== 'string') return res.status(400).json({ error: "ID must be string" });
        postId = postId.trim();
        if (postId.length === 0)
            return res.status(400).json({ error: "ID cant be empty string" });
        if (!ObjectId.isValid(postId)) return res.status(400).json({ error: "Invalid object ID" });

        if (!uid) return res.status(400).json({ error: "Must provide id" });
        if (typeof uid !== 'string') return res.status(400).json({ error: "ID must be string" });
        uid = uid.trim();
        if (uid.length === 0)
            return res.status(400).json({ error: "ID cant be empty string" });

        if (!comment) return res.status(400).json({ error: "Must provide comment" });
        if (typeof comment !== 'string') return res.status(400).json({ error: "comment must be string" });
        comment = comment.trim();
        if (comment.length === 0)
            return res.status(400).json({ error: "comment cant be empty string" });
        if (comment.length > 50)
            return res.status(400).json({ error: "comment cant be greater than 50 chars" });

        name = name.trim();
        if (name.length === 0)
            return res.status(400).json({ error: "name cant be empty string" });
        if (name.length > 25)
            return res.status(400).json({ error: "name cant be greater than 25 chars" });

        try {
            let result = posts.addComment(postId, uid, comment, name)
            return res.status(200).json(result)

        } catch (e) {
            return res.status(500).json({ error: e.message });
        }

       

        

    })

    app.use('*', (req, res) => {
        res.redirect('/');
    });
};

export default constructorMethod;