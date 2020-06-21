namespace Grading {
  export function retrieveAnswers(testIds: string[]): TestAnswers[] {
    const results: TestAnswers[] = [];

    testIds.forEach((testId: string) => {
      const testAnswer = new TestAnswers();
      testAnswer.studentTest = StudentTests.findByTestId(testId);
      //TODO:fetch data from studentTest
    });

    return results;
  }

  function retrieveTestAnswers(studentTest: StudentTests): TestAnswers {
    //TODO: fetch data from StudentTest and the relevant answers
  }

  export function getGradeMatrix(
    startTime: Date,
    endTime: Date,
    testAnswers: TestAnswers[]
  ) {
    //TODO: Filter answers to be within time-frame
    //NOTE: Use last-submitted answer as final answer for grading
    //TODO: Compute grading matrix for all students
    //TODO: Write to sheet
  }
}
