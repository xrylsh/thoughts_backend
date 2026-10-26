const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");


const app = express();


const PORT =
    process.env.PORT || 3000;


// =====================================
// MIDDLEWARE
// =====================================

app.use(
    cors()
);

app.use(
    express.json()
);


// =====================================
// DATABASE FILES
// =====================================

const thoughtsFile =
    path.join(
        __dirname,
        "thoughts.json"
    );


const usersFile =
    path.join(
        __dirname,
        "users.json"
    );


// =====================================
// CREATE FILES IF NEEDED
// =====================================

if (!fs.existsSync(thoughtsFile)) {

    fs.writeFileSync(
        thoughtsFile,
        "[]"
    );

}


if (!fs.existsSync(usersFile)) {

    fs.writeFileSync(
        usersFile,
        "[]"
    );

}


// =====================================
// HOME
// =====================================

app.get(
    "/",
    function(req, res) {

        res.json({

            success: true,

            message:
                "UNSAID backend is running! 💭"

        });

    }
);


// =====================================
// SIGN UP
// =====================================

app.post(
    "/api/signup",
    function(req, res) {

        const email =
            String(
                req.body.email || ""
            )
            .trim()
            .toLowerCase();


        const password =
            String(
                req.body.password || ""
            );


        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and password are required."

            });

        }


        if (password.length < 6) {

            return res.status(400).json({

                success: false,

                message:
                    "Password must be at least 6 characters."

            });

        }


        const users =
            JSON.parse(
                fs.readFileSync(
                    usersFile,
                    "utf8"
                )
            );


        const existingUser =
            users.find(
                function(user) {

                    return user.email === email;

                }
            );


        if (existingUser) {

            return res.status(409).json({

                success: false,

                message:
                    "An account with that email already exists."

            });

        }


        // =================================
        // HASH PASSWORD
        // =================================

        const salt =
            crypto
                .randomBytes(16)
                .toString("hex");


        const passwordHash =
            crypto
                .scryptSync(
                    password,
                    salt,
                    64
                )
                .toString("hex");


        const newUser = {

            id: Date.now(),

            email: email,

            salt: salt,

            passwordHash:
                passwordHash,

            created_at:
                new Date().toISOString()

        };


        users.push(
            newUser
        );


        fs.writeFileSync(

            usersFile,

            JSON.stringify(
                users,
                null,
                2
            )

        );


        res.status(201).json({

            success: true,

            message:
                "Account created successfully!"

        });

    }
);


// =====================================
// LOGIN
// =====================================

app.post(
    "/api/login",
    function(req, res) {

        const email =
            String(
                req.body.email || ""
            )
            .trim()
            .toLowerCase();
            const password =
            String(
                req.body.password || ""
            );


        const users =
            JSON.parse(
                fs.readFileSync(
                    usersFile,
                    "utf8"
                )
            );


        const user =
            users.find(
                function(item) {

                    return item.email === email;

                }
            );


        if (!user) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password."

            });

        }


        const passwordHash =
            crypto
                .scryptSync(
                    password,
                    user.salt,
                    64
                )
                .toString("hex");


        if (
            passwordHash !==
            user.passwordHash
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password."

            });

        }


        res.json({

            success: true,

            message:
                "Login successful.",

            user: {

                id: user.id,

                email: user.email

            }

        });

    }
);


// =====================================
// SAVE THOUGHT
// =====================================

app.post(
    "/api/thoughts",
    function(req, res) {

        const thought =
            String(
                req.body.thought || ""
            )
            .trim();


        const feeling =
            String(
                req.body.feeling || ""
            )
            .trim();


        const song =
            String(
                req.body.song || ""
            )
            .trim();


        const videoId =
            String(
                req.body.videoId || ""
            )
            .trim();


        if (!thought) {

            return res.status(400).json({

                success: false,

                message:
                    "Thought is required."

            });

        }


        const data =
            JSON.parse(
                fs.readFileSync(
                    thoughtsFile,
                    "utf8"
                )
            );


        const newThought = {

            id: Date.now(),

            thought:
                thought,

            feeling:
                feeling,

            song:
                song,

            videoId:
                videoId,

            created_at:
                new Date().toISOString()

        };


        data.push(
            newThought
        );


        fs.writeFileSync(

            thoughtsFile,

            JSON.stringify(
                data,
                null,
                2
            )

        );


        res.status(201).json({

            success: true,

            message:
                "Thought saved!",

            thought:
                newThought

        });

    }
);


// =====================================
// GET THOUGHTS
// =====================================

app.get(
    "/api/thoughts",
    function(req, res) {

        const data =
            JSON.parse(
                fs.readFileSync(
                    thoughtsFile,
                    "utf8"
                )
            );


        res.json(
            data
        );

    }
);


// =====================================
// START SERVER
// =====================================

app.listen(

    PORT,

    function() {

        console.log("");

        console.log(
            "================================"
        );

        console.log(
            "       UNSAID IS RUNNING 💭"
        );

        console.log(
            "================================"
        );

        console.log(
            "Port:",
            PORT
        );

        console.log("");

    }

);