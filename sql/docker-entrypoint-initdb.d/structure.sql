CREATE TABLE users (
    id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    pwdhash TEXT NOT NULL,
    two_fa_ref TEXT
);

CREATE TABLE groups (
    id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    groupname VARCHAR(255) UNIQUE,
    owner INTEGER UNSIGNED UNIQUE,
    FOREIGN KEY (owner) REFERENCES users (id)
);

CREATE TABLE service (
    id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    servicename TEXT NOT NULL,
    loginname TEXT NOT NULL,
    loginpassword TEXT NOT NULL,
    two_fa_ref TEXT,
    owner INTEGER UNSIGNED not NULL,
    FOREIGN KEY (owner) REFERENCES users (id)
);

CREATE TABLE service_permission (
    id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id INTEGER UNSIGNED,
    group_id INTEGER UNSIGNED,
    service_id INTEGER UNSIGNED NOT NULL,
    UNIQUE (user_id, service_id),
    UNIQUE (group_id, service_id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (group_id) REFERENCES groups (id),
    FOREIGN KEY (service_id) REFERENCES service (id),
    CHECK (
        (
            user_id IS NOT NULL
            AND group_id IS null
        )
        OR (
            user_id IS NULL
            AND group_id IS NOT NULL
        )
    )
);

CREATE TABLE user_groups (
    user_id INTEGER UNSIGNED,
    group_id INTEGER UNSIGNED,
    PRIMARY KEY (user_id, group_id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (group_id) REFERENCES groups (id)
);

CREATE TABLE group_invitation (
    id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    group_id INTEGER UNSIGNED NOT NULL,
    user_id INTEGER UNSIGNED,
    expire_after TIMESTAMP NOT NULL,
    remaining_uses SMALLINT DEFAULT -1,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (group_id) REFERENCES groups (id)
);

