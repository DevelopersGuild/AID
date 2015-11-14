-- Schools table

CREATE TABLE Schools(
  id           INT,
  time_created TIMESTAMP NOT NULL,
  last_updated TIMESTAMP NOT NULL,
  assist_code  VARCHAR(10) NOT NULL,
  full_name    VARCHAR(100),

  PRIMARY KEY (id)
);
