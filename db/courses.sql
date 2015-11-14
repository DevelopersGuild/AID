-- courses table

CREATE TABLE Courses(
  id INT(10) PRIMARY KEY,
  time_created TIMESTAMP NOT NULL,
  last_updated TIMESTAMP NOT NULL,
  assist_code VARCHAR(20) NOT NULL,
  full_name VARCHAR(100),
  units INT(2)
);