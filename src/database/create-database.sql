CREATE DATABASE business_database;
USE business_database;

 CREATE TABLE business (
     id INT AUTO_INCREMENT PRIMARY KEY,
     businessId VARCHAR(255) NOT NULL,
     businessValue VARCHAR(255),
     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
 );


INSERT INTO business (businessId, businessValue) VALUES (
    "1",
    "Hello, World"
);

INSERT INTO business (businessId, businessValue) VALUES (
    "2",
    "Foo Bar"
);