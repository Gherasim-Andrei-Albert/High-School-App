@echo offs

call npx sequelize-cli seed:generate --name sample-users

call npx sequelize-cli seed:generate --name sample-credentials

call npx sequelize-cli seed:generate --name sample-subjects

call npx sequelize-cli seed:generate --name sample-teachers

call npx sequelize-cli seed:generate --name sample-teacher-subject-assignments

call npx sequelize-cli seed:generate --name sample-groups

call npx sequelize-cli seed:generate --name sample-parents

call npx sequelize-cli seed:generate --name sample-students

call npx sequelize-cli seed:generate --name sample-classrooms

call npx sequelize-cli seed:generate --name sample-lessons

call npx sequelize-cli seed:generate --name sample-marks

call npx sequelize-cli seed:generate --name sample-absences
