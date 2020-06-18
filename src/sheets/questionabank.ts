function retrieveQuestionBank(applicationInput): QuestionBank[] {
  const result: QuestionBank[] = [];
  let addToResult = false;
  for (const row of applicationInput) {
    if (addToResult) {
      if (row[1] != null && row[1] != "") {
        const questions = [];

        const files = getFormsInFolder(row[1]);
        while (files.hasNext()) {
          const file = files.next();
          questions.push(file.getId());
        }

        result.push(
          new QuestionBank(row[0], questions, row[2], row[3], row[4])
        );
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

function generateTests(
  applicationName: string,
  students: Student[],
  questionBanks: QuestionBank[]
): StudentTests[] {
  const result: StudentTests[] = [];
  for (
    let applicationTestId = 0;
    applicationTestId < students.length;
    applicationTestId++
  ) {
    result.push(
      generateTest(
        `${applicationName}-${applicationTestId}`,
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
      JSON.stringify(r.student),
      JSON.stringify(r.mandatory),
      JSON.stringify(r.optional),
    ])
    .forEach((x) => appIdSheets.appendRow(x));
  return result;
}

function generateTest(
  testId: string,
  student: Student,
  questionBanks: QuestionBank[]
): StudentTests {
  const result: StudentTests = {
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
