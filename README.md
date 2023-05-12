<h1> High-School-App </h1>

<h2> Contents </h2>

<a href="https://github.com/Gherasim-Andrei-Albert/High-School-App#-high-school-">
  High-School-App
</a>
<ul>
  <li>
    <a href="https://github.com/Gherasim-Andrei-Albert/High-School-App#-contents-">
      Contents
    </a>
  </li>
  <li>
    <a href="https://github.com/Gherasim-Andrei-Albert/High-School-App#-project-architecture-">
      Project architecture
    </a>
  </li>
  <li>
    <a href="https://github.com/Gherasim-Andrei-Albert/High-School-App#-technologies-">
      Technologies
    </a>
  </li>
  <li>
    <a href="https://github.com/Gherasim-Andrei-Albert/High-School-App#-database-">
      Database
    </a>
    <ul>
      <li>
        <a href="https://github.com/Gherasim-Andrei-Albert/High-School-App#-database-erd-diagram-">
          Database ERD Diagram
        </a>
      </li>
      <li>
        <a href="https://github.com/Gherasim-Andrei-Albert/High-School-App#-database-schema-">
          Database Schema
        </a>
      </li>
      <li>
        <a href="https://github.com/Gherasim-Andrei-Albert/High-School-App#-sample-data-">
          Sample Data
        </a>
        <ul>
          <li>
            <a href="https://github.com/Gherasim-Andrei-Albert/High-School-App#-sample-data-">
              Sample Data Generation
            </a>
          </li>
          <li>
            <a href="https://github.com/Gherasim-Andrei-Albert/High-School-App#-database-population-seeders-">
              Database Population Seeders
            </a>
          </li>
        </ul>
      </li>
    </ul>
  </li>
  <li>
    <a href="https://github.com/Gherasim-Andrei-Albert/High-School-App#-api-">
      API
    </a>
    <ul>
      <li>
        <a href="https://github.com/Gherasim-Andrei-Albert/High-School-App#models">
          Models
        </a>
      </li>
      <li>
        <a href="https://github.com/Gherasim-Andrei-Albert/High-School-App#routes">
          Routes
        </a>
      </li>
      <li>
        <a href="https://github.com/Gherasim-Andrei-Albert/High-School-App#midlewares">
          Midlewares
        </a>
      </li>
    </ul>
  </li>
  <li>
    <a href="https://github.com/Gherasim-Andrei-Albert/High-School-App#-app-">
      App
    </a>
  </li>
  <li>
    <a href="https://github.com/Gherasim-Andrei-Albert/High-School-App#-deploy-">
      Deploy
    </a>
  </li>
</ul>

<h2> Project architecture </h2>

The project consists of 3 components: a Database, an API and a Frontend App.

<h2> Technologies </h2>

For ease of development both frontend and backend use typescript. <br/>

<br/>

On the backend express is used for the server framework. <br/>
Sequelize is used for models, database access, database schema definition and database sample data population. <br/>

<br/>

On the frontend react is used along side react-bootstrap, formik for forms management and luxon for time zones and locales. <br/>

<h2> Database </h2>

<h3> Database ERD Diagram </h3>

<br/>

<img src="https://github.com/Gherasim-Andrei-Albert/High-School-App/assets/17341493/2302b2e2-dc9f-4edd-a49a-8a39806b4456" width="100%" height="auto"/> <br/>

<br/>

The main actors in the diagram are <em><strong>Teacher</strong></em>, <em><strong>Student</strong></em> and <em><strong>Subjects</strong></em>. <br/>

<br/>

Betwen <em><strong>Subjects</strong></em> and <em><strong>Teachers</strong></em> an <em><strong>Assignment</strong></em> table exists to solve many to many relationship. <br/>

<br/>

To each Group we asociate multiples <em><strong>Students</strong></em> and also add one <em><strong>Classroom</strong></em>. <br/>

<br/>

One key table for the app is <em><strong>Lesson</strong></em>. This table represents one slot in a timetable. <br/>
One <em><strong>Lesson</strong></em> is defined by a <em><strong>Group</strong></em> that participates at that <em><strong>Lesson</strong></em>, a <em><strong>Subject</strong></em> that has to be studied and a <em><strong>Teacher</strong></em> to teach that lesson. <br/><br/>
Between <em><strong>Lessons</strong></em> and <em><strong>Students</strong></em> we can create <em><strong>Marks</strong></em> and <em><strong>Absences</strong></em> associations. <br/>

<br/>

On key point to note is that the <em><strong>User</strong></em> credentials are separate on their own table. <br/>
This choise was made for ease of <em><strong>Users</strong></em> access. <br/>
This way instead of checking credentials on multiple tables we only read the <em><strong>User</strong></em> table. <br/><br/>

<h3> Database Schema </h3>

To generate database schema the project uses migrations instead of raw sql. <br/>
Most complicated example is the create-lesson migration. <br/>

<br/>

```js
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Lessons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      subjectId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      teacherId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      groupId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      classroomId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      academicYear: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      weekday: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      startTime: {
        allowNull: false,
        type: Sequelize.TIME,
      },
      endTime: {
        allowNull: false,
        type: Sequelize.TIME,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addConstraint('Lessons', {
      fields: ['subjectId'],
      type: 'FOREIGN KEY',
      name: 'FK_Lessons_Subjects',
      references: {
        table: 'Subjects',
        field: 'id',
      },
    });
    await queryInterface.addConstraint('Lessons', {
      fields: ['teacherId'],
      type: 'FOREIGN KEY',
      name: 'FK_Lessons_Teachers',
      references: {
        table: 'Teachers',
        field: 'id',
      },
    });
    await queryInterface.addConstraint('Lessons', {
      fields: ['groupId'],
      type: 'FOREIGN KEY',
      name: 'FK_Lessons_Groups',
      references: {
        table: 'Groups',
        field: 'id',
      },
    });
    await queryInterface.addConstraint('Lessons', {
      fields: ['classroomId'],
      type: 'FOREIGN KEY',
      name: 'FK_Lessons_Classrooms',
      references: {
        table: 'Classrooms',
        field: 'id',
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Lessons');
  },
};

```

<br/>

At the beggining the script creates a table based on objects fields names having sql restrictions as values. <br/>
At the bottom of the code, the script will add sql foreign key constraints, 4 in this case. <br/>

<h3> Sample Data </h3>

For ease of testing the project comes with a script for data generation and seeders migrations scripts.

<h4> Sample Data Generation </h4>

To generate sample data, the script fetches data from a random generator webpage. <br/>
The result is then parsed using jsdom and query selectors. <br/>

<br/>

```js
let fetchRandomPersonData = async () => {
  let response;
  const url = `https://www.random-name-generator.com/romania?s=${++nrOfRandomPersonsGenerated}&search_terms=&gender=&search_terms=&n=1`;
  do {
    response = await fetch(url, { timeout: Infinity });
  } while (response.status !== 200);

  const textResponse = await response.text();
  let randomFullNameDom = new JSDOM(textResponse);

  const fullName = randomFullNameDom.window.document
    .querySelector(
      '.col-sm-12.mb-3 > div > div > dl:nth-child(3) > dd.h4.col-12'
    )
    .childNodes[0].nodeValue.trim();
  const [firstName, lastName] = fullName.split(' ');
  const phone = randomFullNameDom.window.document
    .querySelector(
      '.col-sm-12.mb-3 > div > div > dl:nth-child(3) > dd:nth-child(5)'
    )
    .childNodes[0].nodeValue.trim();
  const email = randomFullNameDom.window.document
    .querySelector(
      '.col-sm-12.mb-3 > div > div > dl:nth-child(6) > dd:nth-child(2)'
    )
    .childNodes[0].nodeValue.trim();
  const address = randomFullNameDom.window.document
    .querySelector(
      '.col-sm-12.mb-3 > div > div > dl:nth-child(3) > dd:nth-child(3)'
    )
    .childNodes[0].nodeValue.trim();

  console.count('persons generated');

  return { firstName, lastName, phone, email, address };
};
```

<br/>

The script will then read a file consisting of a list of predefined subjects. </br>
For each subject a number of 4 teacher should be assigned. </br>
For an improved simulation there will be one theacher that can teach multiple subjects. </br>
Therefore the number of theachers needed is given by the formula nrOfSubjects * nrOfTeachersPerSubject substracting a number of theachers equal to the number of extra subjects teached by the multispecialised teacher. </br>

<br/>

```js
(async () => {
  let subjects = require('../sampleData/subjects.json');

  const nrOfSubjects = subjects.length;
  const nrOfTeachersPerSubject = 4;
  const nrOfSubjectsOfmultiSpecializedTeacher = 3;
  const nrOfMultiSpecialisedTeachers = 1;
  const nrOfTeachers =
    nrOfSubjects * nrOfTeachersPerSubject -
    nrOfSubjectsOfmultiSpecializedTeacher +
    nrOfMultiSpecialisedTeachers;
  let teachers = await Promise.all(
    [...Array(nrOfTeachers)].map(() => fetchRandomPersonData())
  );

  console.log('teachers generated');

  fs.writeFile('../sampleData/teachers.json', JSON.stringify(teachers)).then(
    () => console.log('teachers saved')
  );

  // code removed for simplicity
  
})();
```

<br/>

<h4> Database Population Seeders </h4>

To populate the database multiple seeders were created. <br/>
Two examples are the Users and the lessons seders. <br/>

<br/>

The Users seeder reads the persons generated JSON file. <br/>
Before adding the users to the database the passwords are encrypted. <br/>

<br/>

```js
'use strict';
const bcrypt = require('bcrypt');
const sampleDataConfig = require('../config/sampleDataConfig.json');
let teachersSampleJSON = require('../sampleData/teachers.json');
let parentsSampleJSON = require('../sampleData/parents.json');
let studentsSampleJSON = require('../sampleData/students.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const adminUser = {
      email: sampleDataConfig.admin.email,
      hashedPassword: await bcrypt.hash(sampleDataConfig.admin.password, 10),
      isAdmin: true,
    };

    let users = [
      adminUser,
      ...(await Promise.all([
        ...teachersSampleJSON.map(async ({ email }) => ({
          email,
          hashedPassword: await bcrypt.hash(
            sampleDataConfig.teacherPassword,
            10
          ),
        })),
        ...parentsSampleJSON.map(async ({ email }) => ({
          email,
          hashedPassword: await bcrypt.hash(
            sampleDataConfig.parentPassword,
            10
          ),
        })),
        ...studentsSampleJSON.map(async ({ email }) => ({
          email,
          hashedPassword: await bcrypt.hash(
            sampleDataConfig.studentPassword,
            10
          ),
        })),
      ])),
    ];

    const currentDate = new Date();
    await queryInterface.bulkInsert(
      'Users',
      users.map((user) => ({
        ...user,
        createdAt: currentDate,
        updatedAt: currentDate,
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
```

<br/>

To populate teachers, students and parents the migrations will read all users from database. <br/>
For each entity a account will be generated but taking into account that the order of users defines witch type of entity should be assigned. <br/>

<br/>

```js
'use strict';
let sampleTeachersJSON = require('../sampleData/teachers.json');
let sampleParentsJSON = require('../sampleData/parents.json');
let sampleStudentsJSON = require('../sampleData/students.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users', {
      type: Sequelize.QueryTypes.SELECT,
    });

    const admin = users.shift();
    const teachers = sampleTeachersJSON.map(({ email, ...personDetails }) => ({
      ...personDetails,
      accountId: users.shift().id,
    }));
    const parentsAccounts = sampleParentsJSON.map(() => users.shift());
    const studentsAccounts = sampleStudentsJSON.map(() => users.shift());

    const currentDate = new Date();
    await queryInterface.bulkInsert(
      'Teachers',
      teachers.map((teacher) => ({
        ...teacher,
        createdAt: currentDate,
        updatedAt: currentDate,
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Teachers', null, {});
  },
};
```

<br/>

The most complicated migration and also most complicated script is the seeder that generates timetables for all groups, teachers and subjects. <br/>
At the beggining the script will fetch database resources. <br/>

<br/>

```js
const teacherSubjectAssignments = await queryInterface.sequelize.query(
      'SELECT subjectId, teacherId FROM TeacherSubjectAssignments',
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const groups = await queryInterface.sequelize.query(
      'SELECT id FROM `Groups`',
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const groupsDetails = await queryInterface.sequelize.query(
      'SELECT id, name, grade FROM `Groups`',
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const detailedSubjects = await queryInterface.sequelize.query(
      'SELECT id, name FROM Subjects',
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const classrooms = await queryInterface.sequelize.query(
      'SELECT id FROM Classrooms',
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );
```

<br/>

A structure of subjects having teachers is constructed. <br/>

<br/>

```js
let subjectsWithTeachers = teacherSubjectAssignments.map(
      ({ subjectId }) => ({
        subjectId,
        teachers: teacherSubjectAssignments
          .filter(
            ({ subjectId: subjectIdToSearchFor }) =>
              subjectIdToSearchFor === subjectId
          )
          .map(({ teacherId: id }) => ({ id })),
      })
    );
    subjectsWithTeachers = subjectsWithTeachers.filter(
      (subjectWithTeachers, index) =>
        subjectsWithTeachers.findIndex(
          (comparedSubjectWithTeachers) =>
            subjectWithTeachers.subjectId ===
            comparedSubjectWithTeachers.subjectId
        ) === index
    );
```

<br/>

In that stucture for each teacher 4 groups will be assigned. <br/>

<br/>

```js
let subjectsWithTeachersWithGroups = subjectsWithTeachers.map(
      ({ subjectId, teachers }) => ({
        subjectId,
        teachersWithGroups: teachers.map((teacher, teacherIndex) => ({
          teacherId: teacher.id,
          groups: groups.slice(teacherIndex * 4, teacherIndex * 4 + 4),
        })),
      })
    );
```

<br/>

After that the structure will be reverse so that it will consist of teachers haveing the group-subject assignments. <br/>

<br/>

```js
const groupsPerSubjectTeacherAssignment = 4;
    let subjectTeacherWithGroupsAsignments = subjectsWithTeachersWithGroups
      .map(({ subjectId, teachersWithGroups }) =>
        [...Array(groupsPerSubjectTeacherAssignment).keys()].map(
          (assignmentIndex) => ({
            subjectId,
            teacherId: teachersWithGroups[assignmentIndex].teacherId,
            groups: teachersWithGroups[assignmentIndex].groups,
          })
        )
      )
      .flat();

    let teachersWithGroupSubjectAssignments =
      subjectTeacherWithGroupsAsignments.map(
        ({ subjectId, teacherId, groups }) => ({
          teacherId,
          groups: groups.map((group) => ({ groupId: group.id, subjectId })),
        })
      );
```

<br/>

The multispecialised teacher appears in the structure by a number of the specializations. <br/>
Therfore for ease of access all the apparitions of this teacher will be concatenated into one. <br/>

<br/>

```js
const multispecialisedTeacherId = (
      await queryInterface.sequelize.query(
        `
        SELECT teacherId
        FROM (
          SELECT teacherId, count(*) as count
            FROM TeacherSubjectAssignments
            GROUP BY teacherId
        ) AS TeachersOccurences
        WHERE count != 1
      `,
        {
          type: Sequelize.QueryTypes.SELECT,
        }
      )
    )[0].teacherId;

    // find the multispecialised teacher occurences in array
    // and concatenate their assignments

    const multispecialisedTeachersWithGroupSubjectAssignments = {
      teacherId: multispecialisedTeacherId,
      groups: [
        ...teachersWithGroupSubjectAssignments
          .filter(
            (teacherWithGroupSubjectAssignments) =>
              teacherWithGroupSubjectAssignments.teacherId ===
              multispecialisedTeacherId
          )
          .map(({ teacherId, groups }) => groups)
          .flat(),
      ],
    };

    teachersWithGroupSubjectAssignments =
      teachersWithGroupSubjectAssignments.filter(
        ({ teacherId }) => teacherId !== multispecialisedTeacherId
      );
    teachersWithGroupSubjectAssignments.push(
      multispecialisedTeachersWithGroupSubjectAssignments
    );
```

<br/>

For the generation of the timetable the structure will be augumented so that the number of assignments will be multiplied by the number a of lessons a subject should have for each group of students. <br/>

<br/>

```js
teachersWithGroupSubjectAssignments =
      teachersWithGroupSubjectAssignments.map(({ teacherId, groups }) => ({
        teacherId,
        groups: groups
          .map(({ groupId, subjectId }) =>
            [
              ...Array(
                subjectsWithLenssonsNr.find(
                  (subject) =>
                    subject.name ===
                    detailedSubjects.find(
                      (detailedSubjects) => detailedSubjects.id === subjectId
                    ).name
                ).lessonsPerWeek
              ).keys(),
            ].map((key, lenssonsNrIndex) => ({
              groupId,
              subjectId,
              times: lenssonsNrIndex,
            }))
          )
          .flat(),
      }));
```

<br/>

The concrete code that creates the timetable traverses all the 16 group timetables at the same time. <br/>
The timetables are filed line by line, meaning hour by hour instead of day by day. <br/>
For each group timetable a different teacher is poped, this ensure that a teacher wont have to be present at two groups at the same time. <br/>

<br/>

```js
const nrOfGroups = 16;
    const nrOfDays = 5;

    let timetables = [...Array(nrOfGroups).keys()].map((timetable) =>
      [...Array(nrOfDays).keys()].map((dayIndex) => [])
    );

    // foreach day add a poped teacherWithGroupSubjectAssignment,
    // if it remains empty of assignments remove the teacher from array

    while (teachersWithGroupSubjectAssignments.length !== 0) {
      [...Array(nrOfDays).keys()].forEach((dayIndex) => {
        let teachersWithGroupSubjectAssignmentsCopy = [
          ...teachersWithGroupSubjectAssignments,
        ];
        timetables.forEach((timetable, timetableIndex) => {
          const timetableGroupId = groupsDetails.find((groupDetails) => {
            const groupNameIndex = ['A', 'B', 'C', 'D'].findIndex(
              (name) => name === groupDetails.name
            );
            return (
              (groupDetails.grade - 9) * 4 + groupNameIndex === timetableIndex
            );
          }).id;

          const pickedTeacher = teachersWithGroupSubjectAssignmentsCopy.find(
            ({ teacherId, groups }) =>
              groups.find((group) => group.groupId === timetableGroupId)
          );

          if (!pickedTeacher) {
            return;
            // console.log('no teacher found for the group timeslot');
            // require('fs/promises').writeFile(
            //   'out.json',
            //   JSON.stringify(teachersWithGroupSubjectAssignmentsCopy)
            // );
          }

          teachersWithGroupSubjectAssignmentsCopy =
            teachersWithGroupSubjectAssignmentsCopy.filter(
              (teacher) => teacher.teacherId !== pickedTeacher.teacherId
            );

          const pickedSubjectGroupAssignment = pickedTeacher.groups.find(
            (group) => group.groupId === timetableGroupId
          );

          // console.log(pickedTeacher.groups);

          pickedTeacher.groups = pickedTeacher.groups.filter(
            (group) =>
              !(
                group.groupId === timetableGroupId &&
                group.times === pickedSubjectGroupAssignment.times &&
                group.subjectId === pickedSubjectGroupAssignment.subjectId
              )
          );
          teachersWithGroupSubjectAssignments =
            teachersWithGroupSubjectAssignments.filter(
              (teachersWithGroupSubjectAssignment) =>
                teachersWithGroupSubjectAssignment.groups.length !== 0
            );
          timetable[dayIndex].push({
            teacherId: pickedTeacher.teacherId,
            subjectId: pickedSubjectGroupAssignment.subjectId,
            groupId: pickedSubjectGroupAssignment.groupId,
          });
        });
      });
    }

    timetables = timetables.map((timetable) => {
      const classroomId = classrooms.find(
        (classroom) => classroom.id === timetable[0][0].groupId
      ).id;
      return timetable.map((daySchedule, dayIndex) =>
        daySchedule.map((lesson, lessonIndex) => {
          const startTime = DateTime.fromObject(
            { hour: 8 + lessonIndex, minute: 0 },
            { zone: 'Europe/Bucharest' }
          ).toJSDate();
          const endTime = DateTime.fromJSDate(startTime)
            .plus({ hours: 1 })
            .toJSDate();

          return {
            ...lesson,
            classroomId,
            academicYear: 2023,
            weekday: dayIndex + 1,
            startTime,
            endTime,
          };
        })
      );
    });
```

<br/>

At the end all the timetables slots are extracted into a single list and added to the databasse. <br/>

<br/>

```js
const lessons = timetables.flat().flat();

    const currentDate = new Date();
    await queryInterface.bulkInsert(
      'Lessons',
      lessons.map((lesson) => ({
        ...lesson,
        createdAt: currentDate,
        updatedAt: currentDate,
      }))
    );
```

<br/>

<h2> API </h2>

<h3>Models</h3>

The models are ORMs neatly structured that respect the database schema. <br/>
Each model defines at the bottom of the script its foreign keys and associations using decorators on properties. <br/>
An example of model is the Lesson model. <br/>

<br/>

```js
import { Table, Column, Model, ForeignKey, HasMany, BelongsTo } from 'sequelize-typescript';
import { Subject } from './subject';
import { Teacher } from './teacher';
import { Group } from './group';
import { Classroom } from './classroom';
import { DataTypes } from 'sequelize';
import { Mark } from './mark';
import { Absence } from './absence';

@Table
export class Lesson extends Model {
  @ForeignKey(() => Subject)
  @Column({
    allowNull: false,
  })
  subjectId: number;

  @ForeignKey(() => Teacher)
  @Column({
    allowNull: false,
  })
  teacherId: number;

  @ForeignKey(() => Group)
  @Column({
    allowNull: false,
  })
  groupId: number;

  @ForeignKey(() => Classroom)
  @Column({
    allowNull: false,
  })
  classroomId: number;

  @Column({
    allowNull: false,
  })
  academicYear: number;

  @Column({
    allowNull: false,
  })
  weekday: number;

  @Column({
    allowNull: false,
    type: DataTypes.TIME,
  })
  startTime: Date;

  @Column({
    allowNull: false,
    type: DataTypes.TIME,
  })
  endTime: Date;

  @HasMany(() => Mark)
  marks: Mark[];

  @HasMany(() => Absence)
  absences: Mark[];

  @BelongsTo(() => Subject)
  subject: Subject;

  @BelongsTo(() => Teacher)
  teacher: Teacher;

  @BelongsTo(() => Group)
  group: Group;

  @BelongsTo(() => Classroom)
  classRoom: Classroom;
}
```

<br/>

<h3>Routes</h3>

The api has routes for: users, tokens, groups, absences, marks. <br/>

<br/>

The users route puts at disposal a get route, used to retrieve data about authenticated user and a post route used for user registration. <br/>

<br/>

```js
declare module "express-serve-static-core" {
  interface Request {
    user: {_id: string};
  }
}

router.get('/', passport.authenticate('jwt', { session: false }),
  async (req, res, next) => { 
    try {
      const user = await User.findOne({
        where: {
          id: req.user._id
        },
        include:[Student, Teacher]
      });
      if (!user) return res.status(500);
      return res.json({ user});
    } catch (err) {
      return next(err)
    }
  }
);

router.post('/', async (req, res, next) => {
  passport.authenticate('signup', { session: false },
    async (err: any, user: User, info: any) => { 
      try {
        if (err) {
          return res.status(500).json({msg: 'An error occurred.'});
        }

        const {
          type: accountType,
          firstName,
          lastName,
          phone,
          address,
          grade,
          enrolmentYear,
        } = req.body;

        switch (accountType) {
          case 'teacher':
            user.teacherDetails = await Teacher.create({
              accountId: user.id,
              firstName,
              lastName,
              phone,
              address,
            });
            break;
          case 'student':
            const group = await Group.findOne({
              where: {
                name: req.body.groupName,
                grade: req.body.grade,
              }
            });
            
            if (!group) {
              return res.status(400).json({msg: 'Payload not valid.'})
            }

            user.studentDetails = await Student.create({
              accountId: user.id,
              groupId: group.id,
              grade,
              enrolmentYear,
              firstName,
              lastName,
              phone,
              address,
            });
            break;
          
          default:
            return res.status(400).json({msg: 'Payload not valid.'})
        }

        return res.json({message: 'Signup successful'});
      }
      catch (err) {
        if(err instanceof ValidationError) {
          return res.status(400).json({msg: 'Payload not valid.'});
        }

        return res.status(500).json({msg: 'An error occurred.'})
      }
    }
  )(req, res, next);
});
```

<br/>

The tokens post route is meant for login giving as result a JWT token. <br/>

<br/>

```js
router.post('/', async (req, res, next) => {
  passport.authenticate('login', async (err: any, user: User, info: any) => {
    try {
      if (err) {
        return res.status(500).json({msg: 'An error occurred.'});
      }

      if (!user) {
        return res.status(403).json({ msg: 'Wrong email or password' });
      }

      req.login(user, { session: false }, async (error) => {
        if (error) {
          return res.status(500).json({msg: 'An error occurred.'});
        }

        if (!process.env.TOKEN_SECRET) {
          return res.status(500).json({msg: 'An error occurred.'});
        }

        const body = { _id: user.id, email: user.email };
        const token = jwt.sign({ user: body }, process.env.TOKEN_SECRET);

        return res.json({ token });
      });
    } catch (error) {
      return res.status(500).json({msg: 'An error occurred.'});
    }
  })(req, res, next);
});
```

<br/>

The marks and absences routes have the same structure. <br/>
Both are protected by authentication. <br/>
On the post route it is verified that the user is a teacher to ensure that only teachers can add marks and absences. <br/>

<br/>

```js
declare module "express-serve-static-core" {
  interface Request {
    user: {_id: string};
  }
}

router.get('/', async function (req, res, next) {
  try {
    const user = await User.findOne({
      where: {
        id: req.user._id
      },
      include:[Student, Teacher]
    });
    if (user?.studentDetails) {
      let marks = await user?.studentDetails.$get('marks');
      let marksResponse = await Promise.all(
        marks.map(async mark => {
          const lesson = await mark.$get('lesson');
          const subject = await lesson?.$get('subject');
          const teacher = await lesson?.$get('teacher');
          return {markDetails: mark, lesson, subject, teacher};
        })
      );
      return res.json({ marks: marksResponse });
    }
    if (user?.teacherDetails) {
      const lessons = await user?.teacherDetails.$get('lessons');
      const marks = (await Promise.all(
        lessons.map(async lesson => await lesson.$get('marks'))
      )).flat();
      return res.json({ marks });
    }
    return res.status(403).json({msg: 'User is not a teacher or student.'})
  } catch (err) {
    return next(err)
  }
});

router.post('/', async function (req, res, next) {
  try {
    const { studentId, lessonId, value } = req.body;
    const user = await User.findOne({
      where: {
        id: req.user._id
      },
      include:[Teacher]
    });
    if (!user?.teacherDetails) {
      return res.status(403).json({msg:'User is not a teacher.'})
    }
    await Mark.create({ studentId, lessonId, value });
    return res.json({ msg: 'Mark added successfuly' });
  } catch (err) {
    return next(err)
  }
});

export default router;
```

<br/>

<h3>Midlewares</h3>

For authentication a midleware is create being comprised by passport strategies. <br/>
Two are local strategies used for signup and login. <br/>
The other one is the JWT strategy used to protect routes with JWT tokens. <br/>

<br/>

```js
import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as localStrategy } from 'passport-local';
import { Strategy as JWTstrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../../models/user';

passport.use(
  'signup',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({email, hashedPassword });

        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email:any, password:any, done:any) => {
      try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
          return done(null, false, { message: 'Wrong email or password' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.hashedPassword);

        if (!isPasswordCorrect) {
          return done(null, false, { message: 'Wrong email or password' });
        }

        return done(null, user, { message: 'Logged in Successfully' });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.TOKEN_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);
export default passport;
```

<br/>

<h2> App </h2>

The app consists of 4 screens one for login, one for registration, one for teachers and one for students. <br/>
The student and teacher screen are both accesed from the main route depending on the type of user. <br/>

<br/>

The singup screen consists of a modal used for request error feedback and a formik form using react-bootstrap fields. <br/>
If the student type is selected from dropdown, student specific fields are added to the form.  <br/>

<br/>

```js
function SignUpScreen() {
  const [validated, setValidated] = useState(false);
  const [signupError, setSignupError] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <Modal show={signupError} onHide={() => setSignupError(false)}>
        <Modal.Body>
          <Alert variant="danger" onClose={() => setSignupError(false)} dismissible>
            <Alert.Heading>Error! Coudn't register account.</Alert.Heading>
          </Alert>
        </Modal.Body>
      </Modal>
      <Container>
        <Row>
          <Col>
            <Formik
              initialValues={{
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                type: 'teacher',
                grade: 9,
                groupName: 'A',
                enrolmentYear: new Date().getFullYear()
              }}
              validate={values => {
                const errors = {};
                // if (!values.email) {
                //   errors.email = 'Required';
                // } else if (
                //   !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                // ) {
                //   errors.email = 'Invalid email address';
                // }
                return errors;
              }}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  setSubmitting(false);
                  const result =
                    await axiosClient.post('/users', values);
                  if (result.status === 200) {
                    navigate('/login');
                  }
                  else {
                    setSignupError(true);
                  }
                }
                catch (err) {
                  setSignupError(true);
                }
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                /* and other goodies */
              }) => (
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group as={Col} md="4" controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      onChange={handleChange}
                      value={values.email}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      onChange={handleChange}
                      value={values.password} />
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="firstName">
                    <Form.Label>First name</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="First name"
                      onChange={handleChange}
                      value={values.firstName}
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="lastName">
                    <Form.Label>Last name</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Last name"
                      onChange={handleChange}
                      value={values.lastName}
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="accountType">
                    <Form.Label>Account type</Form.Label>
                    <Form.Select name="type" aria-label="Account type"
                      onChange={handleChange}
                      value={values.type}
                    >
                      <option value="teacher">teacher</option>
                      <option value="student">student</option>
                    </Form.Select>
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                  {
                    values.type === 'student' && (
                      <>
                        <Form.Group as={Col} md="4" controlId="grade">
                          <Form.Label>Grade</Form.Label>
                          <Form.Select name="grade" aria-label="Grade"
                            onChange={handleChange}
                            value={values.grade}
                          >
                            {Array.from(Array(4).keys()).map(gradeIndex =>
                              <option value={9 + gradeIndex}>{9 + gradeIndex}</option>)
                            }
                          </Form.Select>
                          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="4" controlId="groupName">
                          <Form.Label>Group</Form.Label>
                          <Form.Select name="groupName" aria-label="Group name"
                            onChange={handleChange}
                            value={values.groupName}
                          >
                            {Array.from(Array(4).keys()).map(gradeIndex =>
                              <option value={['A', 'B', 'C', 'D'][gradeIndex]}>
                                {['A', 'B', 'C', 'D'][gradeIndex]}
                              </option>
                            )}
                          </Form.Select>
                          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="4" controlId="enrolmentYear">
                          <Form.Label>Enrolment year</Form.Label>
                          <Form.Control type="number"
                            onChange={handleChange}
                            value={values.enrolmentYear}
                          />
                          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>
                      </>
                    )
                  }
                  <Button type="submit">Register</Button>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>Already have an account? <Link to="/login">Log in</Link></p>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default SignUpScreen;
```

<br/>

The main screen checks if the user is a teacher or a student and displays the coresponding screen acordingly. <br/>

<br/>

```js
function MainScreen() {
  const [validated, setValidated] = useState(false);
  const [userFetchError, setUserFetchError] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] =
    useState<{
      studentDetails: ({} | null),
      teacherDetails: ({ id: number } | null)
    } | null>(null);

  useEffect(() => {
    (async () => {
      if (!localStorage.getItem('token')?.length) {
        navigate('/login');
        return;
      }

      try {
        const response =
          await axiosClient('/users');

        if (response.status === 200) {
          setUser(response.data.user);
        }
        else {
          setUserFetchError(true);
        }
      } catch (err) {
        setUserFetchError(true);
      }
    })();
  }, []);

  return (
    <>
      <Modal show={userFetchError} onHide={() => { }}>
        <Modal.Body>
          <Alert variant="danger" onClose={() => { }} dismissible={false}>
            <Alert.Heading>Server or internet error!</Alert.Heading>
            <p>
              Check your internet connection and refresh the page.
            </p>
          </Alert>
        </Modal.Body>
      </Modal>
      {
        (user !== null) && (
          <>
            <Navbar />
            {
              user.teacherDetails ?
                <TeacherScreen user={user} />
                : <StudentScreen />
            }
          </>
        )
      }
    </>
  );
}

export default MainScreen;
```

<br/>

The teacher has a form with fields that are disabled until a group is selected. <br/>
For the group select a spiner is added to signal the fetching of groups data. <br/>
On group change, all fields are reseted and disabledd to ensure wrong, unintended data is not sent to the server. <br/>

<br/>

```js
function OnGroupChangeFieldsReseter() {
  const { values, setFieldValue } = useFormikContext<{ groupId: number }>();
  useEffect(() => {
    setFieldValue('studentId', -1);
    setFieldValue('value', -1);
    setFieldValue('lessonId', -1);
  }, [values.groupId]);
  return <></>;
}

function TeacherScreen(props: {
  user: { teacherDetails: { id: number } | null }
}) {
  const [validated, setValidated] = useState(false);
  const [groupsFetchError, setGroupsFetchError] = useState(false);
  const [absenceAddedSuccess, setAbsenceAddedSuccess] = useState(false);
  const [absenceAddedError, setAbsenceAddedError] = useState(false);
  const [markAddedSuccess, setMarkAddedSuccess] = useState(false);
  const [markAddedError, setMarkAddedError] = useState(false);
  const [groups, setGroups] = useState<{
    id: number,
    grade: number,
    name: string,
    students: {
      id: number,
      firstName: string,
      lastName: string
    }[],
    lessons: {
      id: number,
      teacherId: number,
      weekday: number,
      startTime: string
    }[]
  }[]>([]);
  // const [lessons, setLessons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (!localStorage.getItem('token')?.length) {
        navigate('/login');
      }
      try {
        const groupsResponse = await axiosClient.get('/groups');
        if (groupsResponse.status === 200) {
          const { groups } = groupsResponse.data;
          setGroups(groups);
        }
        else {
          setGroupsFetchError(true)
        }
      }
      catch (err) {
        setGroupsFetchError(true)
      }
    })();
  }, []);

  let submitAction: string | undefined = undefined;

  return (
    <>
      <Modal show={groupsFetchError} onHide={() => { }}>
        <Modal.Body>
          <Alert variant="danger" onClose={() => { }} dismissible={false}>
            <Alert.Heading>Error! Coudn't download data for forms.</Alert.Heading>
            <p>
              Server or internet error.
              Check your internet connection and refresh the page.
            </p>
          </Alert>
        </Modal.Body>
      </Modal>
      <Modal show={absenceAddedError} onHide={() => setAbsenceAddedError(false)}>
        <Modal.Body>
          <Alert variant="danger" onClose={() => setAbsenceAddedError(false)} dismissible>
            <Alert.Heading>Error! Absence coudn't be added.</Alert.Heading>
          </Alert>
        </Modal.Body>
      </Modal>
      <Modal show={absenceAddedSuccess} onHide={() => setAbsenceAddedSuccess(false)}>
        <Modal.Body>
          <Alert variant="success" onClose={() => setAbsenceAddedSuccess(false)} dismissible>
            <Alert.Heading>Absence added successfuly.</Alert.Heading>
          </Alert>
        </Modal.Body>
      </Modal>
      <Modal show={markAddedError} onHide={() => setMarkAddedError(false)}>
        <Modal.Body>
          <Alert variant="danger" onClose={() => setMarkAddedError(false)} dismissible>
            <Alert.Heading>Error! Mark coudn't be added.</Alert.Heading>
          </Alert>
        </Modal.Body>
      </Modal>
      <Modal show={markAddedSuccess} onHide={() => setMarkAddedSuccess(false)}>
        <Modal.Body>
          <Alert variant="success" onClose={() => setMarkAddedSuccess(false)} dismissible>
            <Alert.Heading>Mark added successfuly.</Alert.Heading>
          </Alert>
        </Modal.Body>
      </Modal>
      <Container>
        <Row>
          <Col>
            <Formik
              // enableReinitialize={true}
              initialValues={{
                groupId: -1,
                studentId: -1,
                lessonId: -1,
                value: -1,
              }}
              validate={values => {
                const errors = {};
                // if (!values.email) {
                //   errors.email = 'Required';
                // } else if (
                //   !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                // ) {
                //   errors.email = 'Invalid email address';
                // }
                return errors;
              }}
              onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(false);
                switch (submitAction) {
                  case 'addAbsence': {
                    try {
                      const result =
                        await axiosClient.post('/absences', values);

                      if (result.status === 200) {
                        setAbsenceAddedSuccess(true);
                      }
                      else {
                        setAbsenceAddedError(true);
                      }
                    }
                    catch (err) {
                      setAbsenceAddedError(true);
                    }
                    break;
                  }
                  case 'addMark': {
                    try {
                      const result =
                        await axiosClient.post('/marks', values);
                      if (result.status === 200) {
                        setMarkAddedSuccess(true);
                      }
                      else {
                        setMarkAddedError(true);
                      }
                    }
                    catch (err) {
                      setMarkAddedError(true);
                    }
                    break;
                  }
                }
                submitAction = undefined;
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                /* and other goodies */
              }) => (
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <OnGroupChangeFieldsReseter />
                  <Form.Group as={Col} md="4" controlId="groupId">
                    {!groups.length &&
                      <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    }
                    <Form.Label>Group</Form.Label>
                    <Form.Select name="groupId" aria-label="Group name"
                      onChange={handleChange}
                      value={values.groupId}
                    >
                      {
                        (values.groupId === -1) && (
                          <option>Select a group</option>
                        )
                      }
                      {
                        groups.map(group => (
                          <option value={group.id}>
                            {`${group.grade}${group.name}`}
                          </option>
                        ))
                      }
                    </Form.Select>
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="studentId">
                    <Form.Label>Student</Form.Label>
                    <Form.Select name="studentId" aria-label="student"
                      onChange={handleChange}
                      value={values.studentId}
                      disabled={values.groupId === -1}
                    >
                      {
                        (values.studentId === -1) && (
                          <option value={-1}>Select a student</option>
                        )
                      }
                      {groups.find(group => group.id == values.groupId)?.students
                        .map(student =>
                          <option value={student.id}>
                            {`${student.lastName} ${student.firstName}`}
                          </option>
                        )
                      }
                    </Form.Select>
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="lessonId">
                    <Form.Label>Lesson time</Form.Label>
                    <Form.Select name="lessonId" aria-label="Lesson time"
                      onChange={handleChange}
                      value={values.lessonId}
                      disabled={values.groupId === -1}
                    >
                      {
                        (values.lessonId === -1) && (
                          <option>Select a time</option>
                        )
                      }
                      {
                        groups.find(
                          group => group.id == values.groupId
                        )?.lessons?.filter(lesson =>
                          lesson.teacherId === props.user.teacherDetails?.id
                        )?.map(({ id, weekday, startTime }) => {
                          const weekdayName =
                            Info.weekdays('long', { locale: 'ro' })[weekday - 1];
                          const formatedDate =
                            DateTime.fromFormat(startTime, 'HH:mm:ss', { zone: 'utc' })
                              .setZone('Europe/Bucharest')
                              .toFormat('HH:mm', { locale: 'ro' });
                          return <option value={id}>
                            {`${weekdayName} ${formatedDate}`}
                          </option>;
                        })
                      }
                    </Form.Select>
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                  <Button
                    type="button"
                    onClick={() => {
                      submitAction = "addAbsence";
                      handleSubmit();
                    }}
                    disabled={
                      Object.entries(values)
                        .filter(([key, value]) => key !== 'value')
                        .findIndex(
                          ([key, value]) => value === -1
                        ) !== -1
                    }
                  >
                    Add absence
                  </Button>
                  <Form.Group as={Col} md="4" controlId="value">
                    <Form.Label>Mark</Form.Label>
                    <Form.Select name="value" aria-label="Mark"
                      onChange={handleChange}
                      value={values.value}
                      disabled={values.groupId === -1}
                    >
                      {
                        (values.value === -1) && (
                          <option>Select a mark value</option>
                        )
                      }
                      {
                        Array.from(Array(10).keys()).map(markIndex => (
                          <option value={markIndex + 1}>{markIndex + 1}</option>
                        ))
                      }
                    </Form.Select>
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                  <Button
                    type="button"
                    onClick={() => {
                      submitAction = "addMark";
                      handleSubmit();
                    }}
                    disabled={
                      Object.values(values).findIndex(
                        value => value === -1
                      ) !== -1
                    }
                  >
                    Add mark
                  </Button>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
        <Row>
          <Col>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default TeacherScreen;
```

<br/>

<h2> Deploy </h2>

Both backend and frontend are deployed on render.com but on separate servers because the backend services have downtime after inactivity. <br/>

<br/>

On backend for build the API uses a chain of comands. <br/>
First comand instales libraries. Then another comand compiles the project. <br/>
The source files are deleted and in place the compiled files are moved up in the directory.
```sh
npm i && npm run build && rm -r ./bin ./models ./src && mv ./dist/bin ./dist/models ./dist/src . 
```
Then to run the server the www module will be executed.
```sh
node bin/www
```

For frontend the usual pipeline applies.
