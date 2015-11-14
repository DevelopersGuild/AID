-- Articulations table

CREATE TABLE Articulations(
  id           INT         NOT NULL AUTO_INCREMENT,
  time_created TIMESTAMP   NOT NULL DEFAULT SYSDATE(),
  last_updated TIMESTAMP   NOT NULL DEFAULT SYSDATE(),
  major_id     INT,

  PRIMARY KEY (id),
  FOREIGN KEY (major_id) REFERENCES Majors(id)
);
