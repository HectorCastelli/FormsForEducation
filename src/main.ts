function onInstall(): void {
  onOpen();
  Help.showStartupGuide();
}

function onOpen(): void {
  const ui = SpreadsheetApp.getUi();
  //Add menus for Professor on spreadsheet
  ui.createAddonMenu()
    .addItem("Initialize", "initializeSheet")
    .addItem("Check Questions", "Forms.validateForms")
    .addItem("Create Application", "createNewApplicationSheet")
    .addSubMenu(
      ui
        .createMenu("Applications")
        .addItem("Start Application", "startApplication")
        .addItem("Create Calendar Event", "createCalendarEvent") //TODO: Add calendar event from test config
        .addItem("End Application", "endApplication")
        .addItem("Resend Application", "resendApplication")
    )
    .addSubMenu(
      ui
        .createMenu("Help")
        .addItem("Getting Started", "showStartupGuide")
        .addItem("User Manual", "userManual")
        .addItem("Report a Bug", "reportABug")
        .addItem("Request a Feature", "requestAFeature")
    )
    .addToUi();
}
