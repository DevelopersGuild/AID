-- majors table

CREATE TABLE Majors(
  id INT(10) PRIMARY KEY,
  time_created TIMESTAMP NOT NULL,
  last_updated TIMESTAMP NOT NULL,
  assist_code VARCHAR(25) NOT NULL,
  full_name VARCHAR(50),
  from_school_id FOREIGN KEY,
  to_school_id FOREIGN KEY
);
