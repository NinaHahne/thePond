DROP TABLE IF EXISTS messages;

CREATE TABLE messages(
    id SERIAL PRIMARY KEY,
    msg TEXT NOT NULL CHECK (msg != ''),
    user_id INT REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
