-- schools table

CREATE TABLE Schools(
  id INT(10) PRIMARY KEY,
  time_created TIMESTAMP NOT NULL,
  last_updated TIMESTAMP NOT NULL,
  assist_code VARCHAR(10) NOT NULL,
  full_name VARCHAR(100)
);
