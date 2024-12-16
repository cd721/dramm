import users from '../db/users.js';
import posts from '../db/posts.js';
import moment from "moment"
import { ObjectId } from 'mongodb';
import dayjs from 'dayjs';
// TODO: error handling, figure out photo error handling for posts
// TODO: error handling
import { Router } from "express";
import xss from 'xss'
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const router = Router();

router.get("/byLocation/:id", async (req, res) =>{
    let placeId = xss(req.params.id);
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

router.get("/byUser/:id", async (req, res) => {
    let uid = xss(req.params.id);
    if (!uid) return res.status(400).json({ error: "Must provide id" });
    if (typeof uid !== 'string') return res.status(400).json({ error: "ID must be string" });
    uid = uid.trim();
    if (uid.length === 0)
        return res.status(400).json({ error: "ID cant be empty string" });

    try {
        const postUser = await posts.getPostsByUser(uid)
        return res.status(200).json(postUser);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
})

router.post('/:uid', async (req, res) => {
    
    let { caption, photo, location, date, rating, locationId } = xss(req.body);

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
        const result = await posts.addPost(xss(req.params.uid), caption, photo, location, date, rating, locationId);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const allPosts = await posts.getAllPosts();
        return res.status(200).json(allPosts);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

router.patch("/comments/:uid", async (req, res) => {
    let uid =xss(req.params.uid);
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

export default router;
