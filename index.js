const express = require("express");
const app = express();
const helmet = require("helmet");
const compression = require("compression");

const cookieSession = require("cookie-session");
const csurf = require("csurf");

// for log in:
const { hash, compare } = require("./bcrypt");

// for resetting a password:
const cryptoRandomString = require("crypto-random-string");
const { sendEmail } = require("./ses");

let secrets;
if (process.env.NODE_ENV === "production") {
    secrets = process.env;
} else {
    secrets = require("./secrets");
}

const { addUser, getUser, addImage, addCode, getCode, setNewPassword, editBio } = require("./db");

app.use(helmet());

// for uploading profile pics:
const s3 = require("./s3");
const { s3Url } = require("./config");

app.use(express.static("./public"));

app.use(express.json());

// ///////// BOILERPLATE CODE FOR IMAGE UPLOAD ///// DO NOT TOUCH /////////
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
// /////////////////////////////////////////////////////////////////

// middleware function, that grabs user input, parses it and makes it available to req.body:
app.use(
    express.urlencoded({
        extended: false
    })
);

app.use(compression());

app.use(
    cookieSession({
        secret: secrets.SESSION_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

app.use(csurf());

// app.use(function(req, res, next) {
//     res.set("x-frame-options", "DENY");
//     res.locals.csrfToken = req.csrfToken();
//     next();
// });

// after csurf:
app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}
// ///////////////////////////////////////////////////////
app.get("/user", (req, res) => {
    console.log("*************** /user ***********");
    // console.log('req.session in get /user: ', req.session);
    getUser(req.session.email).then(rows => {
        // check if rows[0].length != 0;
        res.json({
            success: true,
            userId: rows[0].id,
            first: rows[0].first,
            last: rows[0].last,
            imageUrl: rows[0].img_url || '/images/duck-308733.svg',
            bio: rows[0].bio || ''
        });
    }).catch(err => {
        console.log("err in GET /user : ", err);
        res.json({
            success: false
        });
    });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("*************** POST /upload ***********");
    const imageUrl = s3Url + req.file.filename;
    // url of image: https://s3.amazonaws.com/name-of-bucket/filename
    console.log('req.session.email: ', req.session.email);
    addImage(req.session.email, imageUrl)
        .then(image => {
            // console.log('image after addImage(): ', image);
            // after query is successful, send a response
            res.json({
                success: true,
                imageUrl: imageUrl
            });
        })
        .catch(err => {
            console.log("err in POST /upload", err);
            res.json({
                success: false
            });
        });
});

app.get("/logout", (req, res) => {
    console.log("*************** /logout ***********");
    req.session = null;
    res.redirect("/login");
});

app.get("/welcome", function(req, res) {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/register", (req, res) => {
    console.log("*************** /register POST ***********");
    console.log(`your name is: ${req.body.first} ${req.body.last}`);
    hash(req.body.password)
        .then(password => {
            addUser(
                req.body.first,
                req.body.last,
                req.body.email,
                password
            ).then(result => {
                // console.log('result which includes the RETURNING data: ', result);
                // GET ACTUAL ID HERE:
                let id = result.rows[0].id;
                // console.log(id);
                req.session.userId = id;
                req.session.first = req.body.first;
                req.session.last = req.body.last;
                res.json({
                    success: true
                });
            });
        })
        .catch(err => {
            console.log("err in POST /register: ", err);
            res.json({
                success: false
            });
        });
});

// same with asynch (actually not really the same yet.. work on that later...):
// app.post("/register", async (req, res) => {
//     const {first, last, email, password} = req.body;
//
//     try {
//         let hash = await hash(password);
//         let id = await addUser(first, last, email, hash);
//
//         req.session.userId = id;
//         res.json({
//             success: true
//         });
//     } catch (err) {
//         console.log("err in POST /register: ", err);
//         res.json({
//             success: false
//         });
//     }
// });

app.post("/login", (req, res) => {
    console.log("*************** /login POST ***********");
    // console.log(`your name is: ${req.body.first} ${req.body.last}`);
    let typedPW = req.body.password;
    getUser(req.body.email)
        .then(result => {
            let userId = result[0].id;
            let userPW = result[0].password;
            let first = result[0].first;
            let last = result[0].last;
            // console.log("userId in users table: ", userId);
            // console.log("userPW safed in user table: ", userPW);
            compare(typedPW, userPW).then(result => {
                console.log("passwords do match: ", result);
                if (result) {
                    // if password correct:
                    req.session.userId = userId;
                    req.session.first = first;
                    req.session.last = last;
                    req.session.email = req.body.email;
                    res.json({
                        success: true
                    });
                } else {
                    // if password wrong:
                    let loginErr = "wrong password or email!";
                    console.log(loginErr);
                    res.json({
                        success: false
                    });
                }
            });
        })
        .catch(err => {
            console.log("err in /login: ", err);
            res.json({
                success: false
            });
        });
});

app.post("/reset/start", (req, res) => {
    console.log("*************** /reset/start POST ***********");
    getUser(req.body.email)
        .then(result => {
            // console.log('result.length: ', result.length);
            if (result.length != 0) {
                const secretCode = cryptoRandomString({
                    length: 6
                });
                console.log("not so secretCode: ", secretCode);
                // SEND EMAIL WITH SECRET CODE:
                let recipient = req.body.email;
                let message = "here is your secret code to reset your password: "+secretCode;
                let subject = "resetting your password";
                sendEmail(recipient, message, subject);

                addCode(req.body.email, secretCode)
                    .then(() => {
                        res.json({
                            success: true
                        });
                    })
                    .catch(err => {
                        console.log(
                            "err in addCode() /reset/start POST: ",
                            err
                        );
                        res.json({
                            success: false
                        });
                    });
            } else {
                res.json({
                    success: false
                });
            }
        })
        .catch(err => {
            console.log("err in getUser() in /reset/start: ", err);
            res.json({
                success: false
            });
        });
});

app.post("/reset/verify", (req, res) => {
    console.log("*************** /reset/verify POST ***********");
    getCode(req.body.email)
        .then(result => {
            // console.log('result.length: ', result.length);
            if (result.length != 0) {
                console.log('code we sent you: ', result[0].code);
                console.log('the code you typed in: ', req.body.code);
                console.log('your new password: ', req.body.password);
                if (result[0].code == req.body.code) {
                    // SET NEW PASSWORD HERE:
                    hash(req.body.password).then(password => {
                        setNewPassword(req.body.email, password).then(() => {
                            console.log('successfully changed password');
                            res.json({
                                success: true
                            });
                        }).catch(err => {
                            console.log("err in setNewPassword() in /reset/verify: ", err);
                            res.json({
                                success: false
                            });
                        });
                    }).catch(err => {
                        console.log("err in hash(password) in /reset/verify: ", err);
                        res.json({
                            success: false
                        });
                    });

                } else {
                    res.json({
                        success: false
                    });
                }
            } else {
                res.json({
                    success: false
                });
            }
        })
        .catch(err => {
            console.log("err in getUser() in /reset/verify: ", err);
            res.json({
                success: false
            });
        });
});

app.post("/bio/edit", (req, res) => {
    console.log("*************** /POST /bio/edit ***********");
    editBio(req.body.userId, req.body.bio)
        .then(() => {
            res.json({
                success: true,
            });
        })
        .catch(err => {
            console.log("err in editBio(): ", err);
            res.json({
                success: false
            });
        });
});

// add other routes here (above get *)...
// serves index.html for ALL routes:
app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.listen(8080, function() {
    console.log("I'm listening.");
});
