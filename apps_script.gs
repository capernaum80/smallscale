// 소규모 웹앱용 Google Drive 텍스트 읽기/수정 중계기
// 기존 Android/웹앱과 동일한 Google Drive notice.txt 파일입니다.
const FILE_ID = '1ibHb5O7LQ1HXn69VMzJZNsBiVYqhdLK_';
const ADMIN_PIN = '0829';
const DRAFT_PREFIX = 'sogyumo_draft_';

function doGet(e) {
  const p = (e && e.parameter) || {};
  const callback = String(p.callback || 'callback').replace(/[^A-Za-z0-9_$]/g, '');
  const action = String(p.action || 'read');

  let result;
  try {
    switch (action) {
      case 'read':
        result = readNotice_();
        break;
      case 'auth':
        result = { ok: true, authorized: isAuthorized_(p.pin) };
        break;
      case 'saveStart':
        requireAuth_(p.pin);
        result = saveStart_(p.token);
        break;
      case 'saveChunk':
        requireAuth_(p.pin);
        result = saveChunk_(p.token, p.index, p.data);
        break;
      case 'saveFinish':
        requireAuth_(p.pin);
        result = saveFinish_(p.token, p.count);
        break;
      default:
        result = { ok: false, error: '알 수 없는 요청입니다.' };
    }
  } catch (err) {
    result = { ok: false, error: String(err && err.message ? err.message : err) };
  }

  return ContentService
    .createTextOutput(callback + '(' + JSON.stringify(result) + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function readNotice_() {
  const file = DriveApp.getFileById(FILE_ID);
  const text = file.getBlob().getDataAsString('UTF-8');
  return { ok: true, text: text };
}

function isAuthorized_(pin) {
  return String(pin || '') === ADMIN_PIN;
}

function requireAuth_(pin) {
  if (!isAuthorized_(pin)) throw new Error('비밀번호가 올바르지 않습니다.');
}

function safeToken_(token) {
  const t = String(token || '').replace(/[^A-Za-z0-9_-]/g, '');
  if (!t || t.length > 80) throw new Error('저장 세션이 올바르지 않습니다.');
  return t;
}

function saveStart_(token) {
  const t = safeToken_(token);
  const props = PropertiesService.getScriptProperties();
  // 같은 토큰의 이전 찌꺼기를 정리합니다.
  const all = props.getProperties();
  const prefix = DRAFT_PREFIX + t + '_';
  Object.keys(all).forEach(k => {
    if (k.indexOf(prefix) === 0) props.deleteProperty(k);
  });
  return { ok: true };
}

function saveChunk_(token, index, data) {
  const t = safeToken_(token);
  const i = Number(index);
  if (!Number.isInteger(i) || i < 0 || i > 9999) throw new Error('저장 순서가 올바르지 않습니다.');
  const chunk = String(data == null ? '' : data);
  PropertiesService.getScriptProperties().setProperty(DRAFT_PREFIX + t + '_' + i, chunk);
  return { ok: true, index: i };
}

function saveFinish_(token, count) {
  const t = safeToken_(token);
  const n = Number(count);
  if (!Number.isInteger(n) || n < 0 || n > 10000) throw new Error('저장 데이터가 올바르지 않습니다.');

  const props = PropertiesService.getScriptProperties();
  let text = '';
  const keys = [];
  for (let i = 0; i < n; i++) {
    const key = DRAFT_PREFIX + t + '_' + i;
    const chunk = props.getProperty(key);
    if (chunk === null) throw new Error('저장 중 일부 내용이 누락되었습니다. 다시 시도해주세요.');
    text += chunk;
    keys.push(key);
  }

  DriveApp.getFileById(FILE_ID).setContent(text);
  keys.forEach(k => props.deleteProperty(k));
  return { ok: true, text: text };
}
