import { Router } from "express";
import xss from 'xss';
const router = Router();
import placeData from "../db/places.js";
import userData from "../db/users.js"
router.route("/").get(async (req, res) => {
    try {
        const allPlaces = await placeData.getAllPlaces();
        return res.status(200).json(allPlaces);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

router
    .route("/:pid/newReview")
    .post(async (req, res) => {
        try {
            let poster_id = xss(req.body.uid);
            let post = xss(req.body.post);
            let placeId = xss(req.params.pid);
            const result = await placeData.addReviewToPlace(placeId, post, poster_id);
            return res.status(200).json(result);
        } catch (e) {
            return res.status(500).render("errorSpecial", { error: e });
        }
    });

router
    .route("/:pid")
    .get(async (req, res) => {
        let placeId = req.params.pid;
        try {
            const place = await placeData.getPlaceById(placeId.toString());
            return res.status(200).json(place);
        }

        catch (e) {
            return res.status(500).json({ error: e.message });
        }
    })
    .post(async (req, res) => {
        try {
            let place_id = xss(req.params.pid);
            let name = xss(req.body.name);

            
          const result =   await placeData.addPlace(place_id, name);
            return res.status(200).json(result);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    });

export default router;