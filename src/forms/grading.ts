function retrieveAnswers(testIds: string[]): TestAnswers[] {
  const results: TestAnswers[] = [];

  testIds.forEach((testId: string) => {
    const testAnswer = new TestAnswers();
    testAnswer.studentTest = StudentTests.findByTestId(testId);
    //TODO:fetch data from studentTest
  });

  return results;
}
