// ==========================================
// SCRIPT DE CONFIRMAÇÃO DE PRESENÇA (RSVP)
// ==========================================

const SHEET_ID = '19UZUtPejkKOD0sZBF7VI6FNt_yV5h0JbFjc4BPx3LPA';
const SHEET_NAME = 'Respostas'; // Nome da aba onde as respostas serão salvas

// Banco de dados de convidados embutido
const GUESTS_DB = [
  {
    "group_id": 1,
    "list": "Julia",
    "principal_raw": "Camila (mãe da noiva)",
    "principal_trim": "Camila (mãe da noiva)",
    "principal_key": "camila (mae da noiva)",
    "members_raw": [
      "Maikon (padrasto da noiva)",
      "Bruna (irmã da noiva)",
      "Raphaela (irmã da noiva)"
    ],
    "group_raw": "Camila (mãe da noiva)\nMaikon (padrasto da noiva)\nBruna (irmã da noiva)\nRaphaela (irmã da noiva)",
    "group_hash": "6ccc53945719",
    "member_count": 4,
    "principal_base_raw": "Camila",
    "principal_base_key": "camila",
    "principal_search_keys": [
      "camila (mae da noiva)",
      "camila"
    ]
  },
  {
    "group_id": 2,
    "list": "Julia",
    "principal_raw": "Thiago Lemos (pai da noiva)",
    "principal_trim": "Thiago Lemos (pai da noiva)",
    "principal_key": "thiago lemos (pai da noiva)",
    "members_raw": [
      "Acompanhante de Thiago",
      "Filho da acompanhante de Thiago Lemos"
    ],
    "group_raw": "Thiago Lemos (pai da noiva)\nAcompanhante de Thiago\nFilho da acompanhante de Thiago Lemos",
    "group_hash": "f4c531f287fe",
    "member_count": 3,
    "principal_base_raw": "Thiago Lemos",
    "principal_base_key": "thiago lemos",
    "principal_search_keys": [
      "thiago lemos (pai da noiva)",
      "thiago lemos"
    ]
  },
  {
    "group_id": 3,
    "list": "Julia",
    "principal_raw": "Elizete (avó da noiva)",
    "principal_trim": "Elizete (avó da noiva)",
    "principal_key": "elizete (avo da noiva)",
    "members_raw": [
      "Tio Teba (tio avô da noiva)"
    ],
    "group_raw": "Elizete (avó da noiva)\nTio Teba (tio avô da noiva)",
    "group_hash": "fd4731d42e8e",
    "member_count": 2,
    "principal_base_raw": "Elizete",
    "principal_base_key": "elizete",
    "principal_search_keys": [
      "elizete (avo da noiva)",
      "elizete"
    ]
  },
  {
    "group_id": 4,
    "list": "Julia",
    "principal_raw": "Mabily Furtado",
    "principal_trim": "Mabily Furtado",
    "principal_key": "mabily furtado",
    "members_raw": [
      "Cristiani"
    ],
    "group_raw": "Mabily Furtado\nCristiani",
    "group_hash": "2dcff5bede1e",
    "member_count": 2,
    "principal_base_raw": "Mabily Furtado",
    "principal_base_key": "mabily furtado",
    "principal_search_keys": [
      "mabily furtado"
    ]
  },
  {
    "group_id": 5,
    "list": "Julia",
    "principal_raw": "Caio Furtado",
    "principal_trim": "Caio Furtado",
    "principal_key": "caio furtado",
    "members_raw": [
      "Alessandra (esposa de Caio Furtado)"
    ],
    "group_raw": "Caio Furtado\nAlessandra (esposa de Caio Furtado)",
    "group_hash": "a0206a955065",
    "member_count": 2,
    "principal_base_raw": "Caio Furtado",
    "principal_base_key": "caio furtado",
    "principal_search_keys": [
      "caio furtado"
    ]
  },
  {
    "group_id": 6,
    "list": "Julia",
    "principal_raw": "Thiago Júnior (irmão da noiva)",
    "principal_trim": "Thiago Júnior (irmão da noiva)",
    "principal_key": "thiago junior (irmao da noiva)",
    "members_raw": [
      "Mãe do Thiago Júnior",
      "Pai do Thiago Júnior",
      "Irmão do Thiago Júnior"
    ],
    "group_raw": "Thiago Júnior (irmão da noiva)\nMãe do Thiago Júnior\nPai do Thiago Júnior\nIrmão do Thiago Júnior",
    "group_hash": "c580091569f9",
    "member_count": 4,
    "principal_base_raw": "Thiago Júnior",
    "principal_base_key": "thiago junior",
    "principal_search_keys": [
      "thiago junior (irmao da noiva)",
      "thiago junior"
    ]
  },
  {
    "group_id": 7,
    "list": "Julia",
    "principal_raw": "Sarah Lemos (tia da noiva)",
    "principal_trim": "Sarah Lemos (tia da noiva)",
    "principal_key": "sarah lemos (tia da noiva)",
    "members_raw": [
      "Igor (tio da noiva)",
      "Ítalo (primo da noiva)",
      "Gustavo (primo da noiva)",
      "Maria Fernanda (prima da noiva)"
    ],
    "group_raw": "Sarah Lemos (tia da noiva)\nIgor (tio da noiva)\nÍtalo (primo da noiva)\nGustavo (primo da noiva)\nMaria Fernanda (prima da noiva)",
    "group_hash": "ff7a6d20a2f4",
    "member_count": 5,
    "principal_base_raw": "Sarah Lemos",
    "principal_base_key": "sarah lemos",
    "principal_search_keys": [
      "sarah lemos (tia da noiva)",
      "sarah lemos"
    ]
  },
  {
    "group_id": 8,
    "list": "Julia",
    "principal_raw": "Jonathan Lemos (tio da noiva)",
    "principal_trim": "Jonathan Lemos (tio da noiva)",
    "principal_key": "jonathan lemos (tio da noiva)",
    "members_raw": [
      "Fernanda (tia da noiva)",
      "Kayque Lemos (primo da noiva)",
      "Kauê Lemos (primo da noiva)",
      "Melissa Lemos (prima da noiva)",
      "Laysa Lemos (prima da noiva)"
    ],
    "group_raw": "Jonathan Lemos (tio da noiva)\nFernanda (tia da noiva)\nKayque Lemos (primo da noiva)\nKauê Lemos (primo da noiva)\nMelissa Lemos (prima da noiva)\nLaysa Lemos (prima da noiva)",
    "group_hash": "0cf2d63f37a6",
    "member_count": 6,
    "principal_base_raw": "Jonathan Lemos",
    "principal_base_key": "jonathan lemos",
    "principal_search_keys": [
      "jonathan lemos (tio da noiva)",
      "jonathan lemos"
    ]
  },
  {
    "group_id": 9,
    "list": "Julia",
    "principal_raw": "Gabriel Lemos (tio da noiva)",
    "principal_trim": "Gabriel Lemos (tio da noiva)",
    "principal_key": "gabriel lemos (tio da noiva)",
    "members_raw": [
      "Jamile Lemos (tia da noiva)"
    ],
    "group_raw": "Gabriel Lemos (tio da noiva)\nJamile Lemos (tia da noiva)",
    "group_hash": "8ad977a0ead8",
    "member_count": 2,
    "principal_base_raw": "Gabriel Lemos",
    "principal_base_key": "gabriel lemos",
    "principal_search_keys": [
      "gabriel lemos (tio da noiva)",
      "gabriel lemos"
    ]
  },
  {
    "group_id": 10,
    "list": "Julia",
    "principal_raw": "Gabriele (prima da noiva)",
    "principal_trim": "Gabriele (prima da noiva)",
    "principal_key": "gabriele (prima da noiva)",
    "members_raw": [
      "Lucas (marido de Gabriele)"
    ],
    "group_raw": "Gabriele (prima da noiva)\nLucas (marido de Gabriele)",
    "group_hash": "01def55d7d33",
    "member_count": 2,
    "principal_base_raw": "Gabriele",
    "principal_base_key": "gabriele",
    "principal_search_keys": [
      "gabriele (prima da noiva)",
      "gabriele"
    ]
  },
  {
    "group_id": 11,
    "list": "Julia",
    "principal_raw": "Alessandra (tia da noiva)",
    "principal_trim": "Alessandra (tia da noiva)",
    "principal_key": "alessandra (tia da noiva)",
    "members_raw": [
      "Rafael (primo da noiva)"
    ],
    "group_raw": "Alessandra (tia da noiva)\nRafael (primo da noiva)",
    "group_hash": "87f9888b11af",
    "member_count": 2,
    "principal_base_raw": "Alessandra",
    "principal_base_key": "alessandra",
    "principal_search_keys": [
      "alessandra (tia da noiva)",
      "alessandra"
    ]
  },
  {
    "group_id": 12,
    "list": "Julia",
    "principal_raw": "Angela (tia da noiva)",
    "principal_trim": "Angela (tia da noiva)",
    "principal_key": "angela (tia da noiva)",
    "members_raw": [
      "Matheus (primo da noiva)",
      "Vitor (primo da noiva)",
      "Mariana (prima da noiva)"
    ],
    "group_raw": "Angela (tia da noiva)\nMatheus (primo da noiva)\nVitor (primo da noiva)\nMariana (prima da noiva)",
    "group_hash": "3a65fa893d9d",
    "member_count": 4,
    "principal_base_raw": "Angela",
    "principal_base_key": "angela",
    "principal_search_keys": [
      "angela (tia da noiva)",
      "angela"
    ]
  },
  {
    "group_id": 13,
    "list": "Julia",
    "principal_raw": "Lucas (primo da noiva)",
    "principal_trim": "Lucas (primo da noiva)",
    "principal_key": "lucas (primo da noiva)",
    "members_raw": [
      "Acompanhante de Lucas"
    ],
    "group_raw": "Lucas (primo da noiva)\nAcompanhante de Lucas",
    "group_hash": "425639d486dd",
    "member_count": 2,
    "principal_base_raw": "Lucas",
    "principal_base_key": "lucas",
    "principal_search_keys": [
      "lucas (primo da noiva)",
      "lucas"
    ]
  },
  {
    "group_id": 14,
    "list": "Julia",
    "principal_raw": "Solange (tia da noiva)",
    "principal_trim": "Solange (tia da noiva)",
    "principal_key": "solange (tia da noiva)",
    "members_raw": [
      "Keyla (prima da noiva)"
    ],
    "group_raw": "Solange (tia da noiva)\nKeyla (prima da noiva)",
    "group_hash": "750e13bdfcba",
    "member_count": 2,
    "principal_base_raw": "Solange",
    "principal_base_key": "solange",
    "principal_search_keys": [
      "solange (tia da noiva)",
      "solange"
    ]
  },
  {
    "group_id": 15,
    "list": "Julia",
    "principal_raw": "Kisley (prima da noiva)",
    "principal_trim": "Kisley (prima da noiva)",
    "principal_key": "kisley (prima da noiva)",
    "members_raw": [
      "Ícaro (marido de Kisley)"
    ],
    "group_raw": "Kisley (prima da noiva)\nÍcaro (marido de Kisley)",
    "group_hash": "e37d66a18840",
    "member_count": 2,
    "principal_base_raw": "Kisley",
    "principal_base_key": "kisley",
    "principal_search_keys": [
      "kisley (prima da noiva)",
      "kisley"
    ]
  },
  {
    "group_id": 16,
    "list": "Julia",
    "principal_raw": "Luís Carlos (tio da noiva)",
    "principal_trim": "Luís Carlos (tio da noiva)",
    "principal_key": "luis carlos (tio da noiva)",
    "members_raw": [
      "Bianca (tia da noiva)",
      "Gabriel (primo da noiva)",
      "Arthur (primo da noiva)",
      "Enzo (primo da noiva)"
    ],
    "group_raw": "Luís Carlos (tio da noiva)\nBianca (tia da noiva)\nGabriel (primo da noiva)\nArthur (primo da noiva)\nEnzo (primo da noiva)",
    "group_hash": "64f42944f6ea",
    "member_count": 5,
    "principal_base_raw": "Luís Carlos",
    "principal_base_key": "luis carlos",
    "principal_search_keys": [
      "luis carlos (tio da noiva)",
      "luis carlos"
    ]
  },
  {
    "group_id": 17,
    "list": "Julia",
    "principal_raw": "Wallace de Mello",
    "principal_trim": "Wallace de Mello",
    "principal_key": "wallace de mello",
    "members_raw": [
      "Luciana (esposa de Wallace)",
      "Caleb (filho de Wallace)"
    ],
    "group_raw": "Wallace de Mello\nLuciana (esposa de Wallace)\nCaleb (filho de Wallace)",
    "group_hash": "15bcb6417078",
    "member_count": 3,
    "principal_base_raw": "Wallace de Mello",
    "principal_base_key": "wallace de mello",
    "principal_search_keys": [
      "wallace de mello"
    ]
  },
  {
    "group_id": 18,
    "list": "Julia",
    "principal_raw": "Devair",
    "principal_trim": "Devair",
    "principal_key": "devair",
    "members_raw": [
      "Ana (esposa de Devair)",
      "Rafael (filho de Devair)"
    ],
    "group_raw": "Devair\nAna (esposa de Devair)\nRafael (filho de Devair)",
    "group_hash": "9876ecf3fc19",
    "member_count": 3,
    "principal_base_raw": "Devair",
    "principal_base_key": "devair",
    "principal_search_keys": [
      "devair"
    ]
  },
  {
    "group_id": 19,
    "list": "Julia",
    "principal_raw": "Bianca Vasti",
    "principal_trim": "Bianca Vasti",
    "principal_key": "bianca vasti",
    "members_raw": [
      "Rael (filho de Bianca Vasti)"
    ],
    "group_raw": "Bianca Vasti\nRael (filho de Bianca Vasti)",
    "group_hash": "a4cd5d2faf9b",
    "member_count": 2,
    "principal_base_raw": "Bianca Vasti",
    "principal_base_key": "bianca vasti",
    "principal_search_keys": [
      "bianca vasti"
    ]
  },
  {
    "group_id": 20,
    "list": "Julia",
    "principal_raw": "Victoria Jerônimo",
    "principal_trim": "Victoria Jerônimo",
    "principal_key": "victoria jeronimo",
    "members_raw": [
      "Marido de Victoria Jerônimo"
    ],
    "group_raw": "Victoria Jerônimo\nMarido de Victoria Jerônimo",
    "group_hash": "c73ac1d7f4cd",
    "member_count": 2,
    "principal_base_raw": "Victoria Jerônimo",
    "principal_base_key": "victoria jeronimo",
    "principal_search_keys": [
      "victoria jeronimo"
    ]
  },
  {
    "group_id": 21,
    "list": "Julia",
    "principal_raw": "Eliana Soares",
    "principal_trim": "Eliana Soares",
    "principal_key": "eliana soares",
    "members_raw": [
      "Messias Thiago"
    ],
    "group_raw": "Eliana Soares\nMessias Thiago",
    "group_hash": "f87f609fa9ee",
    "member_count": 2,
    "principal_base_raw": "Eliana Soares",
    "principal_base_key": "eliana soares",
    "principal_search_keys": [
      "eliana soares"
    ]
  },
  {
    "group_id": 22,
    "list": "Julia",
    "principal_raw": "Yago Brandão (pastor)",
    "principal_trim": "Yago Brandão (pastor)",
    "principal_key": "yago brandao (pastor)",
    "members_raw": [
      "Larissa Brandão (pastora)"
    ],
    "group_raw": "Yago Brandão (pastor)\nLarissa Brandão (pastora)",
    "group_hash": "c2869a0d7280",
    "member_count": 2,
    "principal_base_raw": "Yago Brandão",
    "principal_base_key": "yago brandao",
    "principal_search_keys": [
      "yago brandao (pastor)",
      "yago brandao"
    ]
  },
  {
    "group_id": 23,
    "list": "Julia",
    "principal_raw": "Tiago Inacio (pastor)",
    "principal_trim": "Tiago Inacio (pastor)",
    "principal_key": "tiago inacio (pastor)",
    "members_raw": [
      "Samantha Inacio (pastora)",
      "Levi (filho de Tiago Inacio)",
      "Samuel (filho de Tiago Inacio)"
    ],
    "group_raw": "Tiago Inacio (pastor)\nSamantha Inacio (pastora)\nLevi (filho de Tiago Inacio)\nSamuel (filho de Tiago Inacio)",
    "group_hash": "bee3d12b8cfe",
    "member_count": 4,
    "principal_base_raw": "Tiago Inacio",
    "principal_base_key": "tiago inacio",
    "principal_search_keys": [
      "tiago inacio (pastor)",
      "tiago inacio"
    ]
  },
  {
    "group_id": 24,
    "list": "Julia",
    "principal_raw": "Miqueias",
    "principal_trim": "Miqueias",
    "principal_key": "miqueias",
    "members_raw": [
      "Ingridi",
      "Abigail (filha de Ingridi e Miqueias)"
    ],
    "group_raw": "Miqueias\nIngridi\nAbigail (filha de Ingridi e Miqueias)",
    "group_hash": "6f55cd7d17be",
    "member_count": 3,
    "principal_base_raw": "Miqueias",
    "principal_base_key": "miqueias",
    "principal_search_keys": [
      "miqueias"
    ]
  },
  {
    "group_id": 25,
    "list": "Julia",
    "principal_raw": "Eliana (família)",
    "principal_trim": "Eliana (família)",
    "principal_key": "eliana (familia)",
    "members_raw": [
      "Debora (família)"
    ],
    "group_raw": "Eliana (família)\nDebora (família)",
    "group_hash": "215babc1ca12",
    "member_count": 2,
    "principal_base_raw": "Eliana",
    "principal_base_key": "eliana",
    "principal_search_keys": [
      "eliana (familia)",
      "eliana"
    ]
  },
  {
    "group_id": 26,
    "list": "Julia",
    "principal_raw": "Milene Domingos",
    "principal_trim": "Milene Domingos",
    "principal_key": "milene domingos",
    "members_raw": [
      "Islam Pereira",
      "Ana Sophia"
    ],
    "group_raw": "Milene Domingos\nIslam Pereira\nAna Sophia",
    "group_hash": "cce533ced442",
    "member_count": 3,
    "principal_base_raw": "Milene Domingos",
    "principal_base_key": "milene domingos",
    "principal_search_keys": [
      "milene domingos"
    ]
  },
  {
    "group_id": 27,
    "list": "Julia",
    "principal_raw": "Edilsom",
    "principal_trim": "Edilsom",
    "principal_key": "edilsom",
    "members_raw": [
      "Fatima (mãe de Gabriel Willian)",
      "Gabriel Willian",
      "Bianca Andrade (noiva de Gabriel Willian)"
    ],
    "group_raw": "Edilsom\nFatima (mãe de Gabriel Willian)\nGabriel Willian\nBianca Andrade (noiva de Gabriel Willian)",
    "group_hash": "30cbfffffb7e",
    "member_count": 4,
    "principal_base_raw": "Edilsom",
    "principal_base_key": "edilsom",
    "principal_search_keys": [
      "edilsom"
    ]
  },
  {
    "group_id": 28,
    "list": "Julia",
    "principal_raw": "Tiago (marido de Adriana)",
    "principal_trim": "Tiago (marido de Adriana)",
    "principal_key": "tiago (marido de adriana)",
    "members_raw": [
      "Adriana (esposa de Tiago)",
      "Isaque (filho de Adriana)",
      "Mariana (filha de Adriana)",
      "Noah (filho de Adriana)"
    ],
    "group_raw": "Tiago (marido de Adriana)\nAdriana (esposa de Tiago)\nIsaque (filho de Adriana)\nMariana (filha de Adriana)\nNoah (filho de Adriana)",
    "group_hash": "57800dc1d850",
    "member_count": 5,
    "principal_base_raw": "Tiago",
    "principal_base_key": "tiago",
    "principal_search_keys": [
      "tiago (marido de adriana)",
      "tiago"
    ]
  },
  {
    "group_id": 29,
    "list": "Julia",
    "principal_raw": "Adrielly",
    "principal_trim": "Adrielly",
    "principal_key": "adrielly",
    "members_raw": [
      "Irmã",
      "Sobrinha"
    ],
    "group_raw": "Adrielly\nIrmã\nSobrinha",
    "group_hash": "520383a472ad",
    "member_count": 3,
    "principal_base_raw": "Adrielly",
    "principal_base_key": "adrielly",
    "principal_search_keys": [
      "adrielly"
    ]
  },
  {
    "group_id": 30,
    "list": "Julia",
    "principal_raw": "Jack",
    "principal_trim": "Jack",
    "principal_key": "jack",
    "members_raw": [
      "Edimilson",
      "Rafaela",
      "Marido (nome não informado)"
    ],
    "group_raw": "Jack\nEdimilson\nRafaela\nMarido (nome não informado)",
    "group_hash": "46916cdf58b3",
    "member_count": 4,
    "principal_base_raw": "Jack",
    "principal_base_key": "jack",
    "principal_search_keys": [
      "jack"
    ]
  },
  {
    "group_id": 31,
    "list": "Julia",
    "principal_raw": "Samuel (esposo de Larissa)",
    "principal_trim": "Samuel (esposo de Larissa)",
    "principal_key": "samuel (esposo de larissa)",
    "members_raw": [
      "Larissa (esposa de Samuel)",
      "Eloah (filha de Larissa)",
      "Alice (filha de Larissa)"
    ],
    "group_raw": "Samuel (esposo de Larissa)\nLarissa (esposa de Samuel)\nEloah (filha de Larissa)\nAlice (filha de Larissa)",
    "group_hash": "4b227b0be131",
    "member_count": 4,
    "principal_base_raw": "Samuel",
    "principal_base_key": "samuel",
    "principal_search_keys": [
      "samuel (esposo de larissa)",
      "samuel"
    ]
  },
  {
    "group_id": 32,
    "list": "Julia",
    "principal_raw": "Jackeline Nunes",
    "principal_trim": "Jackeline Nunes",
    "principal_key": "jackeline nunes",
    "members_raw": [
      "Julia (filha de Jackeline)",
      "Rafael Tavares (marido de Jackeline)"
    ],
    "group_raw": "Jackeline Nunes\nJulia (filha de Jackeline)\nRafael Tavares (marido de Jackeline)",
    "group_hash": "eeabb4b142d4",
    "member_count": 3,
    "principal_base_raw": "Jackeline Nunes",
    "principal_base_key": "jackeline nunes",
    "principal_search_keys": [
      "jackeline nunes"
    ]
  },
  {
    "group_id": 33,
    "list": "Julia",
    "principal_raw": "Thaise",
    "principal_trim": "Thaise",
    "principal_key": "thaise",
    "members_raw": [
      "Diogo",
      "Manu (filha de Thaise)"
    ],
    "group_raw": "Thaise\nDiogo\nManu (filha de Thaise)",
    "group_hash": "9a7de0b68be0",
    "member_count": 3,
    "principal_base_raw": "Thaise",
    "principal_base_key": "thaise",
    "principal_search_keys": [
      "thaise"
    ]
  },
  {
    "group_id": 34,
    "list": "Julia",
    "principal_raw": "Mateus (padrinho)",
    "principal_trim": "Mateus (padrinho)",
    "principal_key": "mateus (padrinho)",
    "members_raw": [
      "Fernanda (madrinha)",
      "Helena",
      "Aurora"
    ],
    "group_raw": "Mateus (padrinho)\nFernanda (madrinha)\nHelena\nAurora",
    "group_hash": "4706538b2df0",
    "member_count": 4,
    "principal_base_raw": "Mateus",
    "principal_base_key": "mateus",
    "principal_search_keys": [
      "mateus (padrinho)",
      "mateus"
    ]
  },
  {
    "group_id": 35,
    "list": "Julia",
    "principal_raw": "Isabelle",
    "principal_trim": "Isabelle",
    "principal_key": "isabelle",
    "members_raw": [
      "Elaine",
      "Gabriele (irmã de Isabelle)"
    ],
    "group_raw": "Isabelle\nElaine\nGabriele (irmã de Isabelle)",
    "group_hash": "734360fe0920",
    "member_count": 3,
    "principal_base_raw": "Isabelle",
    "principal_base_key": "isabelle",
    "principal_search_keys": [
      "isabelle"
    ]
  },
  {
    "group_id": 36,
    "list": "Julia",
    "principal_raw": "Silvia",
    "principal_trim": "Silvia",
    "principal_key": "silvia",
    "members_raw": [
      "Marido de Silvia",
      "José (filho de Silvia)",
      "Ana Clara (filha de Silvia)"
    ],
    "group_raw": "Silvia\nMarido de Silvia\nJosé (filho de Silvia)\nAna Clara (filha de Silvia)",
    "group_hash": "2edd6a5b49dc",
    "member_count": 4,
    "principal_base_raw": "Silvia",
    "principal_base_key": "silvia",
    "principal_search_keys": [
      "silvia"
    ]
  },
  {
    "group_id": 37,
    "list": "Julia",
    "principal_raw": "Luana Chinquini",
    "principal_trim": "Luana Chinquini",
    "principal_key": "luana chinquini",
    "members_raw": [
      "Marido de Luana Chinquini",
      "Eloá Chinquini"
    ],
    "group_raw": "Luana Chinquini\nMarido de Luana Chinquini\nEloá Chinquini",
    "group_hash": "4d72dd9881b4",
    "member_count": 3,
    "principal_base_raw": "Luana Chinquini",
    "principal_base_key": "luana chinquini",
    "principal_search_keys": [
      "luana chinquini"
    ]
  },
  {
    "group_id": 38,
    "list": "Jesse",
    "principal_raw": "Jane Silva ",
    "principal_trim": "Jane Silva",
    "principal_key": "jane silva",
    "members_raw": [],
    "group_raw": "Jane Silva ",
    "group_hash": "8e3b795db434",
    "member_count": 1,
    "principal_base_raw": "Jane Silva",
    "principal_base_key": "jane silva",
    "principal_search_keys": [
      "jane silva"
    ]
  },
  {
    "group_id": 39,
    "list": "Jesse",
    "principal_raw": "Antonio Marcos",
    "principal_trim": "Antonio Marcos",
    "principal_key": "antonio marcos",
    "members_raw": [
      "Edilaine Albuquerque ",
      "Anne Louise",
      "Andre Luiz"
    ],
    "group_raw": "Antonio Marcos\nEdilaine Albuquerque \nAnne Louise\nAndre Luiz",
    "group_hash": "b261e2b81ac2",
    "member_count": 4,
    "principal_base_raw": "Antonio Marcos",
    "principal_base_key": "antonio marcos",
    "principal_search_keys": [
      "antonio marcos"
    ]
  },
  {
    "group_id": 40,
    "list": "Jesse",
    "principal_raw": "Dona jo",
    "principal_trim": "Dona jo",
    "principal_key": "dona jo",
    "members_raw": [
      "Edson"
    ],
    "group_raw": "Dona jo\nEdson",
    "group_hash": "4b27267b1d8f",
    "member_count": 2,
    "principal_base_raw": "Dona jo",
    "principal_base_key": "dona jo",
    "principal_search_keys": [
      "dona jo"
    ]
  },
  {
    "group_id": 41,
    "list": "Jesse",
    "principal_raw": "Josefa (Avó do Noivo)",
    "principal_trim": "Josefa (Avó do Noivo)",
    "principal_key": "josefa (avo do noivo)",
    "members_raw": [
      "Marido"
    ],
    "group_raw": "Josefa (Avó do Noivo)\nMarido",
    "group_hash": "fba671c1ef3d",
    "member_count": 2,
    "principal_base_raw": "Josefa",
    "principal_base_key": "josefa",
    "principal_search_keys": [
      "josefa (avo do noivo)",
      "josefa"
    ]
  },
  {
    "group_id": 42,
    "list": "Jesse",
    "principal_raw": "Natal ",
    "principal_trim": "Natal",
    "principal_key": "natal",
    "members_raw": [
      "Liede "
    ],
    "group_raw": "Natal \nLiede ",
    "group_hash": "ed6ecf2221e5",
    "member_count": 2,
    "principal_base_raw": "Natal",
    "principal_base_key": "natal",
    "principal_search_keys": [
      "natal"
    ]
  },
  {
    "group_id": 43,
    "list": "Jesse",
    "principal_raw": "Neide",
    "principal_trim": "Neide",
    "principal_key": "neide",
    "members_raw": [
      "José Roberto",
      "Roberta"
    ],
    "group_raw": "Neide\nJosé Roberto\nRoberta",
    "group_hash": "5eca6a9c2a91",
    "member_count": 3,
    "principal_base_raw": "Neide",
    "principal_base_key": "neide",
    "principal_search_keys": [
      "neide"
    ]
  },
  {
    "group_id": 44,
    "list": "Jesse",
    "principal_raw": "Gabriele",
    "principal_trim": "Gabriele",
    "principal_key": "gabriele",
    "members_raw": [
      "Esposo"
    ],
    "group_raw": "Gabriele\nEsposo",
    "group_hash": "440483d4e832",
    "member_count": 2,
    "principal_base_raw": "Gabriele",
    "principal_base_key": "gabriele",
    "principal_search_keys": [
      "gabriele"
    ]
  },
  {
    "group_id": 45,
    "list": "Jesse",
    "principal_raw": "Driele",
    "principal_trim": "Driele",
    "principal_key": "driele",
    "members_raw": [
      "Esposo"
    ],
    "group_raw": "Driele\nEsposo",
    "group_hash": "593ec437bae5",
    "member_count": 2,
    "principal_base_raw": "Driele",
    "principal_base_key": "driele",
    "principal_search_keys": [
      "driele"
    ]
  },
  {
    "group_id": 46,
    "list": "Jesse",
    "principal_raw": "Fernanda",
    "principal_trim": "Fernanda",
    "principal_key": "fernanda",
    "members_raw": [
      "Careca",
      "Ray"
    ],
    "group_raw": "Fernanda\nCareca\nRay",
    "group_hash": "815b07327329",
    "member_count": 3,
    "principal_base_raw": "Fernanda",
    "principal_base_key": "fernanda",
    "principal_search_keys": [
      "fernanda"
    ]
  },
  {
    "group_id": 47,
    "list": "Jesse",
    "principal_raw": "Ediana ",
    "principal_trim": "Ediana",
    "principal_key": "ediana",
    "members_raw": [
      "Henrique ",
      "Ravi "
    ],
    "group_raw": "Ediana \nHenrique \nRavi ",
    "group_hash": "7aaaac1a6204",
    "member_count": 3,
    "principal_base_raw": "Ediana",
    "principal_base_key": "ediana",
    "principal_search_keys": [
      "ediana"
    ]
  },
  {
    "group_id": 48,
    "list": "Jesse",
    "principal_raw": "Vanessa",
    "principal_trim": "Vanessa",
    "principal_key": "vanessa",
    "members_raw": [
      "Vagner",
      "Heitor ",
      "Oliver "
    ],
    "group_raw": "Vanessa\nVagner\nHeitor \nOliver ",
    "group_hash": "e7da37a31774",
    "member_count": 4,
    "principal_base_raw": "Vanessa",
    "principal_base_key": "vanessa",
    "principal_search_keys": [
      "vanessa"
    ]
  },
  {
    "group_id": 49,
    "list": "Jesse",
    "principal_raw": "Ana cristina ",
    "principal_trim": "Ana cristina",
    "principal_key": "ana cristina",
    "members_raw": [
      "Esposo",
      "Filho "
    ],
    "group_raw": "Ana cristina \nEsposo\nFilho ",
    "group_hash": "b4951bdf979f",
    "member_count": 3,
    "principal_base_raw": "Ana cristina",
    "principal_base_key": "ana cristina",
    "principal_search_keys": [
      "ana cristina"
    ]
  },
  {
    "group_id": 50,
    "list": "Jesse",
    "principal_raw": "Iti ",
    "principal_trim": "Iti",
    "principal_key": "iti",
    "members_raw": [
      "Lucas Santos"
    ],
    "group_raw": "Iti \nLucas Santos",
    "group_hash": "460e7b94db12",
    "member_count": 2,
    "principal_base_raw": "Iti",
    "principal_base_key": "iti",
    "principal_search_keys": [
      "iti"
    ]
  },
  {
    "group_id": 51,
    "list": "Jesse",
    "principal_raw": "Regiane ",
    "principal_trim": "Regiane",
    "principal_key": "regiane",
    "members_raw": [],
    "group_raw": "Regiane ",
    "group_hash": "9f3ffbf0925b",
    "member_count": 1,
    "principal_base_raw": "Regiane",
    "principal_base_key": "regiane",
    "principal_search_keys": [
      "regiane"
    ]
  },
  {
    "group_id": 52,
    "list": "Jesse",
    "principal_raw": "Milas",
    "principal_trim": "Milas",
    "principal_key": "milas",
    "members_raw": [
      "Paula ",
      "Gabriel "
    ],
    "group_raw": "Milas\nPaula \nGabriel ",
    "group_hash": "474a3837f144",
    "member_count": 3,
    "principal_base_raw": "Milas",
    "principal_base_key": "milas",
    "principal_search_keys": [
      "milas"
    ]
  },
  {
    "group_id": 53,
    "list": "Jesse",
    "principal_raw": "Claudionor ",
    "principal_trim": "Claudionor",
    "principal_key": "claudionor",
    "members_raw": [
      "Eliene",
      "James"
    ],
    "group_raw": "Claudionor \nEliene\nJames",
    "group_hash": "e58c3af2e518",
    "member_count": 3,
    "principal_base_raw": "Claudionor",
    "principal_base_key": "claudionor",
    "principal_search_keys": [
      "claudionor"
    ]
  },
  {
    "group_id": 54,
    "list": "Jesse",
    "principal_raw": "Edileusa",
    "principal_trim": "Edileusa",
    "principal_key": "edileusa",
    "members_raw": [
      "Adriano"
    ],
    "group_raw": "Edileusa\nAdriano",
    "group_hash": "7edd921bcf13",
    "member_count": 2,
    "principal_base_raw": "Edileusa",
    "principal_base_key": "edileusa",
    "principal_search_keys": [
      "edileusa"
    ]
  },
  {
    "group_id": 55,
    "list": "Jesse",
    "principal_raw": "Graziele\nDevoneide",
    "principal_trim": "Graziele\nDevoneide",
    "principal_key": "graziele devoneide",
    "members_raw": [
      "Florisvaldo ",
      "Enzo",
      "Estevão"
    ],
    "group_raw": "Graziele\nDevoneide\nFlorisvaldo \nEnzo\nEstevão",
    "group_hash": "d58e73675f43",
    "member_count": 4,
    "principal_base_raw": "Graziele\nDevoneide",
    "principal_base_key": "graziele devoneide",
    "principal_search_keys": [
      "graziele devoneide"
    ]
  },
  {
    "group_id": 56,
    "list": "Jesse",
    "principal_raw": "Custodio ",
    "principal_trim": "Custodio",
    "principal_key": "custodio",
    "members_raw": [],
    "group_raw": "Custodio ",
    "group_hash": "ba5633d1f53c",
    "member_count": 1,
    "principal_base_raw": "Custodio",
    "principal_base_key": "custodio",
    "principal_search_keys": [
      "custodio"
    ]
  },
  {
    "group_id": 57,
    "list": "Jesse",
    "principal_raw": "Genivalda ",
    "principal_trim": "Genivalda",
    "principal_key": "genivalda",
    "members_raw": [
      "Vinicius",
      "Calebe"
    ],
    "group_raw": "Genivalda \nVinicius\nCalebe",
    "group_hash": "58a6a7102646",
    "member_count": 3,
    "principal_base_raw": "Genivalda",
    "principal_base_key": "genivalda",
    "principal_search_keys": [
      "genivalda"
    ]
  },
  {
    "group_id": 58,
    "list": "Jesse",
    "principal_raw": "Carmen ",
    "principal_trim": "Carmen",
    "principal_key": "carmen",
    "members_raw": [
      "Erisvaldo marido"
    ],
    "group_raw": "Carmen \nErisvaldo marido",
    "group_hash": "c585920adc10",
    "member_count": 2,
    "principal_base_raw": "Carmen",
    "principal_base_key": "carmen",
    "principal_search_keys": [
      "carmen"
    ]
  },
  {
    "group_id": 59,
    "list": "Jesse",
    "principal_raw": "Ederson Dreon",
    "principal_trim": "Ederson Dreon",
    "principal_key": "ederson dreon",
    "members_raw": [
      "Joyce ",
      "Benicio (F)",
      "Maria Cecilia (F)",
      "Filho 3 (F)"
    ],
    "group_raw": "Ederson Dreon\nJoyce \nBenicio (F)\nMaria Cecilia (F)\nFilho 3 (F)",
    "group_hash": "615acf402ea1",
    "member_count": 5,
    "principal_base_raw": "Ederson Dreon",
    "principal_base_key": "ederson dreon",
    "principal_search_keys": [
      "ederson dreon"
    ]
  },
  {
    "group_id": 60,
    "list": "Jesse",
    "principal_raw": "Maurivan Dreon",
    "principal_trim": "Maurivan Dreon",
    "principal_key": "maurivan dreon",
    "members_raw": [
      "Michele"
    ],
    "group_raw": "Maurivan Dreon\nMichele",
    "group_hash": "e0afaf0fe06c",
    "member_count": 2,
    "principal_base_raw": "Maurivan Dreon",
    "principal_base_key": "maurivan dreon",
    "principal_search_keys": [
      "maurivan dreon"
    ]
  },
  {
    "group_id": 61,
    "list": "Jesse",
    "principal_raw": "Davi Messias",
    "principal_trim": "Davi Messias",
    "principal_key": "davi messias",
    "members_raw": [
      "Bianca"
    ],
    "group_raw": "Davi Messias\nBianca",
    "group_hash": "04f8b0009176",
    "member_count": 2,
    "principal_base_raw": "Davi Messias",
    "principal_base_key": "davi messias",
    "principal_search_keys": [
      "davi messias"
    ]
  },
  {
    "group_id": 62,
    "list": "Jesse",
    "principal_raw": "Debora",
    "principal_trim": "Debora",
    "principal_key": "debora",
    "members_raw": [
      "Tom",
      "Filha 1 (F)",
      "Filha 2 (F)",
      "Filha 3 (F)"
    ],
    "group_raw": "Debora\nTom\nFilha 1 (F)\nFilha 2 (F)\nFilha 3 (F)",
    "group_hash": "a7120f25d1dc",
    "member_count": 5,
    "principal_base_raw": "Debora",
    "principal_base_key": "debora",
    "principal_search_keys": [
      "debora"
    ]
  },
  {
    "group_id": 63,
    "list": "Jesse",
    "principal_raw": "Karina ",
    "principal_trim": "Karina",
    "principal_key": "karina",
    "members_raw": [],
    "group_raw": "Karina ",
    "group_hash": "92d5483f2f5e",
    "member_count": 1,
    "principal_base_raw": "Karina",
    "principal_base_key": "karina",
    "principal_search_keys": [
      "karina"
    ]
  },
  {
    "group_id": 64,
    "list": "Jesse",
    "principal_raw": "Leticia ",
    "principal_trim": "Leticia",
    "principal_key": "leticia",
    "members_raw": [],
    "group_raw": "Leticia ",
    "group_hash": "5d046892fc87",
    "member_count": 1,
    "principal_base_raw": "Leticia",
    "principal_base_key": "leticia",
    "principal_search_keys": [
      "leticia"
    ]
  },
  {
    "group_id": 65,
    "list": "Jesse",
    "principal_raw": "Bigua",
    "principal_trim": "Bigua",
    "principal_key": "bigua",
    "members_raw": [
      "Esposa de Bigua"
    ],
    "group_raw": "Bigua\nEsposa de Bigua",
    "group_hash": "f2cf02e58fea",
    "member_count": 2,
    "principal_base_raw": "Bigua",
    "principal_base_key": "bigua",
    "principal_search_keys": [
      "bigua"
    ]
  },
  {
    "group_id": 66,
    "list": "Jesse",
    "principal_raw": "Raquel",
    "principal_trim": "Raquel",
    "principal_key": "raquel",
    "members_raw": [
      "José Lemos",
      "Filho 1 (F) ",
      "Filho 2 (F)"
    ],
    "group_raw": "Raquel\nJosé Lemos\nFilho 1 (F) \nFilho 2 (F)",
    "group_hash": "5aa5d3312303",
    "member_count": 4,
    "principal_base_raw": "Raquel",
    "principal_base_key": "raquel",
    "principal_search_keys": [
      "raquel"
    ]
  },
  {
    "group_id": 67,
    "list": "Jesse",
    "principal_raw": "Juh Santos",
    "principal_trim": "Juh Santos",
    "principal_key": "juh santos",
    "members_raw": [
      "Welleson"
    ],
    "group_raw": "Juh Santos\nWelleson",
    "group_hash": "a2aca0fbe106",
    "member_count": 2,
    "principal_base_raw": "Juh Santos",
    "principal_base_key": "juh santos",
    "principal_search_keys": [
      "juh santos"
    ]
  },
  {
    "group_id": 68,
    "list": "Jesse",
    "principal_raw": "Jairo",
    "principal_trim": "Jairo",
    "principal_key": "jairo",
    "members_raw": [
      "Francine ",
      "Enzo",
      "Filha 2"
    ],
    "group_raw": "Jairo\nFrancine \nEnzo\nFilha 2",
    "group_hash": "6ac6bc97669e",
    "member_count": 4,
    "principal_base_raw": "Jairo",
    "principal_base_key": "jairo",
    "principal_search_keys": [
      "jairo"
    ]
  },
  {
    "group_id": 69,
    "list": "Jesse",
    "principal_raw": "Alison",
    "principal_trim": "Alison",
    "principal_key": "alison",
    "members_raw": [
      "Filho 1 (F)"
    ],
    "group_raw": "Alison\nFilho 1 (F)",
    "group_hash": "9943d7c23531",
    "member_count": 2,
    "principal_base_raw": "Alison",
    "principal_base_key": "alison",
    "principal_search_keys": [
      "alison"
    ]
  },
  {
    "group_id": 70,
    "list": "Jesse",
    "principal_raw": "Christian ",
    "principal_trim": "Christian",
    "principal_key": "christian",
    "members_raw": [
      "Esposa",
      "Filha"
    ],
    "group_raw": "Christian \nEsposa\nFilha",
    "group_hash": "566f2879f7ca",
    "member_count": 3,
    "principal_base_raw": "Christian",
    "principal_base_key": "christian",
    "principal_search_keys": [
      "christian"
    ]
  },
  {
    "group_id": 71,
    "list": "Jesse",
    "principal_raw": "Lucas",
    "principal_trim": "Lucas",
    "principal_key": "lucas",
    "members_raw": [
      "Esposa Lucas",
      "Filho 1 (F)",
      "Filho 2 (F)"
    ],
    "group_raw": "Lucas\nEsposa Lucas\nFilho 1 (F)\nFilho 2 (F)",
    "group_hash": "35e5a4fdea2f",
    "member_count": 4,
    "principal_base_raw": "Lucas",
    "principal_base_key": "lucas",
    "principal_search_keys": [
      "lucas"
    ]
  },
  {
    "group_id": 72,
    "list": "Jesse",
    "principal_raw": "Rafael",
    "principal_trim": "Rafael",
    "principal_key": "rafael",
    "members_raw": [
      "Esposa do Rafael",
      "Filho 1 (F)",
      "Filho 2 (F)"
    ],
    "group_raw": "Rafael\nEsposa do Rafael\nFilho 1 (F)\nFilho 2 (F)",
    "group_hash": "fec028c6ebbe",
    "member_count": 4,
    "principal_base_raw": "Rafael",
    "principal_base_key": "rafael",
    "principal_search_keys": [
      "rafael"
    ]
  },
  {
    "group_id": 73,
    "list": "Jesse",
    "principal_raw": "Jose carlos ",
    "principal_trim": "Jose carlos",
    "principal_key": "jose carlos",
    "members_raw": [
      "Esposa do Jose Carlos "
    ],
    "group_raw": "Jose carlos \nEsposa do Jose Carlos ",
    "group_hash": "1324a294e0bd",
    "member_count": 2,
    "principal_base_raw": "Jose carlos",
    "principal_base_key": "jose carlos",
    "principal_search_keys": [
      "jose carlos"
    ]
  },
  {
    "group_id": 74,
    "list": "Jesse",
    "principal_raw": "Lucas",
    "principal_trim": "Lucas",
    "principal_key": "lucas",
    "members_raw": [
      "Esposa de Lucas",
      "Filho 1"
    ],
    "group_raw": "Lucas\nEsposa de Lucas\nFilho 1",
    "group_hash": "0653e3a40572",
    "member_count": 3,
    "principal_base_raw": "Lucas",
    "principal_base_key": "lucas",
    "principal_search_keys": [
      "lucas"
    ]
  },
  {
    "group_id": 75,
    "list": "Jesse",
    "principal_raw": "Maurilio",
    "principal_trim": "Maurilio",
    "principal_key": "maurilio",
    "members_raw": [
      "Esposa de Maurilio"
    ],
    "group_raw": "Maurilio\nEsposa de Maurilio",
    "group_hash": "cc8affaa3931",
    "member_count": 2,
    "principal_base_raw": "Maurilio",
    "principal_base_key": "maurilio",
    "principal_search_keys": [
      "maurilio"
    ]
  },
  {
    "group_id": 76,
    "list": "Jesse",
    "principal_raw": "Jessica",
    "principal_trim": "Jessica",
    "principal_key": "jessica",
    "members_raw": [],
    "group_raw": "Jessica",
    "group_hash": "15d834b328bb",
    "member_count": 1,
    "principal_base_raw": "Jessica",
    "principal_base_key": "jessica",
    "principal_search_keys": [
      "jessica"
    ]
  },
  {
    "group_id": 77,
    "list": "Jesse",
    "principal_raw": "Zefinha ",
    "principal_trim": "Zefinha",
    "principal_key": "zefinha",
    "members_raw": [],
    "group_raw": "Zefinha ",
    "group_hash": "f9946e36d7b2",
    "member_count": 1,
    "principal_base_raw": "Zefinha",
    "principal_base_key": "zefinha",
    "principal_search_keys": [
      "zefinha"
    ]
  },
  {
    "group_id": 78,
    "list": "Jesse",
    "principal_raw": "Deise",
    "principal_trim": "Deise",
    "principal_key": "deise",
    "members_raw": [
      "Marido"
    ],
    "group_raw": "Deise\nMarido",
    "group_hash": "82741b68aa35",
    "member_count": 2,
    "principal_base_raw": "Deise",
    "principal_base_key": "deise",
    "principal_search_keys": [
      "deise"
    ]
  },
  {
    "group_id": 79,
    "list": "Jesse",
    "principal_raw": "Judson",
    "principal_trim": "Judson",
    "principal_key": "judson",
    "members_raw": [
      "Jaison"
    ],
    "group_raw": "Judson\nJaison",
    "group_hash": "c6629396f181",
    "member_count": 2,
    "principal_base_raw": "Judson",
    "principal_base_key": "judson",
    "principal_search_keys": [
      "judson"
    ]
  },
  {
    "group_id": 80,
    "list": "Jesse",
    "principal_raw": "Irmão Zito",
    "principal_trim": "Irmão Zito",
    "principal_key": "irmao zito",
    "members_raw": [
      "Irmã Nilza"
    ],
    "group_raw": "Irmão Zito\nIrmã Nilza",
    "group_hash": "6cdd1e0fafae",
    "member_count": 2,
    "principal_base_raw": "Irmão Zito",
    "principal_base_key": "irmao zito",
    "principal_search_keys": [
      "irmao zito"
    ]
  },
  {
    "group_id": 81,
    "list": "Jesse",
    "principal_raw": "Nay",
    "principal_trim": "Nay",
    "principal_key": "nay",
    "members_raw": [
      "Esposa"
    ],
    "group_raw": "Nay\nEsposa",
    "group_hash": "560393a8f5ef",
    "member_count": 2,
    "principal_base_raw": "Nay",
    "principal_base_key": "nay",
    "principal_search_keys": [
      "nay"
    ]
  },
  {
    "group_id": 82,
    "list": "Jesse",
    "principal_raw": "Adrielly",
    "principal_trim": "Adrielly",
    "principal_key": "adrielly",
    "members_raw": [],
    "group_raw": "Adrielly",
    "group_hash": "dcdf2e8c6173",
    "member_count": 1,
    "principal_base_raw": "Adrielly",
    "principal_base_key": "adrielly",
    "principal_search_keys": [
      "adrielly"
    ]
  },
  {
    "group_id": 83,
    "list": "Jesse",
    "principal_raw": "Robson",
    "principal_trim": "Robson",
    "principal_key": "robson",
    "members_raw": [],
    "group_raw": "Robson",
    "group_hash": "4103b60089b1",
    "member_count": 1,
    "principal_base_raw": "Robson",
    "principal_base_key": "robson",
    "principal_search_keys": [
      "robson"
    ]
  },
  {
    "group_id": 84,
    "list": "Jesse",
    "principal_raw": "Jaqueline ",
    "principal_trim": "Jaqueline",
    "principal_key": "jaqueline",
    "members_raw": [
      "Edimilson",
      "Rafaela",
      "Novique"
    ],
    "group_raw": "Jaqueline \nEdimilson\nRafaela\nNovique",
    "group_hash": "881d0cea988e",
    "member_count": 4,
    "principal_base_raw": "Jaqueline",
    "principal_base_key": "jaqueline",
    "principal_search_keys": [
      "jaqueline"
    ]
  },
  {
    "group_id": 85,
    "list": "Jesse",
    "principal_raw": "Wesley ",
    "principal_trim": "Wesley",
    "principal_key": "wesley",
    "members_raw": [],
    "group_raw": "Wesley ",
    "group_hash": "2065489543cb",
    "member_count": 1,
    "principal_base_raw": "Wesley",
    "principal_base_key": "wesley",
    "principal_search_keys": [
      "wesley"
    ]
  },
  {
    "group_id": 86,
    "list": "Jesse",
    "principal_raw": "Gleyce",
    "principal_trim": "Gleyce",
    "principal_key": "gleyce",
    "members_raw": [
      "Loro",
      "Leandro",
      "Nicolas ",
      "Vini"
    ],
    "group_raw": "Gleyce\nLoro\nLeandro\nNicolas \nVini",
    "group_hash": "613f5513f46f",
    "member_count": 5,
    "principal_base_raw": "Gleyce",
    "principal_base_key": "gleyce",
    "principal_search_keys": [
      "gleyce"
    ]
  },
  {
    "group_id": 87,
    "list": "Jesse",
    "principal_raw": "Bruno ",
    "principal_trim": "Bruno",
    "principal_key": "bruno",
    "members_raw": [
      "Sarah ",
      "Sofia"
    ],
    "group_raw": "Bruno \nSarah \nSofia",
    "group_hash": "da30bb2dae97",
    "member_count": 3,
    "principal_base_raw": "Bruno",
    "principal_base_key": "bruno",
    "principal_search_keys": [
      "bruno"
    ]
  },
  {
    "group_id": 88,
    "list": "Jesse",
    "principal_raw": "Tião ",
    "principal_trim": "Tião",
    "principal_key": "tiao",
    "members_raw": [
      "Sabrina",
      "Clarisse"
    ],
    "group_raw": "Tião \nSabrina\nClarisse",
    "group_hash": "d55035708217",
    "member_count": 3,
    "principal_base_raw": "Tião",
    "principal_base_key": "tiao",
    "principal_search_keys": [
      "tiao"
    ]
  },
  {
    "group_id": 89,
    "list": "Jesse",
    "principal_raw": "Mariana ",
    "principal_trim": "Mariana",
    "principal_key": "mariana",
    "members_raw": [
      "Vinicius "
    ],
    "group_raw": "Mariana \nVinicius ",
    "group_hash": "d6776ec73b64",
    "member_count": 2,
    "principal_base_raw": "Mariana",
    "principal_base_key": "mariana",
    "principal_search_keys": [
      "mariana"
    ]
  },
  {
    "group_id": 90,
    "list": "Jesse",
    "principal_raw": "Giovana ",
    "principal_trim": "Giovana",
    "principal_key": "giovana",
    "members_raw": [
      "Romulo"
    ],
    "group_raw": "Giovana \nRomulo",
    "group_hash": "a30f107c26b2",
    "member_count": 2,
    "principal_base_raw": "Giovana",
    "principal_base_key": "giovana",
    "principal_search_keys": [
      "giovana"
    ]
  },
  {
    "group_id": 91,
    "list": "Jesse",
    "principal_raw": "Pedro Dias",
    "principal_trim": "Pedro Dias",
    "principal_key": "pedro dias",
    "members_raw": [
      "Laysa   "
    ],
    "group_raw": "Pedro Dias\nLaysa   ",
    "group_hash": "8a7ced028364",
    "member_count": 2,
    "principal_base_raw": "Pedro Dias",
    "principal_base_key": "pedro dias",
    "principal_search_keys": [
      "pedro dias"
    ]
  },
  {
    "group_id": 92,
    "list": "Jesse",
    "principal_raw": "Paulinho",
    "principal_trim": "Paulinho",
    "principal_key": "paulinho",
    "members_raw": [
      "Esposa",
      "Pablo "
    ],
    "group_raw": "Paulinho\nEsposa\nPablo ",
    "group_hash": "d12789040438",
    "member_count": 3,
    "principal_base_raw": "Paulinho",
    "principal_base_key": "paulinho",
    "principal_search_keys": [
      "paulinho"
    ]
  },
  {
    "group_id": 93,
    "list": "Jesse",
    "principal_raw": "Juliano ",
    "principal_trim": "Juliano",
    "principal_key": "juliano",
    "members_raw": [
      "Esposa"
    ],
    "group_raw": "Juliano \nEsposa",
    "group_hash": "587aa6f10383",
    "member_count": 2,
    "principal_base_raw": "Juliano",
    "principal_base_key": "juliano",
    "principal_search_keys": [
      "juliano"
    ]
  },
  {
    "group_id": 94,
    "list": "Jesse",
    "principal_raw": "Senhor Incrível",
    "principal_trim": "Senhor Incrível",
    "principal_key": "senhor incrivel",
    "members_raw": [
      "Esposa "
    ],
    "group_raw": "Senhor Incrível\nEsposa ",
    "group_hash": "6429917d46f9",
    "member_count": 2,
    "principal_base_raw": "Senhor Incrível",
    "principal_base_key": "senhor incrivel",
    "principal_search_keys": [
      "senhor incrivel"
    ]
  },
  {
    "group_id": 95,
    "list": "Jesse",
    "principal_raw": "John ",
    "principal_trim": "John",
    "principal_key": "john",
    "members_raw": [
      "Esposa",
      "Filho 1",
      "Filho 2"
    ],
    "group_raw": "John \nEsposa\nFilho 1\nFilho 2",
    "group_hash": "3d1d76c65670",
    "member_count": 4,
    "principal_base_raw": "John",
    "principal_base_key": "john",
    "principal_search_keys": [
      "john"
    ]
  },
  {
    "group_id": 96,
    "list": "Jesse",
    "principal_raw": "Cassio",
    "principal_trim": "Cassio",
    "principal_key": "cassio",
    "members_raw": [
      "Esposa",
      "Lucas ",
      "João",
      "Natan"
    ],
    "group_raw": "Cassio\nEsposa\nLucas \nJoão\nNatan",
    "group_hash": "4f7737d625db",
    "member_count": 5,
    "principal_base_raw": "Cassio",
    "principal_base_key": "cassio",
    "principal_search_keys": [
      "cassio"
    ]
  },
  {
    "group_id": 97,
    "list": "Jesse",
    "principal_raw": "Didi ",
    "principal_trim": "Didi",
    "principal_key": "didi",
    "members_raw": [
      "Nona"
    ],
    "group_raw": "Didi \nNona",
    "group_hash": "4da9ccf07efd",
    "member_count": 2,
    "principal_base_raw": "Didi",
    "principal_base_key": "didi",
    "principal_search_keys": [
      "didi"
    ]
  },
  {
    "group_id": 98,
    "list": "Jesse",
    "principal_raw": "Matheus Ferreira",
    "principal_trim": "Matheus Ferreira",
    "principal_key": "matheus ferreira",
    "members_raw": [
      "Ana",
      "Filha",
      "Filha 2"
    ],
    "group_raw": "Matheus Ferreira\nAna\nFilha\nFilha 2",
    "group_hash": "3e796741e891",
    "member_count": 4,
    "principal_base_raw": "Matheus Ferreira",
    "principal_base_key": "matheus ferreira",
    "principal_search_keys": [
      "matheus ferreira"
    ]
  },
  {
    "group_id": 99,
    "list": "Jesse",
    "principal_raw": "Gabi",
    "principal_trim": "Gabi",
    "principal_key": "gabi",
    "members_raw": [
      "Pai da Gabi",
      "Mae da Gabi "
    ],
    "group_raw": "Gabi\nPai da Gabi\nMae da Gabi ",
    "group_hash": "007c547e4822",
    "member_count": 3,
    "principal_base_raw": "Gabi",
    "principal_base_key": "gabi",
    "principal_search_keys": [
      "gabi"
    ]
  },
  {
    "group_id": 100,
    "list": "Jesse",
    "principal_raw": "Irmao da gabi ",
    "principal_trim": "Irmao da gabi",
    "principal_key": "irmao da gabi",
    "members_raw": [],
    "group_raw": "Irmao da gabi ",
    "group_hash": "5425b9054805",
    "member_count": 1,
    "principal_base_raw": "Irmao da gabi",
    "principal_base_key": "irmao da gabi",
    "principal_search_keys": [
      "irmao da gabi"
    ]
  },
  {
    "group_id": 101,
    "list": "Jesse",
    "principal_raw": "Samuel Domingos",
    "principal_trim": "Samuel Domingos",
    "principal_key": "samuel domingos",
    "members_raw": [
      "Mãe"
    ],
    "group_raw": "Samuel Domingos\nMãe",
    "group_hash": "9049ecc2d6be",
    "member_count": 2,
    "principal_base_raw": "Samuel Domingos",
    "principal_base_key": "samuel domingos",
    "principal_search_keys": [
      "samuel domingos"
    ]
  },
  {
    "group_id": 102,
    "list": "Jesse",
    "principal_raw": "Luanda",
    "principal_trim": "Luanda",
    "principal_key": "luanda",
    "members_raw": [
      "Alexandre"
    ],
    "group_raw": "Luanda\nAlexandre",
    "group_hash": "880a27707e5e",
    "member_count": 2,
    "principal_base_raw": "Luanda",
    "principal_base_key": "luanda",
    "principal_search_keys": [
      "luanda"
    ]
  }
];

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
  return name.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
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
