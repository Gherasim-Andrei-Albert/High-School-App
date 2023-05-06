'use strict';
const bcrypt = require('bcrypt');
let sampleStudentsJSON = require('../sampleData/students.json');
const sampleDataConfig = require('../config/sampleDataConfig.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const parents = await queryInterface.sequelize.query(
      'SELECT id FROM Parents',
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    const groups = await queryInterface.sequelize.query(
      'SELECT id, grade FROM Groups',
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    let sampleStudents = await Promise.all(
      sampleStudentsJSON.map(async (student, studentIndex) => ({
        parentId: parents.pop().id,
        groupId: groups[Math.trunc(studentIndex / 30)].id,
        enrolmentYear: 2022,
        grade: groups[Math.trunc(studentIndex / 30)].grade,
        ...student,
        hashedPassword: await bcrypt.hash(sampleDataConfig.studentPassword, 10),
      }))
    );

    const currentDate = new Date();
    await queryInterface.bulkInsert(
      'Students',
      sampleStudents.map((student) => ({
        ...student,
        createdAt: currentDate,
        updatedAt: currentDate,
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Students', null, {});
  },
};
