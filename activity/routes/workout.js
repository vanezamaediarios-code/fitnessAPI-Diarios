const express = require('express');
const workoutController = require('../controllers/workout');

const { verify } = require("../auth");

const router = express.Router();

router.post("/addWorkout", verify, workoutController.addWorkout);

router.get("/getMyWorkouts", verify, workoutController.retrieveWorkout);

module.exports = router;