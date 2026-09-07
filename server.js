const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = 3000;


// =====================================
// BASIC SETTINGS
// =====================================

app.use(express.json());

app.use(express.static(path.join(__dirname, "..")));


// =====================================
// DATABASE FILE
// =====================================

const databaseFile = path.join(
    __dirname,
    "thoughts.json"
);


// Create thoughts.json if it doesn't exist

if (!fs.existsSync(databaseFile)) {

    fs.writeFileSync(
        databaseFile,
        "[]"
    );

}


// =====================================
// HOME PAGE
// =====================================

app.get("/", function(req, res) {

    res.sendFile(
        path.join(
            __dirname,
            "..",
            "index.html"
        )
    );

});


// =====================================
// SAVE THOUGHT
// =====================================

app.post("/api/thoughts", function(req, res) {

    const thought = req.body.thought;

    const feeling = req.body.feeling;

    const song = req.body.song;

    const videoId = req.body.videoId;


    // Check if required information exists

    if (!thought) {

        return res.status(400).json({

            success: false,

            message: "Thought is required."

        });

    }


    // Read existing thoughts

    const data = JSON.parse(

        fs.readFileSync(
            databaseFile,
            "utf8"
        )

    );


    // Create new thought

    const newThought = {

        id: Date.now(),

        thought: thought,

        feeling: feeling || "",

        song: song || "",

        videoId: videoId || "",

        created_at:
            new Date().toISOString()

    };


    // Add new thought

    data.push(newThought);


    // Save database

    fs.writeFileSync(

        databaseFile,

        JSON.stringify(
            data,
            null,
            2
        )

    );


    // Send response

    res.json({

        success: true,

        message: "Thought saved!",

        thought: newThought

    });

});


// =====================================
// GET ALL THOUGHTS
// =====================================

app.get("/api/thoughts", function(req, res) {

    const data = JSON.parse(

        fs.readFileSync(
            databaseFile,
            "utf8"
        )

    );


    res.json(data);

});


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
            "http://localhost:3000"
        );

        console.log("");

    }
);