CREATE TABLE users
    (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        pwdhash TEXT NOT NULL,
        two_fa_ref TEXT,
    );

CREATE TABLE groups 
    (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        groupname VARCHAR(255) UNIQUE,

    );

CREATE TABLE perms
    (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        permname VARCHAR(255) UNIQUE NOT NULL,
    );

CREATE TABLE authentications
    (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        servicename TEXT NOT NULL, 
        loginname TEXT NOT NULL,
        loginpassword TEXT NOT NULL,
        twoFAref TEXT
    );

CREATE TABLE user_groups 
    (
        user_id INTEGER,
        group_id INTEGER,
        PRIMARY KEY (user_id, group_id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (group_id) REFERENCES groups(id)
    );
