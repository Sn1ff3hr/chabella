import { google } from 'googleapis';

/**
 * Appends data to a Google Sheet.
 *
 * @param sheetId The ID of the Google Spreadsheet.
 * @param range The A1 notation of a range to search for a logical table of data.
 *              Values will be appended after the last row of this table. E.g., 'Sheet1!A1' or 'Sheet1'.
 * @param values A 2D array of values to append. Each inner array is a row.
 * @returns A promise that resolves with the API response or undefined if skipped/failed.
 */
export async function appendToSheet(sheetId: string, range: string, values: any[][]) {
  console.log('Attempting to append to Google Sheet...');

  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.warn('GOOGLE_APPLICATION_CREDENTIALS environment variable not set. Skipping Google Sheets operation.');
    return;
  }
  if (!sheetId) {
    console.warn('Google Sheet ID is not provided. Skipping Google Sheets operation.');
    return;
  }

  try {
    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // Check if ADC are available. This relies on GOOGLE_APPLICATION_CREDENTIALS env var.
    // This call will throw an error if credentials are not found.
    const authClient = await auth.getClient();

    const sheets = google.sheets({ version: 'v4', auth: authClient });

    const resource = {
      values,
    };

    console.log(`Appending to Sheet ID: ${sheetId}, Range: ${range}, Values: ${JSON.stringify(values)}`);

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: range, // e.g., 'Sheet1!A1' or just 'SheetName' to append after last data
      valueInputOption: 'USER_ENTERED', // or 'RAW'
      insertDataOption: 'INSERT_ROWS', // Inserts new rows (recommended)
      resource,
    });

    console.log('Successfully appended to Google Sheet:', response.data);
    return response.data;
  } catch (error) {
    // Check if error is an AxiosError or similar to get more details if needed
    let errorMessage = 'Unknown error during Google Sheets operation.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    console.error('Error appending to Google Sheet:', errorMessage);
    // Log detailed error if available and it's an API error
    // if (error && (error as any).errors) {
    //   console.error('Google API Errors:', (error as any).errors);
    // }
    return undefined; // Indicate failure but don't crash the caller
  }
}

// Example Usage (for testing this file directly, not for production)
/*
async function testAppend() {
  if (process.argv[2] === 'test-sheets') {
    console.log("Running test append to Google Sheets...");
    // Ensure GOOGLE_APPLICATION_CREDENTIALS is set in your environment
    // And replace 'YOUR_SHEET_ID_HERE' with an actual sheet ID you have access to
    const sheetId = process.env.GOOGLE_SHEET_ID || 'YOUR_SHEET_ID_HERE';
    if (sheetId === 'YOUR_SHEET_ID_HERE') {
        console.error("Please set GOOGLE_SHEET_ID env var or update the test function with a real Sheet ID.");
        return;
    }

    const range = 'Sheet1!A1'; // Or just 'Sheet1'
    const values = [
      ['Test Product ID', 'Test Product Name', 10.99, new Date().toISOString()],
      ['Test Product ID 2', 'Another Test Product', 20.50, new Date().toISOString()],
    ];
    await appendToSheet(sheetId, range, values);
  }
}
testAppend();
*/
