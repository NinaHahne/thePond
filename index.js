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

// for socket.io:
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });

let secrets;
if (process.env.NODE_ENV === "production") {
    secrets = process.env;
} else {
    secrets = require("./secrets");
}

const {
    addUser,
    getUser,
    getUserById,
    findUsers,
    getRecentUsers,
    getFriendsStatus,
    makeFriendsReq,
    acceptFriendsReq,
    endFriendship,
    getFriendsWannabes,
    addImage,
    addCode,
    getCode,
    setNewPassword,
    editBio,
    getLastTenChatMessages,
    addNewChatMessage,
    getLastChatMessage
} = require("./db");

const { formatDateFromMessages, formatDateFromNewMessage } = require("./functions");

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

// app.use(
//     cookieSession({
//         secret: secrets.SESSION_SECRET,
//         maxAge: 1000 * 60 * 60 * 24 * 14
//     })
// );

// cookie session with socket.io:
const cookieSessionMiddleware = cookieSession({
    secret: secrets.SESSION_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

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
    getUser(req.session.email)
        .then(rows => {
            // check if rows[0].length != 0;
            res.json({
                success: true,
                userId: rows[0].id,
                first: rows[0].first,
                last: rows[0].last,
                imageUrl: rows[0].img_url || "/images/duck-308733.svg",
                bio: rows[0].bio || ""
            });
        })
        .catch(err => {
            console.log("err in GET /user : ", err);
            res.json({
                success: false
            });
        });
});

app.get("/api/user/:id", (req, res) => {
    console.log("*************** /api/user/:id ***********");
    getUserById(req.params.id)
        .then(rows => {
            res.json({
                success: true,
                userId: rows[0].id,
                first: rows[0].first,
                last: rows[0].last,
                imageUrl: rows[0].img_url || "/images/duck-308733.svg",
                bio: rows[0].bio || ""
            });
        })
        .catch(err => {
            console.log("err in GET /api/user/:id : ", err);
            res.json({
                success: false
            });
        });
});

app.get("/api/find/:searchFor", (req, res) => {
    console.log("*************** /api/find/:searchFor ***********");
    // console.log('req.params.searchFor: ', req.params.searchFor);
    findUsers(req.params.searchFor)
        .then(rows => {
            // console.log('rows from findUsers():', rows);
            res.json({
                success: true,
                users: rows
            });
        })
        .catch(err => {
            console.log("err in GET /api/find/:searchFor: ", err);
            res.json({
                success: false
            });
        });
});

app.get("/users/recent/:userId", (req, res) => {
    console.log("*************** /users/recent ***********");
    getRecentUsers(req.params.userId)
        .then(rows => {
            // check if rows[0].length != 0;
            res.json({
                success: true,
                recentUsers: rows
            });
        })
        .catch(err => {
            console.log("err in GET /users/recent: ", err);
            res.json({
                success: false
            });
        });
});

app.get("/friends-status/:userId", (req, res) => {
    console.log("*************** /friends-status/:userId ***********");
    getFriendsStatus(req.session.userId, req.params.userId)
        .then(rows => {
            // check if rows[0].length != 0;
            // console.log('rows after getFriendsStatus: ', rows);
            res.json({
                success: true,
                friendsStatus: rows[0]
            });
        })
        .catch(err => {
            console.log("err in /friends-status/:userId: ", err);
            res.json({
                success: false
            });
        });
});

app.get("/friends-wannabes", (req, res) => {
    console.log("*************** /friends-wannabes ***********");
    getFriendsWannabes(req.session.userId)
        .then(rows => {
            // check if rows[0].length != 0;
            console.log("rows after getFriendsWannabes(): ", rows);
            res.json({
                success: true,
                friendsWannabes: rows
            });
        })
        .catch(err => {
            console.log("err in /friends-wannabes: ", err);
            res.json({
                success: false
            });
        });
});

app.post("/make-friend-request/:userId", (req, res) => {
    console.log("*************** /make-friend-request/:userId ***********");
    makeFriendsReq(req.session.userId, req.params.userId)
        .then(() => {
            // check if rows[0].length != 0;
            res.json({
                success: true
            });
        })
        .catch(err => {
            console.log("err in /make-friend-request/:userId: ", err);
            res.json({
                success: false
            });
        });
});

app.post("/accept-friend-request/:userId", (req, res) => {
    console.log("*************** /accept-friend-request/:userId ***********");
    acceptFriendsReq(req.session.userId, req.params.userId)
        .then(() => {
            // check if rows[0].length != 0;
            res.json({
                success: true
            });
        })
        .catch(err => {
            console.log("err in /accept-friend-request/:userId: ", err);
            res.json({
                success: false
            });
        });
});

app.post("/end-friendship/:userId", (req, res) => {
    console.log("*************** /end-friendship/:userId ***********");
    endFriendship(req.session.userId, req.params.userId)
        .then(() => {
            // check if rows[0].length != 0;
            res.json({
                success: true
            });
        })
        .catch(err => {
            console.log("err in /end-friendship/:userId: ", err);
            res.json({
                success: false
            });
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("*************** POST /upload ***********");
    const imageUrl = s3Url + req.file.filename;
    // url of image: https://s3.amazonaws.com/name-of-bucket/filename
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

app.post("/bio/edit", (req, res) => {
    console.log("*************** /POST /bio/edit ***********");
    editBio(req.body.userId, req.body.bio)
        .then(() => {
            res.json({
                success: true
            });
        })
        .catch(err => {
            console.log("err in editBio(): ", err);
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
    // console.log(`your name is: ${req.body.first} ${req.body.last}`);
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
                req.session.email = req.body.email;
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
                // console.log("passwords do match: ", result);
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
                let message =
                    "here is your secret code to reset your password: " +
                    secretCode;
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
                console.log("code we sent you: ", result[0].code);
                console.log("the code you typed in: ", req.body.code);
                console.log("your new password: ", req.body.password);
                if (result[0].code == req.body.code) {
                    // SET NEW PASSWORD HERE:
                    hash(req.body.password)
                        .then(password => {
                            setNewPassword(req.body.email, password)
                                .then(() => {
                                    console.log(
                                        "successfully changed password"
                                    );
                                    res.json({
                                        success: true
                                    });
                                })
                                .catch(err => {
                                    console.log(
                                        "err in setNewPassword() in /reset/verify: ",
                                        err
                                    );
                                    res.json({
                                        success: false
                                    });
                                });
                        })
                        .catch(err => {
                            console.log(
                                "err in hash(password) in /reset/verify: ",
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

// add other routes here (above get *)...
// serves index.html for ALL routes:
app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

// with socket.io:
server.listen(8080, function() {
    console.log("I'm listening.");
});
// without socket.io:
// app.listen(8080, function() {
//     console.log("I'm listening.");
// });

io.on("connection", function(socket) {
    // if not logged in, disconnect:
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }
    //  get the last 10 messages from DB:
    getLastTenChatMessages()
        .then(data => {
            // console.log("data after getLastTenChatMessages: ", data);
            data.reverse();
            let messagesWithPrettyDates = formatDateFromMessages(data);
            // emitting the 10 messages to all connected sockets:
            io.sockets.emit("chatMessages", messagesWithPrettyDates);
        })
        .catch(err => console.log("err in getLastTenChatMessages(): ", err));

    const userId = socket.request.session.userId;

    socket.on("My amazing chat message", msg => {
        // console.log("on the server...", msg);
        addNewChatMessage(userId, msg)
            .then(data => {
                getLastChatMessage(data[0].id)
                    .then(data => {
                        // console.log("data after getLastChatMessage: ", data);
                        let newMessageWithPrettyDate = formatDateFromNewMessage(data[0]);
                        io.sockets.emit("chatMessage", newMessageWithPrettyDate);
                    })
                    .catch(err =>
                        console.log("err in getLastChatMessage(): ", err)
                    );
            })
            .catch(err => console.log("err in addNewChatMessage(): ", err));
    });
});

// io.on('connection', socket => {
//     console.log(`socket with the id ${socket.id} is now connected`);
//
//     socket.on('disconnect', function() {
//         console.log(`socket with the id ${socket.id} is now disconnected`);
//     });
//
//     socket.on('thanks', data => {
//         console.log(data);
//     });
//
//     socket.emit('welcome', {
//         message: 'Welcome. It is nice to see you'
//     });
//     // msg to all users:
//     io.emit('attention', {
//         msg: 'whatever'
//     });
//     // msg to all exept socket who just sent a message:
//     socket.broadcast.emit('message', {
//         msg: 'whatever'
//     });
// });
