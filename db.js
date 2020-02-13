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
        .query(
            `SELECT * FROM users
            WHERE email = $1`, [email])
        .then(({ rows }) => rows);
};

exports.getUserById = function(id) {
    return db
        .query(
            `SELECT * FROM users
            WHERE id = $1`,
            [id])
        .then(({ rows }) => rows);
};

// exports.findUsers = function(searchFor) {
//     return db
//         .query(
//             `SELECT * FROM users
//             WHERE first ILIKE $1`,
//             [searchFor + '%'])
//         .then(({ rows }) => rows);
// };

exports.findUsers = function(searchFor) {
    return db
        .query(
            `SELECT * FROM users
            WHERE first ILIKE $1
            OR last ILIKE $1
            OR CONCAT(first, ' ', last) ILIKE $1
            ORDER BY id
            LIMIT 6`,
            [searchFor + '%'])
        .then(({ rows }) => rows);
};

exports.findUsersByBio = function(searchFor) {
    return db
        .query(
            `SELECT * FROM users
            WHERE bio ILIKE $1
            ORDER BY id
            LIMIT 6`,
            ['%'+ searchFor + '%'])
        .then(({ rows }) => rows);
};

exports.getRecentUsers = function(userId) {
    return db
        .query(
            `SELECT * FROM users
            WHERE NOT id = $1
            ORDER BY id DESC
            LIMIT 3`,
            [userId])
        .then(({ rows }) => rows);
};

exports.getFriendsStatus = function(me, otherUser) {
    return db
        .query(
            `SELECT * FROM friendships
            WHERE (recipient_id = $1 AND sender_id = $2)
            OR (recipient_id = $2 AND sender_id = $1)`,
            [me, otherUser])
        .then(({ rows }) => rows);
};

exports.makeFriendsReq = function(me, otherUser) {
    return db
        .query(
            `INSERT INTO friendships (sender_id, recipient_id)
            VALUES ($1, $2)
            RETURNING id`,
            [me, otherUser])
        .then(({ rows }) => rows);
};

exports.acceptFriendsReq = function(me, otherUser) {
    return db
        .query(
            `UPDATE friendships
            SET accepted = true
            WHERE (recipient_id = $1 AND sender_id = $2)
            RETURNING id`,
            [me, otherUser])
        .then(({ rows }) => rows);
};

exports.endFriendship = function(sender_id, recipient_id) {
    return db
        .query(
            `DELETE FROM friendships
            WHERE (recipient_id = $1 AND sender_id = $2)
            OR (recipient_id = $2 AND sender_id = $1)
            RETURNING id`,
            [sender_id, recipient_id])
        .then(({ rows }) => rows);
};

exports.getFriendsWannabes = function(userId) {
    return db
        .query(
            `SELECT users.id, first, last, img_url, accepted
            FROM friendships
            JOIN users
            ON (accepted = false AND recipient_id = $1
                AND sender_id = users.id)
            OR (accepted = true AND recipient_id = $1
                AND sender_id = users.id)
            OR (accepted = true AND sender_id = $1
                AND recipient_id = users.id)`,
            [userId])
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
        .query(
            `INSERT INTO codes (email, code)
            VALUES ($1, $2) RETURNING id`,
            [email, code])
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

exports.editBio = function(userId, bio) {
    return db.query(
        `UPDATE users
        SET bio = $2
        WHERE id = $1`,
        [userId, bio]
    );
};

exports.getLastTenChatMessages = function() {
    return db
        .query(
            `SELECT messages.id, messages.msg, messages.user_id, messages.created_at, users.first, users.last, users.img_url
            FROM messages
            JOIN users
            ON messages.user_id = users.id
            ORDER BY id DESC
            LIMIT 10`)
        .then(({ rows }) => rows);
};

exports.addNewChatMessage = function(userId, msg) {
    return db
        .query(
            `INSERT INTO messages (user_id, msg)
            VALUES ($1, $2) RETURNING id`,
            [userId, msg])
        .then(({ rows }) => rows);
};

exports.getLastChatMessage = function(id) {
    return db
        .query(
            `SELECT messages.id, messages.msg, messages.user_id, messages.created_at, users.first, users.last, users.img_url
            FROM messages
            JOIN users
            ON messages.user_id = users.id
            WHERE messages.id = $1`,
            [id])
        .then(({ rows }) => rows);
};

exports.getOnlineUsers = function(arrayOfUserIds) {
    return db
        .query(
            `SELECT id, first, last, img_url
            FROM users
            WHERE id = ANY ($1)`,
            [arrayOfUserIds]
        )
        .then(({ rows }) => rows);
};
