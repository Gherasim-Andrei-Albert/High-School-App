'use strict';
const bcrypt = require('bcrypt');
let sampleParentsJSON = require('../sampleData/parents.json');
const sampleDataConfig = require('../config/sampleDataConfig.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const currentDate = new Date();
    await queryInterface.bulkInsert(
      'Parents',
      await Promise.all(
        sampleParentsJSON.map(async (parent) => ({
          ...parent,
          hashedPassword: await bcrypt.hash(
            sampleDataConfig.parentPassword,
            10
          ),
          createdAt: currentDate,
          updatedAt: currentDate,
        }))
      )
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Parents', null, {});
  },
};
