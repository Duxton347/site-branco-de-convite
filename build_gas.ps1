$scriptTop = @'
// ==========================================
// SCRIPT DE CONFIRMACAO DE PRESENCA (RSVP)
// Substitua TODO o codigo do Google Apps Script por este
// ==========================================

const SHEET_ID = '19UZUtPejkKOD0sZBF7VI6FNt_yV5h0JbFjc4BPx3LPA';
const SHEET_NAME = 'Respostas';

const GUESTS_DB = 
'@

$scriptBottom = @'
;

function setup() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'confirmation_id','submitted_at_iso','group_id','list','principal_raw',
      'attending_raw_json','not_attending_raw_json','needs_van','needs_dormitorio',
      'contact_phone','notes','invite_code'
    ]);
    sheet.getRange("A1:L1").setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
}

function normalizeName(name) {
  if (!name) return "";
  return name.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function doPost(e) {
  try {
    var postData = JSON.parse(e.postData.contents);
    var action = postData.action;
    if (action === 'search') {
      return handleSearch(postData.query);
    } else if (action === 'confirm') {
      return handleConfirm(postData.payload);
    } else {
      return respondJSON({ error: 'Acao invalida' });
    }
  } catch (error) {
    return respondJSON({ error: error.toString() });
  }
}

function doOptions(e) {
  return respondJSON({ status: 'ok' });
}

function handleSearch(query) {
  if (!query) return respondJSON({ error: 'Nenhum nome buscado.' });
  var normalizedQuery = normalizeName(query);
  var group = null;
  for (var i = 0; i < GUESTS_DB.length; i++) {
    var g = GUESTS_DB[i];
    for (var j = 0; j < g.principal_search_keys.length; j++) {
      if (normalizeName(g.principal_search_keys[j]) === normalizedQuery) {
        group = g;
        break;
      }
    }
    if (group) break;
  }
  if (!group) {
    var partialMatch = [];
    for (var i = 0; i < GUESTS_DB.length; i++) {
      var g = GUESTS_DB[i];
      for (var j = 0; j < g.principal_search_keys.length; j++) {
        if (normalizeName(g.principal_search_keys[j]).indexOf(normalizedQuery) !== -1) {
          partialMatch.push(g);
          break;
        }
      }
    }
    if (partialMatch.length === 1) {
      group = partialMatch[0];
    } else if (partialMatch.length > 1) {
      return respondJSON({ error: 'Multiplos convidados encontrados. Digite seu nome e sobrenome.' });
    } else {
      return respondJSON({ error: 'Convidado nao encontrado na lista.' });
    }
  }
  if (isGroupConfirmed(group.group_id)) {
    return respondJSON({ error: 'already_confirmed', message: 'Sua presenca ja foi confirmada! Obrigado!' });
  }
  return respondJSON({
    group: {
      group_id: group.group_id,
      list: group.list,
      principal_raw: group.principal_raw,
      members_raw: group.members_raw,
      member_count: group.member_count,
      group_hash: group.group_hash
    }
  });
}

function isGroupConfirmed(groupId) {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet || sheet.getLastRow() <= 1) return false;
    var data = sheet.getRange(2, 3, sheet.getLastRow() - 1, 1).getValues();
    for (var i = 0; i < data.length; i++) {
      if (String(data[i][0]) === String(groupId)) return true;
    }
  } catch (e) {}
  return false;
}

function handleConfirm(payload) {
  if (!payload || !payload.groupId) return respondJSON({ error: 'Payload incompleto.' });
  if (isGroupConfirmed(payload.groupId)) {
    return respondJSON({ error: 'already_confirmed', message: 'Esta confirmacao ja foi realizada anteriormente.' });
  }
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) { setup(); sheet = ss.getSheetByName(SHEET_NAME); }
  var now = new Date();
  var confirmationId = payload.groupId + '_' + now.getTime();
  var notesParts = [];
  if (payload.childrenCount && parseInt(payload.childrenCount) > 0) notesParts.push('Criancas: ' + payload.childrenCount);
  if (payload.message) notesParts.push(payload.message);
  sheet.appendRow([
    confirmationId,
    now.toISOString(),
    payload.groupId,
    payload.list || '',
    payload.principalName,
    JSON.stringify(payload.attendingMembers || []),
    JSON.stringify(payload.notAttendingMembers || []),
    payload.needsVan ? 'Sim' : 'Nao',
    payload.needsAccommodation ? 'Sim' : 'Nao',
    payload.whatsapp || 'Nao informado',
    notesParts.join(' | '),
    payload.inviteCode || payload.groupHash || ''
  ]);
  return respondJSON({ success: true, message: 'Presenca confirmada com sucesso!' });
}

function respondJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
'@

$jsonPath = 'c:\Users\Judson\Downloads\site-branco-de-convite-main\site-branco-de-convite-main\Confirma\convidados_grupos.json'
$outPath = 'c:\Users\Judson\Downloads\site-branco-de-convite-main\gas_script.js'

$jsonContent = Get-Content -Path $jsonPath -Raw -Encoding UTF8

$fullScript = $scriptTop + $jsonContent + $scriptBottom

[System.IO.File]::WriteAllText($outPath, $fullScript, [System.Text.Encoding]::UTF8)

Write-Host "gas_script.js gerado com sucesso!"
