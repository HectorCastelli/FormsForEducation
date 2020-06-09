function initializeSheet() {
  const activeSpreadsheet = SpreadsheetApp.getActive();
  if (
    activeSpreadsheet.getSheetByName(Constants.sheetNames.configurationSheet) ==
    null
  ) {
    const newConfigSheet = activeSpreadsheet.insertSheet(
      Constants.sheetNames.configurationSheet
    );

    setSheetDimensions(newConfigSheet, 5, 4);

    newConfigSheet
      .getRange(1, 1, 1, 5)
      .setValues([
        [
          "Question Bank",
          "Link to Folder",
          "Weight",
          "Mandatory Count",
          "Optional Count",
        ],
      ]);
    newConfigSheet.getRange(2, 1, 3, 5).setValues([
      ["Easy", null, 1, 1, 0],
      ["Medium", null, 1, 1, 0],
      ["Hard", null, 1, 1, 0],
    ]);
  }
  if (
    activeSpreadsheet.getSheetByName(
      Constants.sheetNames.applicationIdsSheet
    ) == null
  ) {
    const newAppIdSheets = SpreadsheetApp.getActive().insertSheet(
      Constants.sheetNames.applicationIdsSheet
    );
    setSheetDimensions(newAppIdSheets, 4, 1);
    newAppIdSheets.hideSheet();
  }
}
