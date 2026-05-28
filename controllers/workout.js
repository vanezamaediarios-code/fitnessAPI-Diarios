const Workout = require('../models/Workout');
const auth = require("../auth");
const { errorHandler } = require("../auth");

module.exports.addWorkout = (req, res) => {

	if (!req.body.name || !req.body.duration) {
	   return res.status(400).send({ error: "All fields are required" });
	}

	let newWorkout = new Workout({
	    name : req.body.name,
	    duration : req.body.duration,
	    userId : req.user.id
	});

	
	Workout.findOne({ name: req.body.name, userId: req.user.id })
	.then(existingWorkout=> {
	    if(existingWorkout) {
	
	        return res.status(409).send({message: "Workout already exists"});
	    } else {
	        return newWorkout.save()
	        .then(result => res.status(201).send(result))
	        .catch (error => errorHandler(error, req, res));
	    }
	})
	.catch (error => errorHandler(error, req, res));
}

module.exports.retrieveWorkout = (req, res) => {

	//find workout in database
    return Workout.find({ userId: req.user.id })
    .then(result => {
    	//status code 200OK and display all the workouts
        return res.status(200).send(result);

    })

    .catch(error => errorHandler(error, req, res));

}

module.exports.updateWorkout = (req, res) => {

    const updatedFields = {
        name: req.body.name,
        duration: req.body.duration
    };

    console.log(updatedFields);

    return Workout.findByIdAndUpdate(req.params.workoutId, updatedFields, { new: true })
        .then(updatedWorkout => {
            // if workout is not found
            if(!updatedWorkout){
                return res.status(404).send({ error: "Workout not found" });
            }
            // if workout is found, it will be updated

            res.status(200).send({
                message: "Workout updated successfully",
                updatedWorkout: updatedWorkout
            })
        })
        .catch(error => errorHandler(error, req, res));
}

module.exports.deleteWorkout = (req, res) => {

	return Workout.findByIdAndDelete(req.params.workoutId)
		.then(result => {

			if(!result) {
				return res.status(404).send({ message: "Workout not found"});
			}

			return res.status(200).send({ message: "Workout deleted successfully"})
		})
		.catch(error => errorHandler(error, req, res));
}
//change status from pending to complete
module.exports.completeWorkoutStatus = (req, res) => {

	const workoutId = req.body.workoutId;

	if(!workoutId) {
		return res.status(400).send({ error: "Workout ID is required" });
	}

	return Workout.findById(req.body.workoutId)
		.then(workout => {
			if(!workout) {
				return res.status(404).send({ message: "Workout not found" });
			}

			workout.status = "completed";

			return workout.save()
				.then(updatedWorkout => {
					return res.status(200).send({ message: "Workout successfully completed", updatedWorkout });
				});
		})
		.catch(error => errorHandler(error, req, res));
}

