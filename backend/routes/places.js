import { Router } from "express";
import xss from 'xss';
const router = Router();
import placeData from "../db/places.js";
import userData from "../db/users.js"

const checkString = (strVal) => {
    if (!strVal) return false
    if (typeof strVal !== 'string') return false
    strVal = strVal.trim();
    if (strVal.length === 0)
        return false
    if (!isNaN(strVal))
        return false
    return true;
}

const checkId = (id) =>{
    if (!id) return False
    if (typeof id !== 'string') return False
    id = id.trim();
    if (id.length === 0)
        return False
    return true;
}

router.route("/").get(async (req, res) => {
    try {
        const allPlaces = await placeData.getAllPlaces();
        return res.status(200).json(allPlaces);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

//ERROR HANDLING FOR THIS TO BE FINISHED
router
    .route("/:pid/newReview")
    .post(async (req, res) => {
        try {
            if (!checkId(req.params.pid) ){
                return res.status(400).json({ error: "Invalid ID. "});
            }
            if (!checkId(req.body.uid) ){
                return res.status(400).json({ error: "Invalid ID. "});
            }

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
        if (!checkId(req.params.pid) ){
            return res.status(400).json({ error: "Invalid ID. "});
        }
        let placeId = xss(req.params.pid);
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
            if (!checkId(req.params.pid) ){
                return res.status(400).json({ error: "Invalid ID. "});
            }
            if (!checkString(req.body.name) ){
                return res.status(400).json({ error: "Invalid ID. "});
            }
            let place_id = xss(req.params.pid);
            let name = xss(req.body.name);

            
          const result =   await placeData.addPlace(place_id, name);
            return res.status(200).json(result);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    });

export default router;