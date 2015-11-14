-- Articulations table

CREATE TABLE Articulations(
  id           INT         NOT NULL AUTO_INCREMENT,
  time_created TIMESTAMP   NOT NULL DEFAULT NOW(),
  last_updated TIMESTAMP   NOT NULL DEFAULT '0000-00-00 00:00:00',
  major_id     INT,

  PRIMARY KEY (id),
  FOREIGN KEY (major_id) REFERENCES Majors(id)
) ENGINE=InnoDB;
