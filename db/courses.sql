-- Courses table

CREATE TABLE Courses(
  id           INT,
  time_created TIMESTAMP NOT NULL,
  last_updated TIMESTAMP NOT NULL,
  assist_code  VARCHAR(20) NOT NULL,
  full_name    VARCHAR(100),
  units        INT,

  PRIMARY KEY (id)
);
