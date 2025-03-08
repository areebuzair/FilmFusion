-- Create the database with UTF-8 encoding
CREATE DATABASE IF NOT EXISTS movies_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Switch to the new database
USE movies_db;

CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) DEFAULT NULL,
  `user_password` varchar(255) DEFAULT NULL,
  `user_email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- ======================
-- Table Definitions
-- ======================

-- Movies Table
CREATE TABLE IF NOT EXISTS movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    release_year INT NOT NULL,
    director VARCHAR(255) NOT NULL,
    rating DECIMAL(3,1) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Genres Table
CREATE TABLE IF NOT EXISTS genres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- Movie_Genres Join Table (many-to-many relationship between movies and genres)
CREATE TABLE IF NOT EXISTS movie_genres (
    movie_id INT NOT NULL,
    genre_id INT NOT NULL,
    PRIMARY KEY (movie_id, genre_id),
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Actors Table
CREATE TABLE IF NOT EXISTS actors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    dob DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Movie_Actors Join Table (many-to-many relationship between movies and actors)
CREATE TABLE IF NOT EXISTS movie_actors (
    movie_id INT NOT NULL,
    actor_id INT NOT NULL,
    role VARCHAR(255),
    PRIMARY KEY (movie_id, actor_id),
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES actors(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Actor Movie Log Table (used for trigger logging)
CREATE TABLE IF NOT EXISTS actor_movie_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT,
    actor_id INT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ========================================
-- Triggers
-- ========================================

-- Trigger: Before inserting a movie, validate that the rating (if provided) is between 0 and 10.
DELIMITER //
CREATE TRIGGER before_insert_movie
BEFORE INSERT ON movies
FOR EACH ROW
BEGIN
    IF NEW.rating IS NOT NULL AND (NEW.rating < 0 OR NEW.rating > 10) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Invalid rating: Must be between 0 and 10';
    END IF;
END;
//
DELIMITER ;

-- Trigger: After inserting a movie, automatically assign the default genre "Uncategorized"
-- if no other genre is specified. (This trigger always assigns "Uncategorized".)
DELIMITER //
CREATE TRIGGER after_insert_movie
AFTER INSERT ON movies
FOR EACH ROW
BEGIN
    DECLARE genre_id INT;
    -- Check if 'Uncategorized' exists; if not, insert it.
    SELECT id INTO genre_id FROM genres WHERE name = 'Uncategorized' LIMIT 1;
    IF genre_id IS NULL THEN
        INSERT INTO genres (name) VALUES ('Uncategorized');
        SET genre_id = LAST_INSERT_ID();
    END IF;
    -- Link the new movie with the 'Uncategorized' genre.
    INSERT INTO movie_genres (movie_id, genre_id) VALUES (NEW.id, genre_id);
END;
//
DELIMITER ;

-- Trigger: After inserting into movie_actors, log the association in actor_movie_log.
DELIMITER //
CREATE TRIGGER after_actor_assigned
AFTER INSERT ON movie_actors
FOR EACH ROW
BEGIN
    INSERT INTO actor_movie_log (movie_id, actor_id)
    VALUES (NEW.movie_id, NEW.actor_id);
END;
//
DELIMITER ;

-- ========================================
-- Stored Function
-- ========================================

-- Function: Returns the average rating for all movies directed by a given director.
DELIMITER //
CREATE FUNCTION get_avg_rating(director_name VARCHAR(255)) RETURNS DECIMAL(3,1)
DETERMINISTIC
BEGIN
    DECLARE avg_rating DECIMAL(3,1);
    SELECT AVG(rating) INTO avg_rating FROM movies WHERE director = director_name;
    RETURN avg_rating;
END;
//
DELIMITER ;

-- ========================================
-- Stored Procedures
-- ========================================

-- Procedure: Add a new movie and associate it with a comma-separated list of genres.
-- The procedure expects p_genres_list as a comma-separated string (e.g., 'Action, Sci-Fi').
DELIMITER //
CREATE PROCEDURE add_movie(
    IN p_title VARCHAR(255),
    IN p_release_year INT,
    IN p_director VARCHAR(255),
    IN p_rating DECIMAL(3,1),
    IN p_genres_list TEXT
)
BEGIN
    DECLARE movie_id INT;
    DECLARE genre_name VARCHAR(100);
    DECLARE genre_id INT;
    DECLARE temp_genres TEXT DEFAULT p_genres_list;
    DECLARE delim CHAR(1) DEFAULT ',';

    -- Insert the new movie
    INSERT INTO movies (title, release_year, director, rating)
    VALUES (p_title, p_release_year, p_director, p_rating);
    SET movie_id = LAST_INSERT_ID();

    -- Process the comma-separated genres list
    WHILE LENGTH(temp_genres) > 0 DO
        -- Extract the first genre from the list
        SET genre_name = TRIM(SUBSTRING_INDEX(temp_genres, delim, 1));
        -- Remove the extracted genre from the list
        IF LOCATE(delim, temp_genres) > 0 THEN
            SET temp_genres = SUBSTRING(temp_genres, LOCATE(delim, temp_genres) + 1);
        ELSE
            SET temp_genres = '';
        END IF;
        
        IF genre_name <> '' THEN
            -- Check if the genre exists; if not, insert it.
            SELECT id INTO genre_id FROM genres WHERE name = genre_name LIMIT 1;
            IF genre_id IS NULL THEN
                INSERT INTO genres (name) VALUES (genre_name);
                SET genre_id = LAST_INSERT_ID();
            END IF;
            -- Associate the movie with the genre.
            INSERT INTO movie_genres (movie_id, genre_id) VALUES (movie_id, genre_id);
        END IF;
    END WHILE;
END;
//
DELIMITER ;

-- Procedure: Retrieve movies for a specific actor given the actor's full name.
DELIMITER //
CREATE PROCEDURE get_movies_by_actor(IN p_actor_name VARCHAR(255))
BEGIN
    SELECT m.id, m.title, m.release_year, m.director, m.rating, ma.role
    FROM movies m
    JOIN movie_actors ma ON m.id = ma.movie_id
    JOIN actors a ON ma.actor_id = a.id
    WHERE CONCAT(a.first_name, ' ', a.last_name) = p_actor_name;
END;
//
DELIMITER ;

-- Procedure: Increase the rating of all movies by a specified director by a given boost amount.
-- This procedure uses a cursor to iterate over the movies.
DELIMITER //
CREATE PROCEDURE update_movie_ratings(IN p_director_name VARCHAR(255), IN p_rating_boost DECIMAL(2,1))
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE cur_movie_id INT;
    DECLARE cur CURSOR FOR SELECT id FROM movies WHERE director = p_director_name;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO cur_movie_id;
        IF done THEN
            LEAVE read_loop;
        END IF;
        UPDATE movies SET rating = rating + p_rating_boost WHERE id = cur_movie_id;
    END LOOP;
    CLOSE cur;
END;
//
DELIMITER ;

-- ========================================
-- Scheduled Event
-- ========================================

-- Enable the event scheduler (if not already enabled)
SET GLOBAL event_scheduler = ON;

-- Event: Delete movies released before 1980 every day.
DELIMITER //
CREATE EVENT delete_old_movies
ON SCHEDULE EVERY 1 DAY
DO
    DELETE FROM movies WHERE release_year < 1980;
//
DELIMITER ;

-- ========================================
-- End of SQL File
-- ========================================

