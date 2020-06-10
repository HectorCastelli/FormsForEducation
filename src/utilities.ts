function getRandomFromArray(array: any[], numberOfElements: number): any[] {
  let result = new Array(numberOfElements),
    length = array.length,
    taken = new Array(length);
  if (numberOfElements > length)
    throw new RangeError(
      "getRandomFromArray: <numberOfElements> is larger than length of <array>"
    );
  while (numberOfElements--) {
    const x = Math.floor(Math.random() * length);
    result[numberOfElements] = array[x in taken ? taken[x] : x];
    taken[x] = --length in taken ? taken[length] : length;
  }
  return result;
}

function setSheetDimensions(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  x: number,
  y: number
): void {
  sheet.deleteColumns(x, sheet.getMaxColumns() - x);
  sheet.deleteRows(y, sheet.getMaxRows() - y);
}

function HtmlInclude(filename: string): string {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
