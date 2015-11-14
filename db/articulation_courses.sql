-- ArticulationCourses table

CREATE TABLE ArticulationCourses(
  id              INT         NOT NULL AUTO_INCREMENT,
  time_created    TIMESTAMP   NOT NULL DEFAULT NOW(),
  last_updated    TIMESTAMP   NOT NULL DEFAULT '0000-00-00 00:00:00',
  articulation_id INT,
  course_id       INT,

  PRIMARY KEY (id),
  FOREIGN KEY (articulation_id) REFERENCES Articulations(id),
  FOREIGN KEY (course_id)       REFERENCES Courses(id)
) ENGINE=InnoDB;
