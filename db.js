const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/socialnetwork"
);

exports.addUser = function(first, last, email, password) {
    return db.query(
        `INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4) RETURNING id`,
        [first, last, email, password]
    );
};

exports.getUser = function(email) {
    return db
        .query(`SELECT * FROM users WHERE email = $1`, [email])
        .then(({ rows }) => rows);
};

exports.addCode = function(email, code) {
    return db
        .query(`INSERT INTO codes (email, code)
        VALUES ($1, $2) RETURNING id`, [email, code])
        .then(({ rows }) => rows);
};

exports.getCode = function(email) {
    return db
        .query(`SELECT * FROM codes
            WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
            AND email = $1
            ORDER BY id DESC
            LIMIT 1`, [email])
        .then(({ rows }) => rows);
};

exports.setNewPassword = function(email, password) {
    return db.query(
        `UPDATE users
        SET password = $2
        WHERE email = $1`,
        [email, password]
    );
};

// exports.upsertProfile = function(age, city, url, user_id) {
//     return db.query(
//         `INSERT INTO users (age, city, url, user_id)
//         VALUES ($1, $2, $3, $4)
//         ON CONFLICT (user_id)
//         DO UPDATE SET age = $1, city = $2, url = $3`,
//         [age, city, url, user_id]
//     );
// };
