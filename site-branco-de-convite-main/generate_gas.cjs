const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'Confirma', 'convidados_grupos.json');
let convidados = [];
if (fs.existsSync(jsonPath)) {
    convidados = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
} else {
    console.error("JSON file not found at " + jsonPath);
    process.exit(1);
}

const gasTemplate = `// ==========================================
// SCRIPT DE CONFIRMAÇÃO DE PRESENÇA (RSVP)
// ==========================================

const SHEET_ID = '19UZUtPejkKOD0sZBF7VI6FNt_yV5h0JbFjc4BPx3LPA';
const SHEET_NAME = 'Respostas'; // Nome da aba onde as respostas serão salvas

// Banco de dados de convidados embutido
const GUESTS_DB = ` + JSON.stringify(convidados, null, 2) + `;

function setup() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Cria cabeçalhos
    sheet.appendRow([
      'Data/Hora', 
      'Group ID', 
      'Nome Principal', 
      'Telefone (WhatsApp)', 
      'Membros Confirmados', 
      'Membros Ausentes', 
      'Total Convidados', 
      'Precisa de Van', 
      'Precisa de Hospedagem', 
      'Crianças', 
      'Mensagem'
    ]);
    sheet.getRange("A1:K1").setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
}

function normalizeName(name) {
  if (!name) return "";
  return name.toString().toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").trim();
}

function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;

    if (action === 'search') {
      return handleSearch(postData.query);
    } else if (action === 'confirm') {
      return handleConfirm(postData.payload);
    } else {
      return respondJSON({ error: 'Ação inválida' }, 400);
    }
  } catch (error) {
    return respondJSON({ error: error.toString() }, 500);
  }
}

// Para permitir preflight CORS (OPTIONS)
function doOptions(e) {
  return respondJSON({ status: 'ok' }, 200, true);
}

function handleSearch(query) {
  if (!query) return respondJSON({ error: 'Nenhum nome buscado.' }, 400, true);
  
  const normalizedQuery = normalizeName(query);
  
  // Find group
  let group = GUESTS_DB.find(g => {
    return g.principal_search_keys.some(key => normalizeName(key) === normalizedQuery);
  });

  if (!group) {
    // Tenta busca parcial se não achar exato
    const partialMatch = GUESTS_DB.filter(g => {
       return g.principal_search_keys.some(key => normalizeName(key).includes(normalizedQuery));
    });
    
    if (partialMatch.length === 1) {
       group = partialMatch[0];
    } else if (partialMatch.length > 1) {
       return respondJSON({ error: 'Múltiplos convidados encontrados com este nome. Por favor, digite seu nome e sobrenome.' }, 404, true);
    } else {
       return respondJSON({ error: 'Convidado não encontrado na lista.' }, 404, true);
    }
  }

  return checkAndReturnGroup(group);
}

function checkAndReturnGroup(group) {
  if (isGroupConfirmed(group.group_id)) {
    return respondJSON({ 
      error: 'already_confirmed',
      message: 'Confirmação já foi realizada. Caso queira alterar contate os noivos diretamente.' 
    }, 200, true); // Retorno 200 pro front tratar normalmente
  }

  const safeGroup = {
    group_id: group.group_id,
    principal_raw: group.principal_raw,
    members_raw: group.members_raw,
    member_count: group.member_count
  };

  return respondJSON({ group: safeGroup }, 200, true);
}

function isGroupConfirmed(groupId) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) return false;
    
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][1] == groupId) {
        return true;
      }
    }
  } catch (e) {
    // ignore
  }
  return false;
}

function handleConfirm(payload) {
  if (!payload || !payload.groupId) {
    return respondJSON({ error: 'Payload incompleto.' }, 400, true);
  }

  if (isGroupConfirmed(payload.groupId)) {
    return respondJSON({ 
      error: 'already_confirmed',
      message: 'Esta confirmação já foi realizada anteriormente.' 
    }, 200, true);
  }

  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    setup();
    sheet = ss.getSheetByName(SHEET_NAME);
  }

  const timestamp = new Date();
  
  sheet.appendRow([
    timestamp,
    payload.groupId,
    payload.principalName,
    payload.whatsapp || 'Não informado',
    payload.attendingMembers ? payload.attendingMembers.join(', ') : '',
    payload.notAttendingMembers ? payload.notAttendingMembers.join(', ') : '',
    payload.totalGuests || 0,
    payload.needsVan ? 'Sim' : 'Não',
    payload.needsAccommodation ? 'Sim' : 'Não',
    payload.childrenCount || 0,
    payload.message || ''
  ]);

  return respondJSON({ success: true, message: 'Presença confirmada com sucesso!' }, 200, true);
}

function respondJSON(data, code=200, cors=true) {
  const result = ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  
  return result;
}
`;

const outDir = path.join(__dirname, 'backend');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
}
fs.writeFileSync(path.join(outDir, 'codigo.gs'), gasTemplate);
console.log('backend/codigo.gs generated successfully.');
