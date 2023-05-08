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
