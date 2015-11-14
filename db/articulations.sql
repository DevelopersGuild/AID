-- Articulations table

CREATE TABLE Articulations(
  id           INT,
  time_created TIMESTAMP NOT NULL,
  last_updated TIMESTAMP NOT NULL,
  major_id     INT,

  PRIMARY KEY (id),
  FOREIGN KEY (major_id) REFERENCES Majors(id)
);
