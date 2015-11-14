-- Schools table

CREATE TABLE Schools(
  id           INT         NOT NULL AUTO_INCREMENT,
  time_created TIMESTAMP   NOT NULL DEFAULT SYSDATE(),
  last_updated TIMESTAMP   NOT NULL DEFAULT SYSDATE(),
  assist_code  VARCHAR(10) NOT NULL,
  full_name    VARCHAR(100),

  PRIMARY KEY (id)
);
