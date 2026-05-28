const Workout = require('../models/Workout');
const auth = require("../auth");
const { errorHandler } = require("../auth");

module.exports.addWorkout = (req, res) => {

	if (!req.body.userId || !req.body.name || !req.body.duration) {
	   return res.status(400).send({ error: "All fields are required" });
	}

	let newWorkout = new Workout({
	    name : req.body.name,
	    duration : req.body.duration,
	    userId : req.body.userId
	});

	
	Workout.findOne({ name: req.body.name, userId: req.body.userId })
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