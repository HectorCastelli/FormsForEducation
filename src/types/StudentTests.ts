class StudentTests {
  testId: string;
  student: Student;
  mandatory: string[];
  optional: string[];

  static loadFromSheet(data: any[]): StudentTests {
    const result = new StudentTests();

    result.testId = data[0];
    if (JSON.parse(data[1]).name) {
      result.student = JSON.parse(data[1]);
    } else {
      result.student = new Student(null, data[1]); //TODO: Remove this for formal release, since this is a hack to migrate older sheets entries
    }
    result.mandatory = JSON.parse(data[2]);
    result.mandatory = JSON.parse(data[3]);

    return result;
  }

  static findByTestId(testId: string): StudentTests {
    const sheet = SpreadsheetApp.getActive().getSheetByName(
      Constants.sheetNames.applicationIdsSheet
    );
    const textFinder = sheet.createTextFinder(testId).findNext();
    if (textFinder) {
      const rowData = sheet.getRange(textFinder.getRow(), 1, 1, 4).getValues();
      return this.loadFromSheet(rowData);
    } else return null;
  }
}
