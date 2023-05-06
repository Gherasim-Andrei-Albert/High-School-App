const { JSDOM } = require('jsdom');
const fs = require('fs').promises;
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

let nrOfRandomPersonsGenerated = 0;

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

  const nrOfStudentsPerGroup = 30;
  const nrOfGrades = 4;
  const nrOfGroupsPerGrade = 4;
  const nrOfParents = nrOfGrades * nrOfGroupsPerGrade * nrOfStudentsPerGroup;
  let parents = await Promise.all(
    [...Array(nrOfParents).keys()].map(() => fetchRandomPersonData())
  );

  console.log('parents generated');

  fs.writeFile('../sampleData/parents.json', JSON.stringify(parents)).then(() =>
    console.log('parents saved')
  );

  const nrOfStudents = nrOfParents;
  let students = await Promise.all(
    [...Array(nrOfStudents).keys()].map(() => fetchRandomPersonData())
  );

  console.log('students generated');

  fs.writeFile('../sampleData/students.json', JSON.stringify(students)).then(
    () => console.log('students saved')
  );
})();
