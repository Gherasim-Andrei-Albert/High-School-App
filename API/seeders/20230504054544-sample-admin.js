'use strict';
const bcrypt = require('bcrypt');
const sampleDataConfig = require('../config/sampleDataConfig.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Admins',
      await Promise.all([
        {
          email: sampleDataConfig.admin.email,
          hashedPassword: await bcrypt.hash(
            sampleDataConfig.admin.password,
            10
          ),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ])
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Admins', null, {});
  },
};
