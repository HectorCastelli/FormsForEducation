function retrieveQuestionBank(applicationInput) {
  const result = [];
  let addToResult = false;
  for (const row of applicationInput) {
    if (addToResult) {
      if (row[1] != null && row[1] != "") {
        const questions = [];

        const folderId = row[1].toString().split("/").pop();
        const driveFolder = DriveApp.getFolderById(folderId);
        const files = driveFolder.getFilesByType(
          GoogleAppsScript.Base.MimeType.GOOGLE_FORMS.toString()
        );
        while (files.hasNext()) {
          const file = files.next();
          questions.push(file.getId());
        }

        result.push({
          name: row[0],
          folderQuestions: questions,
          weight: row[2],
          mandatory: row[3],
          optional: row[4],
        });
      }
    }
    if (row[0] === "Question Bank") {
      addToResult = true;
    }
    if (row[0] === "Students") {
      break;
    }
  }
  return result;
}

function generateTests(applicationName, students, questionBanks) {
  const result = [];
  for (
    let applicationTestId = 0;
    applicationTestId < students.length;
    applicationTestId++
  ) {
    result.push(
      generateTest(
        applicationName + "-" + applicationTestId,
        students[applicationTestId],
        questionBanks
      )
    );
  }
  const appIdSheets = SpreadsheetApp.getActive().getSheetByName(
    Constants.sheetNames.applicationIdsSheet
  );
  result
    .map((r) => [
      r.testId,
      r.student[1],
      JSON.stringify(r.mandatory),
      JSON.stringify(r.optional),
    ])
    .forEach((x) => appIdSheets.appendRow(x));
  return result;
}

function generateTest(testId, student, questionBanks) {
  const result = {
    testId: testId,
    student: student,
    mandatory: [],
    optional: [],
  };

  questionBanks.forEach((questionBank) => {
    if (questionBank.mandatory > 0) {
      result.mandatory = result.mandatory.concat(
        getRandomFromArray(questionBank.folderQuestions, questionBank.mandatory)
      );
    }
    if (questionBank.optional > 0) {
      result.optional = result.optional.concat(
        getRandomFromArray(questionBank.folderQuestions, questionBank.optional)
      );
    }
  });

  return result;
}
