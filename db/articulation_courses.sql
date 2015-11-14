-- ArticulationCourses table

CREATE TABLE ArticulationCourses(
  id              INT         NOT NULL AUTO_INCREMENT,
  time_created    TIMESTAMP   NOT NULL DEFAULT SYSDATE(),
  last_updated    TIMESTAMP   NOT NULL DEFAULT SYSDATE(),
  articulation_id INT,
  course_id       INT,

  PRIMARY KEY (id),
  FOREIGN KEY (articulation_id) REFERENCES Articulations(id),
  FOREIGN KEY (course_id)       REFERENCES Courses(id)
);
