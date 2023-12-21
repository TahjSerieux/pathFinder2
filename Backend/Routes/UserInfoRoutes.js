const requireAuth = require("../Middleware/requireAuth");
const express = require("express");
const {getSavedRoutes,saveFavoritedRoutes,deleteSavedRoutes} = require('../Controllers/UserInfoController');

const router = express.Router();
router.use(requireAuth);
router.post('/save-waypoint',saveFavoritedRoutes);
router.delete('/delete-route',deleteSavedRoutes);
router.post('/get-saved-waypoints',getSavedRoutes);


module.exports = router
 
