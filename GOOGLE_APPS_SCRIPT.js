/**
 * GOOGLE APPS SCRIPT FOR HEALTH RECORDS
 * 
 * Instructions:
 * 1. Open a Google Sheet.
 * 2. Go to Extensions > Apps Script.
 * 3. Delete any existing code and paste this code.
 * 4. Click 'Deploy' > 'New Deployment'.
 * 5. Select 'Web App'.
 * 6. Set 'Execute as' to 'Me'.
 * 7. Set 'Who has access' to 'Anyone'.
 * 8. Click 'Deploy' and copy the 'Web App URL'.
 * 9. Paste the URL into your app's environment variables as GAS_WEB_APP_URL.
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Create headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp", 
        "Caregiver", 
        "SpO2 (%)", 
        "Pulse (bpm)", 
        "Temp (°C)", 
        "Systolic", 
        "Diastolic", 
        "Blood Sugar", 
        "Medications", 
        "Notes"
      ]);
      // Format header
      sheet.getRange(1, 1, 1, 10).setFontWeight("bold").setBackground("#f3f4f6");
    }
    
    // Append data
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.caregiver_name || "Unknown",
      data.spo2 || "",
      data.pulse || "",
      data.temperature || "",
      data.systolic || "",
      data.diastolic || "",
      data.blood_sugar || "",
      data.medications || "",
      data.notes || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var rows = data.slice(1);
    
    var result = rows.map(function(row) {
      var obj = {};
      headers.forEach(function(header, i) {
        obj[header.toLowerCase().replace(/ /g, "_").replace(/\(|\)/g, "")] = row[i];
      });
      return obj;
    });
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
