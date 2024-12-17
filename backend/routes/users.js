import users from "../db/users.js";
import posts from '../db/posts.js';
import moment from "moment";
import { ObjectId } from 'mongodb';
import dayjs from 'dayjs';
import { Router } from "express";
import zipcodes from "zipcodes";
import xss from 'xss';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const router = Router();

const validateDisplayName = (name) => {
    const trimmedName = name.trim();
    const validCharacters = /^[a-zA-Z0-9 ]+$/;
    return trimmedName.length <= 20 && validCharacters.test(trimmedName);
};

const validateZipCode = (zip) => {
    return zipcodes.lookup(zip) !== undefined;
};

const validateBio = (bio) => {
    const trimmedBio = bio.trim();
    const validCharacters = /^[a-zA-Z0-9.,!?' ]+$/;
    return trimmedBio.length <= 250 && validCharacters.test(trimmedBio);
};

const checkId = (id) =>{
    if (!id) return False
    if (typeof id !== 'string') return False
    id = id.trim();
    if (id.length === 0)
        return False
    return true;
}

// Get places for user
router.get("/:uid/places", async (req, res) => {
    try {
        const type = req.query.type ? xss(req.query.type) : undefined;

        if (type && !["bookmarked", "visited"].includes(type)) {
            return res.status(400).json({ error: "Invalid type. Must be 'bookmarked' or 'visited'." });
        }

        const uid = xss(req.params.uid);
        if (!checkId(uid)){
            return res.status(400).json({ error: "Invalid ID. "});
        }
        const places = await users.getPlacesForUser(uid, type);
        return res.status(200).json(places);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

// Update places for user
router.patch("/:uid/places/:placeId", async (req, res) => {
    try {
        if (!checkId(req.params.uid) || !checkId(req.params.placeId)){
            return res.status(400).json({ error: "Invalid ID. "});
        }

        const uid = xss(req.params.uid);
        const placeId = xss(req.params.placeId);
        const isBookmarked = req.body.isBookmarked !== undefined ? xss(req.body.isBookmarked) : undefined;
        const isVisited = req.body.isVisited !== undefined ? xss(req.body.isVisited) : undefined;
        const name = req.body.name ? xss(req.body.name) : undefined;
        const image = req.body.image ? xss(req.body.image) : undefined;
        const location = req.body.location ? xss(req.body.location) : undefined;
        const city = req.body.city ? xss(req.body.city) : undefined;
        const state = req.body.state ? xss(req.body.state) : undefined;
        const rating = req.body.rating !== undefined ? xss(req.body.rating) : undefined;

        if (isBookmarked === undefined && isVisited === undefined) {
            return res.status(400).json({ error: "At least one flag (isBookmarked or isVisited) must be provided." });
        }

        const result = await users.addPlaceForUser(uid, placeId, isBookmarked, isVisited, name, image, location, city, state, rating);
        return res.status(200).json(result);
    } catch (e) {
        console.error("Error updating place for user:", e.message);
        return res.status(500).json({ error: e.message });
    }
});

router.delete("/:uid/places/:placeId", async (req, res) => {
    try {
        if (!checkId(req.params.uid) || !checkId(req.params.placeId)){
            return res.status(400).json({ error: "Invalid ID. "});
        }
        const result = await users.removePlaceForUser(xss(req.params.uid), xss(req.params.placeId));
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const allUsers = await users.getAllUsers();
        return res.status(200).json(allUsers);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

// Get user by ID
router.get("/:uid", async (req, res) => {
    try {
        if (!checkId(req.params.uid) ){
            return res.status(400).json({ error: "Invalid ID. "});
        }
        const uid = xss(req.params.uid);
        
        const user = await users.getUserById(uid);
        return res.status(200).json(user);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

// Add user if not exists
router.post("/:uid", async (req, res) => {
    try {
        if (!checkId(req.params.uid) ){
            return res.status(400).json({ error: "Invalid ID. "});
        }
        const uid = xss(req.params.uid);
        const result = await users.addUserIfNotExists(uid);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(400).json({ error: e.message });
    }
});

// Update user details
router.patch("/:uid/details", async (req, res) => {
    try {
        if (!checkId(req.params.uid) ){
            return res.status(400).json({ error: "Invalid ID. "});
        }
        const uid = xss(req.params.uid);
        const displayName = req.body.displayName ? xss(req.body.displayName.trim()) : undefined;
        const zipCode = req.body.zipCode ? xss(req.body.zipCode.trim()) : undefined;
        const bio = req.body.bio ? xss(req.body.bio.trim()) : undefined;

        const updateFields = {};

        if (displayName) {
            if (!validateDisplayName(displayName)) {
                return res.status(400).json({ error: "Invalid display name. Must be at most 20 characters, no special characters." });
            }
            updateFields.displayName = displayName;
        }

        if (zipCode) {
            if (!validateZipCode(zipCode)) {
                return res.status(400).json({ error: "Invalid ZIP code." });
            }
            updateFields.zipCode = zipCode;
        }

        if (bio) {
            if (!validateBio(bio)) {
                return res.status(400).json({ error: "Invalid bio. Must be at most 250 characters, no special characters besides usual punctuation." });
            }
            updateFields.bio = bio;
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ error: "No fields to update" });
        }

        const result = await users.updateUserProfile(uid, updateFields);
        return res.status(200).json({ success: true, result });
    } catch (e) {
        console.error("Error updating user details:", e.message);
        return res.status(500).json({ error: e.message });
    }
});

router.get("/:uid/photo", async (req, res) => {
    try {
        if (!checkId(req.params.uid) ){
            return res.status(400).json({ error: "Invalid ID. "});
        }
        const photo = await users.getUserPhoto(xss(req.params.uid));
        if (!photo) return res.status(404).json({ error: "User photo not found" });
        return res.status(200).json({ photo });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

// Update photo
router.patch('/:uid/photo', async (req, res) => {
    try {
        if (!checkId(req.params.uid) ){
            return res.status(400).json({ error: "Invalid ID. "});
        }
        const uid = xss(req.params.uid);
        const photo = req.body.photo ? xss(req.body.photo) : undefined;

        if (!photo) {
            return res.status(400).json({ error: "Photo is required in the request body" });
        }

        const buffer = Buffer.from(photo.split(",")[1], "base64");
        if (buffer.length > MAX_FILE_SIZE) {
            return res.status(413).json({ error: "Photo size exceeds 2 MB limit." });
        }

        const result = await users.updateUserProfile(uid, { photo });
        return res.status(200).json({ success: true, result });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

export default router;
