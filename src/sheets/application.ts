function createNewApplication() {
  //Give instructions for the professor on what he needs to do to get the application started.
  const applicationNameResponse = SpreadsheetApp.getUi().prompt(
    "Insert the name of the test",
    SpreadsheetApp.getUi().ButtonSet.OK_CANCEL
  );
  if (
    applicationNameResponse.getSelectedButton() ===
    SpreadsheetApp.getUi().Button.OK
  ) {
    initializeApplicationSheet(applicationNameResponse.getResponseText());
  }
}

function initializeApplicationSheet(applicationName: string) {
  const appSheet = SpreadsheetApp.getActive().insertSheet(
    Constants.sheetNames.applicationSheet + "-" + applicationName
  );
  const questionBank = SpreadsheetApp.getActive()
    .getSheetByName(Constants.sheetNames.configurationSheet)
    .getDataRange()
    .getValues();
  appSheet.deleteColumns(5, appSheet.getMaxColumns() - 5);
  appSheet.deleteRows(
    7 + questionBank.length,
    appSheet.getMaxRows() - (7 + questionBank.length)
  );
  appSheet.getRange(1, 1, 2, 5).setValues([
    ["Test Name", "Applied On", "Start Time", "End Time", "Status"],
    [
      applicationName,
      null,
      null,
      null,
      Constants.applicationStatus.PREPARATION,
    ],
  ]);
  appSheet.getRange(4, 1, questionBank.length, 5).setValues(questionBank);
  appSheet.getRange(5 + questionBank.length, 1, 2, 4).setValues([
    ["Students", null, null, null],
    ["Name", "Email", "Test Id", "Email Sent"],
  ]);
}

function appStartApplication() {
  const appSheet = SpreadsheetApp.getActiveSheet();
  if (appSheet != null) {
    if (
      appSheet.getName().includes(Constants.sheetNames.applicationSheet + "-")
    ) {
      if (
        appSheet.getRange(2, 5).getValue() ===
        Constants.applicationStatus.PREPARATION
      ) {
        const testName = appSheet.getRange(2, 1).getValue();
        //Gather questions
        const questionBank = retrieveQuestionBank(
          appSheet.getDataRange().getValues()
        );
        //Gather students
        const students = appSheet
          .getRange(
            8 + questionBank.length,
            1,
            appSheet.getMaxRows() - (8 + questionBank.length) + 1,
            2
          )
          .getValues();
        //Randomize students tests
        const studentsTests = generateTests(
          appSheet.getName(),
          students,
          questionBank
        );
        //Update rows with students to have their Ids
        studentsTests.forEach((studentTest) => {
          const emailRange = appSheet
            .createTextFinder(studentTest.student[1])
            .findNext();
          appSheet
            .getRange(emailRange.getRow(), 3)
            .setValue(studentTest.testId);
        });
        //Create email bodies
        const emails = createEmails(studentsTests);
        //Send Emails
        const cc = SpreadsheetApp.getActive().getOwner().getEmail();
        for (const email of emails) {
          const emailRange = appSheet.createTextFinder(email[0]).findNext();
          GmailApp.sendEmail(
            email[0], //TODO: change to student email
            "Here is your test: " + testName,
            email[2],
            {
              htmlBody: email[1],
            }
          );
          appSheet.getRange(emailRange.getRow(), 4).setValue(true);
        }
        //Send email to teacher
        GmailApp.sendEmail(
          cc,
          "Professor copy: " + testName,
          emails
            .map((e) => "TO: " + e[0] + "\n" + e[2])
            .reduce((total, e) => {
              return "" + total + "\n=======\n" + e;
            }),
          {
            htmlBody: emails
              .map((e) => "<h1>TO: " + e[0] + "</h1><div>" + e[1] + "<div>")
              .reduce((total, e) => {
                return "" + total + "<hr>" + e;
              }),
          }
        );
        //Update application status
        appSheet.getRange(2, 5).setValue(Constants.applicationStatus.PROGRESS);
      } else {
        SpreadsheetApp.getUi().alert("This application is not in PREPARATION");
      }
    } else {
      SpreadsheetApp.getUi().alert(
        "Make sure you have the sheet of the test you want to apply currently open"
      );
    }
  }
}

function createEmails(studentsTests) {
  return studentsTests.map((studentTest) => {
    const questionLinks = {
      mandatory: [],
      optional: [],
    };
    studentTest.mandatory.forEach((mandatory) => {
      const formFile = FormApp.openById(mandatory);
      const questionItem = formFile
        .getItems(FormApp.ItemType.TEXT)
        .filter((item) => {
          return item.asTextItem().getTitle() === "Test ID";
        })
        .pop()
        .asTextItem();
      questionLinks.mandatory.push({
        title: formFile.getTitle(),
        link: formFile
          .createResponse()
          .withItemResponse(questionItem.createResponse(studentTest.testId))
          .toPrefilledUrl(),
      });
    });
    studentTest.optional.forEach((mandatory) => {
      const formFile = FormApp.openById(mandatory);
      const questionItem = formFile
        .getItems(FormApp.ItemType.TEXT)
        .filter((item) => {
          return item.asTextItem().getTitle() === "Test ID";
        })
        .pop()
        .asTextItem();
      questionLinks.optional.push({
        title: formFile.getTitle(),
        link: formFile
          .createResponse()
          .withItemResponse(questionItem.createResponse(studentTest.testId))
          .toPrefilledUrl(),
      });
    });

    const emailTemplate = HtmlService.createTemplateFromFile("Emails/NewTest");
    emailTemplate.testId = studentTest.testId;
    emailTemplate.questions = questionLinks;

    const emailOutput = emailTemplate.evaluate().getContent();
    const emailFallback =
      "Here is your Test ID: " +
      studentTest.testId +
      "\n" +
      "\n" +
      "Mandatory Questions:" +
      "\n" +
      questionLinks.mandatory.map((q) => "-> " + q.link + "\n").toString() +
      "\n" +
      "\n" +
      "Optional Questions:" +
      "\n" +
      questionLinks.optional.map((q) => "-> " + q.link + "\n").toString() +
      "\n" +
      "";

    return [studentTest.student[1], emailOutput, emailFallback];
  });
}

function appEndApplication() {
  const appSheet = SpreadsheetApp.getActiveSheet();
  if (appSheet != null) {
    if (
      appSheet.getName().includes(Constants.sheetNames.applicationSheet + "-")
    ) {
      if (
        appSheet.getRange(2, 5).getValue() ===
        Constants.applicationStatus.PROGRESS
      ) {
        //Deactivate forms
        //Close applications
        appSheet.getRange(2, 5).setValue(Constants.applicationStatus.CLOSED);
        //Compute results sheet with grades
      } else {
        SpreadsheetApp.getUi().alert("This application is not IN PROGRESS");
      }
    } else {
      SpreadsheetApp.getUi().alert(
        "Make sure you have the sheet of the test you want to close currently open"
      );
    }
  }
}
