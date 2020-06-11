function validateForms(): void {
  const questionFoldersUrls = SpreadsheetApp.getActive()
    .getSheetByName(Constants.sheetNames.configurationSheet)
    .getDataRange()
    .getValues()
    .slice(1)
    .map((row) => row[1]);
  for (const folderUrl of questionFoldersUrls) {
    const files = getFormsInFolder(folderUrl);
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
            case FormApp.ItemType.CHECKBOX:
              item.asCheckboxItem().setRequired(false);
              break;
            case FormApp.ItemType.CHECKBOX_GRID:
              item.asCheckboxGridItem().setRequired(false);
              break;
            case FormApp.ItemType.DATE:
              item.asDateItem().setRequired(false);
              break;
            case FormApp.ItemType.DATETIME:
              item.asDateItem().setRequired(false);
              break;
            case FormApp.ItemType.DURATION:
              item.asDurationItem().setRequired(false);
              break;
            case FormApp.ItemType.GRID:
              item.asGridItem().setRequired(false);
              break;
            case FormApp.ItemType.LIST:
              item.asListItem().setRequired(false);
              break;
            case FormApp.ItemType.MULTIPLE_CHOICE:
              item.asMultipleChoiceItem().setRequired(false);
              break;
            case FormApp.ItemType.PARAGRAPH_TEXT:
              item.asParagraphTextItem().setRequired(false);
              break;
            case FormApp.ItemType.SCALE:
              item.asScaleItem().setRequired(false);
              break;
            case FormApp.ItemType.TEXT:
              item.asTextItem().setRequired(false);
              break;
            case FormApp.ItemType.TIME:
              item.asTimeItem().setRequired(false);
              break;
            case FormApp.ItemType.IMAGE:
            case FormApp.ItemType.PAGE_BREAK:
            case FormApp.ItemType.SECTION_HEADER:
            case FormApp.ItemType.VIDEO:
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
  SpreadsheetApp.getActive().toast("Forms Validated!", "FormsForEducations", 2);
}

function activateForms(): void {
  const questionFoldersUrls = SpreadsheetApp.getActive()
    .getSheetByName(Constants.sheetNames.configurationSheet)
    .getDataRange()
    .getValues()
    .slice(1)
    .map((row) => row[1]);
  for (const folderUrl of questionFoldersUrls) {
    const files = getFormsInFolder(folderUrl);
    while (files.hasNext()) {
      const file = files.next();
      const formFile = FormApp.openById(file.getId());
      formFile.setAcceptingResponses(true);
    }
  }
}

function deactivateForms(): void {
  const questionFoldersUrls = SpreadsheetApp.getActive()
    .getSheetByName(Constants.sheetNames.configurationSheet)
    .getDataRange()
    .getValues()
    .slice(1)
    .map((row) => row[1]);
  for (const folderUrl of questionFoldersUrls) {
    const files = getFormsInFolder(folderUrl);
    while (files.hasNext()) {
      const file = files.next();
      const formFile = FormApp.openById(file.getId());
      formFile.setAcceptingResponses(false);
    }
  }
}
