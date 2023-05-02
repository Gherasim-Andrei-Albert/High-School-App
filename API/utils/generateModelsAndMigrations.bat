@echo off

call npx sequelize-cli model:generate --name Admin --attributes hashedPassword:string

call npx sequelize-cli model:generate --name Subject --attributes name:string,level:integer

call npx sequelize-cli model:generate --name Teacher --attributes firstName:string,lastName:string,phone:string,email:string,address:string,hashedPassword:string

call npx sequelize-cli model:generate --name TeacherSubjectAssignment --attributes subjectId:integer,teacherId:integer

call npx sequelize-cli model:generate --name Group --attributes masterTeacherId:integer,enrolmentDate:date,grade:integer,name:string

call npx sequelize-cli model:generate --name Parent --attributes firstName:string,lastName:string,phone:string,email:string,address:string,hashedPassword:string

call npx sequelize-cli model:generate --name Student --attributes groupId:integer,parentId:integer,enrolmentDate:date,grade:integer,firstName:string,lastName:string,phone:string,email:string,address:string,hashedPassword:string

call npx sequelize-cli model:generate --name Classroom --attributes ownerGroupId:integer,floor:integer,name:string

call npx sequelize-cli model:generate --name Lesson --attributes subjectId:integer,teacherId:integer,groupId:integer,applicableYear:integer,weekday:integer,startTime:time,endTime:time

call npx sequelize-cli model:generate --name Mark --attributes subjectId:integer,lessonId:integer,studentId:integer,value:integer

call npx sequelize-cli model:generate --name Absence --attributes lessonId:integer,studentId:integer
