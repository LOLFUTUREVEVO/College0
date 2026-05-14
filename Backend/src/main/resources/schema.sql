CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    embedding TEXT NOT NULL,
    source TEXT
);

CREATE TABLE IF NOT EXISTS course (
    course_id       INTEGER PRIMARY KEY AUTOINCREMENT,
    course_num      INTEGER NOT NULL,
    title           TEXT NOT NULL,
    capacity        INTEGER NOT NULL,
    room_number     TEXT NOT NULL,
    days_of_week    TEXT,
    start_time      TEXT,
    duration_minutes INTEGER,
    semester        TEXT,
    instructor_id   INTEGER,
    FOREIGN KEY (instructor_id) REFERENCES user_account(user_id)
);

CREATE TABLE IF NOT EXISTS enrollment (
    enrollment_id       INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id           INTEGER NOT NULL,
    student_id          INTEGER NOT NULL,
    status              TEXT NOT NULL CHECK(status IN ('ENROLLED', 'WAITLISTED', 'DROPPED')),
    waitlist_position   INTEGER,
    FOREIGN KEY (course_id) REFERENCES course(course_id),
    FOREIGN KEY (student_id) REFERENCES user_account(user_id)
);