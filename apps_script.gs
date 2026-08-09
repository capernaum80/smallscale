// 소규모 웹앱용 Google Drive 텍스트 중계기
// Android 앱과 동일한 Google Drive 파일입니다.
const FILE_ID = '1ibHb5O7LQ1HXn69VMzJZNsBiVYqhdLK_';

function doGet(e) {
  const callback = String((e && e.parameter && e.parameter.callback) || 'callback')
    .replace(/[^A-Za-z0-9_$]/g, '');

  let result;
  try {
    // DriveApp으로 읽기 때문에 브라우저의 CORS 제한을 받지 않습니다.
    const file = DriveApp.getFileById(FILE_ID);
    const text = file.getBlob().getDataAsString('UTF-8');
    result = { ok: true, text: text };
  } catch (err) {
    result = { ok: false, error: String(err) };
  }

  return ContentService
    .createTextOutput(callback + '(' + JSON.stringify(result) + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
