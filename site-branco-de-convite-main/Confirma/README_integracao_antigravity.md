# Integração — Lista de convidados + Confirmações

Arquivos:
- `convidados_grupos.json` (somente leitura): grupos extraídos do Word.
- `confirmacoes_template.csv` / `confirmacoes_template.json`: modelo do “banco” de confirmações (para você criar a tabela/planilha).
- `convites_codigos.csv`: códigos únicos por grupo (recomendado para resolver nomes repetidos e aumentar segurança).

Chaves:
- `group_id` = identificador do grupo (chave primária).
- `principal_raw` e `members_raw` = texto **exatamente** como está no Word (não altere).
- `principal_search_keys` = lista de chaves normalizadas para busca (ex.: com/sem o trecho entre parênteses).
- Confirmações devem referenciar `group_id`.

Fluxo recomendado:
1) Usuário digita o nome do responsável (`principal`) **ou** nome + `invite_code`.
2) Sistema encontra o grupo (por `principal_search_keys`).
3) UI lista as pessoas do grupo e coleta presença + van/dormitório.
4) Sistema grava uma linha em “Confirmações” contendo `group_id` e os arrays `attending_raw_json` / `not_attending_raw_json`.

Observação:
- Se o nome digitado bater em mais de 1 grupo (ex.: "Lucas" / "Adrielly"), exija `invite_code` para destravar.
