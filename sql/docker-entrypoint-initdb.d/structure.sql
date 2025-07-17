CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    pwdhash TEXT NOT NULL,
    two_fa_ref TEXT
);

CREATE TABLE groups (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    groupname VARCHAR(255) UNIQUE,
    owner INTEGER UNIQUE,
    Foreign Key (owner) REFERENCES users (id)
);

CREATE TABLE service (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    servicename TEXT NOT NULL,
    loginname TEXT NOT NULL,
    loginpassword TEXT NOT NULL,
    twoFAref TEXT,
    owner INTEGER not NULL,
    FOREIGN KEY (owner) REFERENCES users (id)
);

CREATE TABLE service_permission (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id INTEGER,
    group_id INTEGER,
    service_id INTEGER NOT NULL,
    UNIQUE (user_id, service_id),
    UNIQUE (group_id, service_id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (group_id) REFERENCES groups (id),
    FOREIGN KEY (service_id) REFERENCES service (id),
    Check (
        (
            user_id IS NOT NULL
            AND group_id IS null
        )
        or (
            user_id IS NULL
            AND group_id IS NOT NULL
        )
    )
);

CREATE TABLE user_groups (
    user_id INTEGER,
    group_id INTEGER,
    PRIMARY KEY (user_id, group_id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (group_id) REFERENCES groups (id)
);

CREATE TABLE group_invitation (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    group_id INTEGER NOT NULL,
    user_id INTEGER,
    expire_after TIMESTAMP,
    remaining_uses SMALLINT DEFAULT -1,
    Foreign Key (user_id) REFERENCES users (id),
    Foreign Key (group_id) REFERENCES groups (id)
);

DELIMITER //

CREATE TRIGGER set_expirydate
BEFORE INSERT ON group_invitation 
FOR EACH ROW
BEGIN
    IF NEW.expire_after is NULL THEN
        SET NEW.expire_after = NOW() + INTERVAL 5 MINUTE;
    END IF;
END;
//

DELIMITER ;