import users from '../db/users.js';
// TODO: error handling

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

    app.use('*', (req, res) => {
        res.redirect('/');
    });
};

export default constructorMethod;