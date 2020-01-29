const express = require("express");
const app = express();
const helmet = require("helmet");
const compression = require("compression");

const cookieSession = require("cookie-session");
const csurf = require("csurf");

// for log in:
const { hash, compare } = require("./bcrypt");

let secrets;

if (process.env.NODE_ENV === "production") {
    secrets = process.env;
} else {
    secrets = require("./secrets");
}

const { addUser, getUser } = require("./db");

app.use(helmet());

app.use(express.static("./public"));

app.use(express.json());

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
            console.log("err in /register POST: ", err);
            res.json({
                success: false
            });
        });
});

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
