
CREATE DATABASE authentication;
use authentication;
show tables;
CREATE TABLE user (
        id int NOT NULL AUTO_INCREMENT,
        fname VARCHAR(225),
        lname VARCHAR(225),
        email VARCHAR(225) NOT NULL,
        gender VARCHAR(225),
        password VARCHAR(225),
        PRIMARY KEY (id)
)

describe user;