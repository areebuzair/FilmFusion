-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema movies_db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema movies_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `movies_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ;
USE `movies_db` ;

-- -----------------------------------------------------
-- Table `movies_db`.`actor_movie_log`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `movies_db`.`actor_movie_log` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `movie_id` INT NULL DEFAULT NULL,
  `actor_id` INT NULL DEFAULT NULL,
  `assigned_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `movies_db`.`actors`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `movies_db`.`actors` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `dob` DATE NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `movies_db`.`genres`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `movies_db`.`genres` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name` (`name` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `movies_db`.`movies`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `movies_db`.`movies` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `release_year` INT NOT NULL,
  `director` VARCHAR(255) NOT NULL,
  `rating` DECIMAL(3,1) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `poster_url` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 13
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `movies_db`.`movie_actors`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `movies_db`.`movie_actors` (
  `movie_id` INT NOT NULL,
  `actor_id` INT NOT NULL,
  `role` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`movie_id`, `actor_id`),
  INDEX `actor_id` (`actor_id` ASC) VISIBLE,
  CONSTRAINT `movie_actors_ibfk_1`
    FOREIGN KEY (`movie_id`)
    REFERENCES `movies_db`.`movies` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `movie_actors_ibfk_2`
    FOREIGN KEY (`actor_id`)
    REFERENCES `movies_db`.`actors` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `movies_db`.`movie_genres`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `movies_db`.`movie_genres` (
  `movie_id` INT NOT NULL,
  `genre_id` INT NOT NULL,
  PRIMARY KEY (`movie_id`, `genre_id`),
  INDEX `genre_id` (`genre_id` ASC) VISIBLE,
  CONSTRAINT `movie_genres_ibfk_1`
    FOREIGN KEY (`movie_id`)
    REFERENCES `movies_db`.`movies` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `movie_genres_ibfk_2`
    FOREIGN KEY (`genre_id`)
    REFERENCES `movies_db`.`genres` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `movies_db`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `movies_db`.`users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `user_name` VARCHAR(255) NULL DEFAULT NULL,
  `user_password` VARCHAR(255) NULL DEFAULT NULL,
  `user_email` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 32
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

USE `movies_db` ;

-- -----------------------------------------------------
-- procedure add_movie
-- -----------------------------------------------------

DELIMITER $$
USE `movies_db`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_movie`(
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
END$$

DELIMITER ;

-- -----------------------------------------------------
-- function get_avg_rating
-- -----------------------------------------------------

DELIMITER $$
USE `movies_db`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `get_avg_rating`(director_name VARCHAR(255)) RETURNS decimal(3,1)
    DETERMINISTIC
BEGIN
    DECLARE avg_rating DECIMAL(3,1);
    SELECT AVG(rating) INTO avg_rating FROM movies WHERE director = director_name;
    RETURN avg_rating;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure get_movies_by_actor
-- -----------------------------------------------------

DELIMITER $$
USE `movies_db`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_movies_by_actor`(IN p_actor_name VARCHAR(255))
BEGIN
    SELECT m.id, m.title, m.release_year, m.director, m.rating, ma.role
    FROM movies m
    JOIN movie_actors ma ON m.id = ma.movie_id
    JOIN actors a ON ma.actor_id = a.id
    WHERE CONCAT(a.first_name, ' ', a.last_name) = p_actor_name;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure update_movie_ratings
-- -----------------------------------------------------

DELIMITER $$
USE `movies_db`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_movie_ratings`(IN p_director_name VARCHAR(255), IN p_rating_boost DECIMAL(2,1))
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
END$$

DELIMITER ;
USE `movies_db`;

DELIMITER $$
USE `movies_db`$$
CREATE
DEFINER=`root`@`localhost`
TRIGGER `movies_db`.`after_insert_movie`
AFTER INSERT ON `movies_db`.`movies`
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
END$$

USE `movies_db`$$
CREATE
DEFINER=`root`@`localhost`
TRIGGER `movies_db`.`before_insert_movie`
BEFORE INSERT ON `movies_db`.`movies`
FOR EACH ROW
BEGIN
    IF NEW.rating IS NOT NULL AND (NEW.rating < 0 OR NEW.rating > 10) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Invalid rating: Must be between 0 and 10';
    END IF;
END$$

USE `movies_db`$$
CREATE
DEFINER=`root`@`localhost`
TRIGGER `movies_db`.`after_actor_assigned`
AFTER INSERT ON `movies_db`.`movie_actors`
FOR EACH ROW
BEGIN
    INSERT INTO actor_movie_log (movie_id, actor_id)
    VALUES (NEW.movie_id, NEW.actor_id);
END$$


DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Table `movies_db`.`movie_reviews`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `movies_db`.`movie_reviews` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `movie_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `review` VARCHAR(350) NOT NULL,
    `rating` INT NULL DEFAULT NULL CHECK (`rating` BETWEEN 1 AND 5),
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`movie_id`) REFERENCES `movies_db`.`movies` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `movies_db`.`users` (`user_id`) ON DELETE CASCADE
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

-- need to think about watchlist table structure
-- -----------------------------------------------------
-- Table `movies_db`.`watch_later`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `movies_db`.`watch_later` (
    `user_id` INT NOT NULL,
    `movie_id` INT NOT NULL,
    `watched` BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (`user_id`, `movie_id`),
    FOREIGN KEY (`user_id`) REFERENCES `movies_db`.`users` (`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`movie_id`) REFERENCES `movies_db`.`movies` (`id`) ON DELETE CASCADE
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- trigger

DELIMITER $$

CREATE
DEFINER=`root`@`localhost`
TRIGGER `movies_db`.`after_insert_review`
AFTER INSERT ON `movies_db`.`movie_reviews`
FOR EACH ROW
BEGIN
    UPDATE watch_later
    SET watched = TRUE
    WHERE user_id = NEW.user_id AND movie_id = NEW.movie_id;
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER update_movie_rating_after_insert
AFTER INSERT ON movie_reviews
FOR EACH ROW
BEGIN
  UPDATE movies
  SET rating = (
    SELECT AVG(rating)
    FROM movie_reviews
    WHERE movie_id = NEW.movie_id
  )
  WHERE id = NEW.movie_id;
END$$

CREATE TRIGGER update_movie_rating_after_update
AFTER UPDATE ON movie_reviews
FOR EACH ROW
BEGIN
  UPDATE movies
  SET rating = (
    SELECT AVG(rating)
    FROM movie_reviews
    WHERE movie_id = NEW.movie_id
  )
  WHERE id = NEW.movie_id;
END$$

DELIMITER ;


