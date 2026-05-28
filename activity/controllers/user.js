const User = require('../models/User');
const bcrypt = require("bcryptjs");
const auth = require("../auth");
const { errorHandler } = require("../auth");

module.exports.registerUser = (req, res) => {

	const { email, password } = req.body;

	if(!email || !email.includes("@")) {
		return res.status(400).send({error: "Invalid email. It must contain '@' symbol"})
	} else if (!password || password.length < 8) {
		return res.status(400).send({error: "Password must be at least 8 characters long"})
	} else {

		let newUser = new User({
			email,
			password: bcrypt.hashSync(password, 10),
			isAdmin: false
		})

		return newUser.save()
		.then((result) => {
			return res.status(201).send({
				message: "Registered Succesfully"
			});
		})

		.catch(error => errorHandler(error, req, res));
	}
};

module.exports.getProfile = (req, res) => {

    //to find user in the database
    return User.findById(req.user.id)
    .then(user => {

        if (!user) {

            return res.status(404).send({message: "User not found"});

        }

        const userObj = user.toObject();
        
        // Completely remove the key
        delete userObj.password;
        //send status code 200 OK and user details
        res.status(200).send({
        	user: userObj
        })
    })
    .catch(error => errorHandler(error, req, res));

};

module.exports.loginUser = (req, res) => {

    const email = req.body.email;
    if (!email || !email.includes("@")) {
        return res.status(400).send({ error: "Invalid Email" });
    }

    return User.findOne({ email })
        .then(result => {


            if(result == null) {

                return res.status(404).send({ error: 'No email found' });
            } 

            else {

                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

                if(isPasswordCorrect) {
                    console.log(isPasswordCorrect)
                    return res.status(200).send({
                        access : auth.createAccessToken(result)
                    });
                } else {
                    return res.status(401).send({ error: 'Email and password do not match' });
                }
            }
        })
        .catch(error => errorHandler(error, req, res));
};