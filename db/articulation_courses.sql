-- ArticulationCourses table

CREATE TABLE ArticulationCourses(
  id              INT,
  time_created    TIMESTAMP NOT NULL,
  last_updated    TIMESTAMP NOT NULL,
  articulation_id INT,
  course_id       INT,

  PRIMARY KEY (id),
  FOREIGN KEY (articulation_id) REFERENCES Articulations(id),
  FOREIGN KEY (course_id)       REFERENCES Courses(id)
);
