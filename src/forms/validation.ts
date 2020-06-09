function validateForms() {
  const questionFoldersUrls = SpreadsheetApp.getActive()
    .getSheetByName(Constants.sheetNames.configurationSheet)
    .getDataRange()
    .getValues()
    .slice(1)
    .map((row) => row[1]);
  for (const folderUrl of questionFoldersUrls) {
    const driveFolder = DriveApp.getFolderById(
      folderUrl.toString().split("/").pop()
    );

    const files = driveFolder.getFilesByType(
      GoogleAppsScript.Base.MimeType.GOOGLE_FORMS.toString()
    );
    while (files.hasNext()) {
      const file = files.next();
      const formFile = FormApp.openById(file.getId());
      formFile.setCollectEmail(true);
      formFile.setAcceptingResponses(true);
      formFile.setLimitOneResponsePerUser(false);
      formFile.setShuffleQuestions(true);
      formFile
        .getItems()
        .filter((item) => item.getTitle() === "Test ID")
        .forEach((item) => {
          switch (item.getType()) {
            case GoogleAppsScript.Forms.ItemType.CHECKBOX:
              item.asCheckboxItem().setRequired(false);
              break;
            case GoogleAppsScript.Forms.ItemType.CHECKBOX_GRID:
              item.asCheckboxGridItem().setRequired(false);
              break;
            case GoogleAppsScript.Forms.ItemType.DATE:
              item.asDateItem().setRequired(false);
              break;
            case GoogleAppsScript.Forms.ItemType.DATETIME:
              item.asDateItem().setRequired(false);
              break;
            case GoogleAppsScript.Forms.ItemType.DURATION:
              item.asDurationItem().setRequired(false);
              break;
            case GoogleAppsScript.Forms.ItemType.GRID:
              item.asGridItem().setRequired(false);
              break;
            case GoogleAppsScript.Forms.ItemType.LIST:
              item.asListItem().setRequired(false);
              break;
            case GoogleAppsScript.Forms.ItemType.MULTIPLE_CHOICE:
              item.asMultipleChoiceItem().setRequired(false);
              break;
            case GoogleAppsScript.Forms.ItemType.PARAGRAPH_TEXT:
              item.asParagraphTextItem().setRequired(false);
              break;
            case GoogleAppsScript.Forms.ItemType.SCALE:
              item.asScaleItem().setRequired(false);
              break;
            case GoogleAppsScript.Forms.ItemType.TEXT:
              item.asTextItem().setRequired(false);
              break;
            case GoogleAppsScript.Forms.ItemType.TIME:
              item.asTimeItem().setRequired(false);
              break;
            case GoogleAppsScript.Forms.ItemType.IMAGE:
            case GoogleAppsScript.Forms.ItemType.PAGE_BREAK:
            case GoogleAppsScript.Forms.ItemType.SECTION_HEADER:
            case GoogleAppsScript.Forms.ItemType.VIDEO:
            default:
              //Do Nothing
              break;
          }
        });
      //TODO: Add option to set quiz feedback to Manual after review (Pending FR with Google)
      if (
        formFile.getItems(FormApp.ItemType.TEXT).filter((item) => {
          return item.asTextItem().getTitle() === "Test ID";
        }).length === 0
      ) {
        const idItem = formFile
          .addTextItem()
          .setRequired(true)
          .setTitle("Test ID")
          .setHelpText("Insert your Test ID here to identify your answer");
        idItem.setRequired(true);
        formFile.moveItem(idItem.getIndex(), 0);
      }
    }
  }
}

function deactivateForms() {
  const questionFoldersUrls = SpreadsheetApp.getActive()
    .getSheetByName(Constants.sheetNames.configurationSheet)
    .getRange(2, 1, 3, 1)
    .getValues();
  for (const folderUrl of questionFoldersUrls) {
    const driveFolder = DriveApp.getFolderById(
      folderUrl.toString().split("/").pop()
    );
    const files = driveFolder.getFilesByType(
      GoogleAppsScript.Base.MimeType.GOOGLE_FORMS.toString()
    );
    while (files.hasNext()) {
      const file = files.next();
      const formFile = FormApp.openById(file.getId());
      formFile.setAcceptingResponses(false);
    }
  }
}
