import users from "../db/users.js";
import { Router } from "express";
import zipcodes from "zipcodes";

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
    const validCharacters = /^[a-zA-Z0-9.,!? ]+$/;
    return trimmedBio.length <= 250 && validCharacters.test(trimmedBio);
};

router.get("/:uid/places", async (req, res) => {
    try {
        const places = await users.getPlacesForUser(req.params.uid);
        return res.status(200).json(places);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

router.patch("/:uid/places/:placeId", async (req, res) => {
    try {
        const result = await users.addPlaceForUser(req.params.uid, req.params.placeId);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

router.delete("/:uid/places/:placeId", async (req, res) => {
    try {
        const result = await users.removePlaceForUser(req.params.uid, req.params.placeId);
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

router.get("/:uid", async (req, res) => {
    try {
        const user = await users.getUserById(req.params.uid);
        return res.status(200).json(user);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

router.post("/:uid", async (req, res) => {
    try {
        const result = await users.addUserIfNotExists(req.params.uid);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(400).json({ error: e.message });
    }
});

router.get("/:uid/photo", async (req, res) => {
    try {
        const photo = await users.getUserPhoto(req.params.uid);
        if (!photo) return res.status(404).json({ error: "User photo not found" });
        return res.status(200).json({ photo });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

router.patch("/:uid/photo", async (req, res) => {
    try {
        const { photo } = req.body;

        if (!photo) {
            return res.status(400).json({ error: "Photo is required in the request body" });
        }

        const buffer = Buffer.from(photo.split(",")[1], "base64");
        console.log("Payload size in bytes:", buffer.length);

        if (buffer.length > MAX_FILE_SIZE) {
            return res.status(413).json({ error: "Photo size exceeds 2 MB limit." });
        }

        const result = await users.updateUserProfile(req.params.uid, { photo });
        return res.status(200).json({ success: true, result });
    } catch (e) {
        console.error("Error updating photo:", e.message);
        return res.status(500).json({ error: e.message });
    }
});

router.patch("/:uid/details", async (req, res) => {
    try {
        const { displayName, zipCode, bio } = req.body;

        const updateFields = {};

        if (displayName) {
            if (!validateDisplayName(displayName)) {
                return res.status(400).json({ error: "Invalid display name. Must be at most 20 characters, no special characters." });
            }
            updateFields.displayName = displayName.trim();
        }

        if (zipCode) {
            if (!validateZipCode(zipCode)) {
                return res.status(400).json({ error: "Invalid ZIP code." });
            }
            updateFields.zipCode = zipCode;
        }

        if (bio) {
            if (!validateBio(bio)) {
                return res.status(400).json({ error: "Invalid bio. Must be at most 250 characters, no special characters." });
            }
            updateFields.bio = bio.trim();
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ error: "No fields to update" });
        }

        const result = await users.updateUserProfile(req.params.uid, updateFields);
        return res.status(200).json({ success: true, result });
    } catch (e) {
        console.error("Error updating user details:", e.message);
        return res.status(500).json({ error: e.message });
    }
});

export default router;