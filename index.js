const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");

//Routes Middleware
const userRoutes = require("./routes/user");
const workoutRoutes = require("./routes/workout");

require('dotenv').config();

const app = express();

app.use(express.json());

const corsOptions = {

	origin: ['http://localhost:8000', 'http://localhost:5173'],
	credentials: true,
	optionsSuccessStatus: 200
}


app.use(cors(corsOptions));

//Connect to our MongoDB database
mongoose.connect(process.env.MONGODB_STRING);

mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'))

//for routes
app.use("/workouts", workoutRoutes);
app.use("/users", userRoutes);

if(require.main === module){
	app.listen(process.env.PORT || 4000, () => {
	    console.log(`API is now online on port ${ process.env.PORT || 4000 }`)
	});
}

module.exports = {app,mongoose};