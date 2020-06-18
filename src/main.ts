function onInstall(): void {
  onOpen();
  showStartupGuide();
}

function onOpen(): void {
  const ui = SpreadsheetApp.getUi();
  //Add menus for Professor on spreadsheet
  ui.createAddonMenu()
    .addItem("Initialize", "initializeSheet")
    .addItem("Check Questions", "validateForms")
    .addItem("Create Application", "createNewApplicationSheet")
    .addSubMenu(
      ui
        .createMenu("Applications")
        .addItem("Start Application", "startApplication")
        .addItem("Create Calendar Event", "createCalendarEvent") //TODO: Add calendar event from test config
        .addItem("End Application", "endApplication")
        .addItem("Resend Application", "resendApplication") //TODO:Add option to resend application ID to a different email address (for recovery purposes)
    )
    .addSubMenu(
      ui
        .createMenu("Help")
        .addItem("Getting Started", "showStartupGuide")
        .addItem("User Manual", "userManual") //TODO: Add help content
        .addItem("Report a Bug", "reportABug")
        .addItem("Request a Feature", "requestAFeature")
    )
    .addToUi();
}
