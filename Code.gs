/**
 * CONFIGURATION
 * Paste your Spreadsheet ID here.
 */
const SPREADSHEET_ID = '1QuEVH7zaNoFztP3gI4DkoR8I0Z6iR9EK468tWALwfrI';

function getSS() {
  if (SPREADSHEET_ID) {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * SETUP FUNCTION
 * Run this once from the Apps Script editor to create required sheets.
 */
function setup() {
  const ss = getSS();

  let settingsSheet = ss.getSheetByName('Settings');
  if (!settingsSheet) {
    settingsSheet = ss.insertSheet('Settings');
    settingsSheet.appendRow(['Param', 'Value', 'Description']);
    settingsSheet.appendRow(['title', 'Linktree Milabkid', 'Page Title']);
    settingsSheet.appendRow(['header_img', 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070', 'Optional: Header Background Image URL']);
    settingsSheet.appendRow(['profile_name', 'Your Name', 'Display Name']);
    settingsSheet.appendRow(['profile_img', 'https://via.placeholder.com/150', 'Profile Image URL']);
    settingsSheet.appendRow(['bio', 'Welcome linktree Milabkid!', 'Bio Text']);
    settingsSheet.appendRow(['bg_gradient', 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', 'Background Gradient']);
    settingsSheet.appendRow(['accent_color', '#ffffff', 'Text/Icon Color']);
    settingsSheet.appendRow(['button_color', 'rgba(255, 255, 255, 0.1)', 'Button Background']);
    settingsSheet.appendRow(['social_youtube', 'https://youtube.com', 'Youtube URL']);
    settingsSheet.appendRow(['social_tiktok', 'https://tiktok.com', 'Tiktok URL']);
    settingsSheet.appendRow(['social_instagram', 'https://instagram.com', 'Instagram URL']);
    settingsSheet.getRange("A1:C1").setFontWeight("bold").setBackground("#f3f3f3");
  }

  let linksSheet = ss.getSheetByName('Links');
  if (!linksSheet) {
    linksSheet = ss.insertSheet('Links');
    linksSheet.appendRow(['Label', 'URL', 'Icon', 'Animate (Yes/No)', 'Parent']);
    linksSheet.appendRow(['My Socials', '', 'fas fa-share-alt', 'Yes', '']);
    linksSheet.appendRow(['Instagram', 'https://instagram.com', 'fab fa-instagram', 'No', 'My Socials']);
    linksSheet.appendRow(['Website', 'https://google.com', 'fas fa-globe', 'No', '']);
    linksSheet.getRange("A1:E1").setFontWeight("bold").setBackground("#f3f3f3");
  }

  Logger.log('Setup Complete!');
}

/**
 * Handles GET requests — returns JSON data with CORS headers
 * so GitHub Pages can fetch it.
 */
function doGet(e) {
  const data = getLinktreeData();
  const json = JSON.stringify(data);

  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Get all data from the spreadsheet.
 */
function getLinktreeData() {
  try {
    const ss = getSS();

    const settingsSheet = ss.getSheetByName('Settings');
    const settingsData = settingsSheet.getDataRange().getValues();
    const settings = {};
    for (let i = 1; i < settingsData.length; i++) {
      const key = settingsData[i][0];
      const value = settingsData[i][1];
      if (key) settings[key] = value;
    }

    const linksSheet = ss.getSheetByName('Links');
    const linksData = linksSheet.getDataRange().getValues();
    const rawLinks = [];

    const headers = linksData[0].map(h => h.toString().toLowerCase());
    const parentIdx = headers.indexOf('parent');

    for (let i = 1; i < linksData.length; i++) {
      const row = linksData[i];
      const [label, url, icon, animate] = row;
      const parent = parentIdx > -1 ? row[parentIdx] : null;

      if (label) {
        rawLinks.push({
          label: label,
          url: url || '',
          icon: icon || 'fas fa-link',
          animate: (animate === true || (typeof animate === 'string' && animate.toLowerCase() === 'yes')),
          parent: parent || null,
          children: []
        });
      }
    }

    const links = [];
    const linkMap = {};
    rawLinks.forEach(link => { linkMap[link.label] = link; });
    rawLinks.forEach(link => {
      if (link.parent && linkMap[link.parent]) {
        linkMap[link.parent].children.push(link);
      } else {
        links.push(link);
      }
    });

    return { settings, links };
  } catch (e) {
    return { error: e.toString() };
  }
}
