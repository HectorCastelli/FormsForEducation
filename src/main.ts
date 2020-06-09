function onInstall(e) {
  onOpen(e);
  showStartupGuide();
}
function onOpen(e) {
  const ui = SpreadsheetApp.getUi();
  //Add menus for Professor on spreadsheet
  ui.createAddonMenu()
    .addItem("Initialize", "initializeSheet")
    .addItem("Check Questions", "validateForms")
    .addItem("Create Application", "initializeApplication")
    .addSubMenu(
      ui
        .createMenu("Applications")
        .addItem("Start Application", "appStartApplication")
        .addItem("Create Calendar Event", "createCalendarEvent") //TODO: Add calendar event from test config
        .addItem("End Application", "appEndApplication")
        .addSeparator()
        .addItem("Resend Test", "resendTest") //TODO: Add resend option
    )
    .addSubMenu(
      ui
        .createMenu("Help") //TODO: Add help menus
        .addItem("Getting Started", "showStartupGuide")
        .addItem("User Manual", "userManual")
        .addItem("Report a Bug", "reportABug")
    )
    .addToUi();
}
