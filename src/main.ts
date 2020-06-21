function onInstall(): void {
  onOpen();
  Help.showStartupGuide();
}

function onOpen(): void {
  const ui = SpreadsheetApp.getUi();
  //Add menus for Professor on spreadsheet
  ui.createAddonMenu()
    .addItem("Initialize", "Initialization.initializeSheet")
    .addItem("Check Questions", "Forms.validateForms")
    .addItem("Create Application", "Application.createNewApplicationSheet")
    .addSubMenu(
      ui
        .createMenu("Applications")
        .addItem("Start Application", "Application.startApplication")
        .addItem("Create Calendar Event", "Application.createCalendarEvent") //TODO: Add calendar event from test config
        .addItem("End Application", "Application.endApplication")
        .addItem("Resend Application", "Application.resendApplication")
    )
    .addSubMenu(
      ui
        .createMenu("Help")
        .addItem("Getting Started", "Help.showStartupGuide")
        .addItem("User Manual", "Help.userManual")
        .addItem("Report a Bug", "Help.reportABug")
        .addItem("Request a Feature", "Help.requestAFeature")
    )
    .addToUi();
}
