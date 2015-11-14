-- Majors table

CREATE TABLE Majors(
  id             INT         NOT NULL AUTO_INCREMENT,
  time_created   TIMESTAMP   NOT NULL DEFAULT NOW(),
  last_updated   TIMESTAMP   NOT NULL DEFAULT '0000-00-00 00:00:00',
  assist_code    VARCHAR(25) NOT NULL,
  full_name      VARCHAR(100),
  from_school_id INT,
  to_school_id   INT,

  PRIMARY KEY (id),
  FOREIGN KEY (from_school_id) REFERENCES Schools(id),
  FOREIGN KEY (to_school_id)   REFERENCES Schools(id)
) ENGINE=InnoDB;
