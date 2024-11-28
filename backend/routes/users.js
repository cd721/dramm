
import users from '../db/users.js';
//TODO: error handling
const constructorMethod = (app) => {
    app.get("/users/:uid/places", async (req, res) => {
        try {
            const places = await users.getPlacesForUser(req.params.uid);
            return res.status(200).json(places);
        } catch (e) {
            return res.status(500).json({ error: e })
        }
    });
    app.patch("/users/:uid/places/:placeId", async (req, res) => {
        try {
            const result = await users.addPlaceForUser(req.params.uid, req.params.placeId);
            return res.status(200).json(result);

        } catch (e) {
            return res.status(500).json({ error: e })
        }
    });
    app.get("/users", async (req, res) => {
        try {
            const users = await users.getAllUsers();
        } catch (e) {
            return res.status(500).json({ error: e })
        }
    });
    app.get("/users/:uid", async (req, res) => {
        try {
            const user = await users.getUserById(req.params.uid);
            return res.status(200).json(user);
        } catch (e) {
            return res.status(500).json({ error: e })
        }
    });
    app.post('/users/:uid', async (req, res) => {
        try {
            const result = await users.addUserIfNotExists(req.params.uid);
            return res.status(200).json(result);


        } catch (e) {
            return res.status(400).json({ error: e });
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

    app.post("/users/:uid/photo", async (req, res) => {
        try {
            const { photo } = req.body;
            if (!photo) return res.status(400).json({ error: "Photo is required in request body" });

            const result = await users.saveUserPhoto(req.params.uid, photo);
            return res.status(200).json(result);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    });

    app.patch("/users/:uid", async (req, res) => {
        try {
            const { zipCode, bio, photo } = req.body;

            const updateFields = {};
            if (zipCode) updateFields.zipCode = zipCode;
            if (bio) updateFields.bio = bio;
            if (photo) updateFields.photo = photo;

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