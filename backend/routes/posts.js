import users from '../db/users.js';
import posts from '../db/posts.js';
import moment from "moment";
import { ObjectId } from 'mongodb';
import dayjs from 'dayjs';
import { Router } from "express";
import xss from 'xss';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const router = Router();

router.get("/byLocation/:id", async (req, res) => {
    let placeId = xss(req.params.id);

    if (!placeId || typeof placeId !== 'string' || placeId.trim().length === 0) {
        return res.status(400).json({ error: "Invalid or missing place ID." });
    }

    try {
        const postPlace = await posts.getPostsByPlace(placeId.trim());
        return res.status(200).json(postPlace);
    } catch (e) {
        console.log(e.message)
        return res.status(500).json({ error: e.message });
    }
});

router.get("/byUser/:id", async (req, res) => {
    let uid = xss(req.params.id);

    if (!uid || typeof uid !== 'string' || uid.trim().length === 0) {
        return res.status(400).json({ error: "Invalid or missing user ID." });
    }

    try {
        const postUser = await posts.getPostsByUser(uid.trim());
        return res.status(200).json(postUser.length > 0 ? postUser : []);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

router.post('/:uid', async (req, res) => {
    let sanitizedUid = xss(req.params.uid);
    let { caption, photo, location, date, rating, locationId } = req.body;

    caption = xss(caption?.trim());
    location = xss(location?.trim());
    date = xss(date?.trim());
    locationId = xss(locationId?.trim());
    rating = rating; // No need to sanitize number, validated below
    photo = xss(photo);

    if (!sanitizedUid || typeof sanitizedUid !== 'string' || sanitizedUid.trim().length === 0) {
        return res.status(400).json({ error: "Invalid or missing user ID." });
    }

    if (!caption) return res.status(400).json({ error: "Caption is required." });
    if (typeof caption !== 'string') return res.status(400).json({ error: "Caption must be a string." });
    if (caption.length < 50 || caption.length > 500) {
        return res.status(400).json({ error: "Caption must be between 50 and 500 characters." });
    }

    if (!location) return res.status(400).json({ error: "Location is required." });
    if (typeof location !== 'string') return res.status(400).json({ error: "Location must be a string." });

    if (!locationId) return res.status(400).json({ error: "Location ID is required." });
    if (typeof locationId !== 'string') return res.status(400).json({ error: "Location ID must be a string." });

    if (!date) return res.status(400).json({ error: "Date is required." });
    
    const [year, month, day] = date.split("-"); 
    const formattedDate = `${month}/${day}/${year}`; 
    const today = dayjs().format("MM/DD/YYYY");
    if (!dayjs(formattedDate, "MM/DD/YYYY", true).isValid() || dayjs(formattedDate, "MM/DD/YYYY", true).isAfter(today, "day")) {
        return res.status(400).json({ error: "Invalid Date. Must be in MM/DD/YYYY format and before today." });
        
    }


    if (rating == null) return res.status(400).json({ error: "Rating is required." });
    if (typeof rating !== 'number') {
        return res.status(400).json({ error: "Rating must be a number." });
    }
    if (isNaN(rating) || rating < 0 || rating > 10) {
        return res.status(400).json({ error: "Rating must be between 0 and 10." });
    }
    const parts = rating.toString().split('.');
    if (parts.length > 1 && parts[1].length > 1) {
        return res.status(400).json({ error: "Rating can only have one decimal place." });
    }

    if (photo) {
        const buffer = Buffer.from(photo.split(",")[1], "base64");
        if (buffer.length > MAX_FILE_SIZE) {
            return res.status(413).json({ error: "Photo size exceeds 2 MB limit." });
        }
    }

    try {
        const result = await posts.addPost(sanitizedUid, caption, photo, location, formattedDate, rating, locationId);
        return res.status(200).json(result);
    } catch (e) {
        console.error("Error adding post:", e.message);
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
    let sanitizedUid = xss(req.params.uid);
    let { postId, comment, name } = req.body;

    postId = xss(postId?.trim());
    comment = xss(comment?.trim());
    name = xss(name?.trim());

    if (!sanitizedUid || typeof sanitizedUid !== 'string' || sanitizedUid.trim().length === 0) {
        return res.status(400).json({ error: "Invalid or missing user ID." });
    }

    if (!postId || !ObjectId.isValid(postId)) {
        return res.status(400).json({ error: "Invalid Post ID." });
    }

    if (!comment || typeof comment !== 'string') {
        return res.status(400).json({ error: "Comment must be a valid string." });
    }
    if (comment.length === 0 || comment.length > 50) {
        return res.status(400).json({ error: "Comment must be between 1 and 50 characters." });
    }

    if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: "Name must be a valid string." });
    }
    if (name.length === 0 || name.length > 25) {
        return res.status(400).json({ error: "Name must be between 1 and 25 characters." });
    }

    try {
        const result = await posts.addComment(postId, sanitizedUid, comment, name);
        return res.status(200).json(result);
    } catch (e) {
        console.error("Error adding comment:", e.message);
        return res.status(500).json({ error: e.message });
    }
});

export default router;
