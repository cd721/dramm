
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
    })
    app.post('/users/:uid', async (req, res) => {
        try {
            const result = await users.addUserIfNotExists(req.params.uid);
            return res.status(200).json(result);


        } catch (e) {
            return res.status(400).json({ error: e });
        }



    });
    app.use('*', (req, res) => {
        res.redirect('/');
    });
};

export default constructorMethod;