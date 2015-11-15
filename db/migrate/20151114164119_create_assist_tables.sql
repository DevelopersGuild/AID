-- Schools table

CREATE TABLE Schools(
  id           INT         NOT NULL AUTO_INCREMENT,
  time_created TIMESTAMP   NOT NULL DEFAULT NOW(),
  last_updated TIMESTAMP   NOT NULL DEFAULT '0000-00-00 00:00:00',
  assist_code  VARCHAR(10) NOT NULL,
  full_name    VARCHAR(100),

  PRIMARY KEY (id)
) ENGINE=InnoDB;

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

-- Courses table

CREATE TABLE Courses(
  id           INT         NOT NULL AUTO_INCREMENT,
  time_created TIMESTAMP   NOT NULL DEFAULT NOW(),
  last_updated TIMESTAMP   NOT NULL DEFAULT '0000-00-00 00:00:00',
  assist_code  VARCHAR(20) NOT NULL,
  full_name    VARCHAR(100),
  units        INT,

  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- Articulations table

CREATE TABLE Articulations(
  id           INT         NOT NULL AUTO_INCREMENT,
  time_created TIMESTAMP   NOT NULL DEFAULT NOW(),
  last_updated TIMESTAMP   NOT NULL DEFAULT '0000-00-00 00:00:00',
  major_id     INT,

  PRIMARY KEY (id),
  FOREIGN KEY (major_id) REFERENCES Majors(id)
) ENGINE=InnoDB;

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
