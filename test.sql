CREATE table user(
    id INT AUTO_INCREMENT
    name VARCHAR(20) NOT NULL
    email VARCHAR(20) NOT NULL UNIQUE
    password VARCHAR(20) NOT NULL
)

CREATE table chat(
    id INT AUTO_INCREMENT
    username VARCHAR(20) NOT NULL
    message VARCHAR(20) NOT NULL
    status ENUM('completed','pending') NOT NULL
)