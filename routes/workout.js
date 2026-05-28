const express = require('express');
const workoutController = require('../controllers/workout');

const { verify } = require("../auth");

const router = express.Router();

router.post("/addWorkout", verify, workoutController.addWorkout);

router.get("/getMyWorkouts", verify, workoutController.retrieveWorkout);

router.patch("/:workoutId/updateWorkout", verify, workoutController.updateWorkout)
;
router.delete("/:workoutId/deleteWorkout", verify, workoutController.deleteWorkout);

router.patch("/completeWorkoutStatus", verify, workoutController.completeWorkoutStatus)

module.exports = router;