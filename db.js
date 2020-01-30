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

exports.addImage = function(email, imageUrl) {
    return db.query(
        `UPDATE users
        SET img_url = $2
        WHERE email = $1`,
        [email, imageUrl]
    );
};

exports.addCode = function(email, code) {
    return db
        .query(`INSERT INTO codes (email, code)
        VALUES ($1, $2) RETURNING id`, [email, code])
        .then(({ rows }) => rows);
};

// HOW TO UPDATE THE TIMESTAMP in upsert query? --> use now():
// exports.addCode = function(email, code) {
//     return db.query(
//         `INSERT INTO codes (email, code)
//         VALUES ($1, $2)
//         ON CONFLICT (email)
//         DO UPDATE SET code = $2 created_at = now()`,
//         [email, code]
//     );
// };

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
