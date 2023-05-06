'use strict';
const { DateTime } = require('luxon');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const subjectsWithLenssonsNr = require('../sampleData/subjects.json');

    const teacherSubjectAssignments = await queryInterface.sequelize.query(
      'SELECT subjectId, teacherId FROM TeacherSubjectAssignments',
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const groups = await queryInterface.sequelize.query(
      'SELECT id FROM Groups',
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const groupsDetails = await queryInterface.sequelize.query(
      'SELECT id, name, grade FROM Groups',
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

    // const teachers = await queryInterface.sequelize.query(
    //   'SELECT id FROM Teachers',
    //   {
    //     type: Sequelize.QueryTypes.SELECT,
    //   }
    // );

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

    // console.log(subjectsWithTeachers);

    let subjectsWithTeachersWithGroups = subjectsWithTeachers.map(
      ({ subjectId, teachers }) => ({
        subjectId,
        teachersWithGroups: teachers.map((teacher, teacherIndex) => ({
          teacherId: teacher.id,
          groups: groups.slice(teacherIndex * 4, teacherIndex * 4 + 4),
        })),
      })
    );

    // console.log(
    //   subjectsWithTeachersWithGroups.map(
    //     ({ subjectId, teachersWithGroups }) => ({
    //       subjectId,
    //       teachersWithGroups: teachersWithGroups.map((teacherWithGroups) =>
    //         JSON.stringify(teacherWithGroups)
    //       ),
    //     })
    //   )
    // );

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

    // console.log(
    //   subjectTeacherWithGroupsAsignments.map(
    //     ({ subjectId, teacherId, groups }) => ({
    //       subjectId,
    //       teacherId,
    //       groups: JSON.stringify(groups),
    //     })
    //   )
    // );

    let teachersWithGroupSubjectAssignments =
      subjectTeacherWithGroupsAsignments.map(
        ({ subjectId, teacherId, groups }) => ({
          teacherId,
          groups: groups.map((group) => ({ groupId: group.id, subjectId })),
        })
      );

    // console.log(
    //   teachersWithGroupSubjectAssignments.map(({ teacherId, groups }) => ({
    //     teacherId,
    //     groups: JSON.stringify(groups),
    //   }))
    // );

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

    // console.log(multispecialisedTeachersWithGroupSubjectAssignments);

    teachersWithGroupSubjectAssignments =
      teachersWithGroupSubjectAssignments.filter(
        ({ teacherId }) => teacherId !== multispecialisedTeacherId
      );
    teachersWithGroupSubjectAssignments.push(
      multispecialisedTeachersWithGroupSubjectAssignments
    );

    // console.log(
    //   teachersWithGroupSubjectAssignments.map(({ teacherId, groups }) => ({
    //     teacherId,
    //     groups: JSON.stringify(groups),
    //   }))
    // );

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

    // console.log(
    //   teachersWithGroupSubjectAssignments.map(({ teacherId, groups }) => ({
    //     teacherId,
    //     groups: JSON.stringify(groups),
    //   }))
    // );

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
                group.times === pickedSubjectGroupAssignment.times
              )
          );
          teachersWithGroupSubjectAssignments =
            teachersWithGroupSubjectAssignments.filter(
              (teachersWithGroupSubjectAssignment) =>
                teachersWithGroupSubjectAssignment.groups.length !== 0
            );
          timetable[dayIndex].push({
            teacherID: pickedTeacher.teacherId,
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

    // timetables.forEach((timetable) => console.log(timetable));

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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Lessons', null, {});
  },
};
