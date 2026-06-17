const str = '[ESCALATE: Student unable to login | SUBJECT: Login failure | CATEGORY: account | PRIORITY: high]';
const match = str.match(/\[ESCALATE:\s*(.+?)(?:\s*\|\s*SUBJECT:\s*(.+?))?(?:\s*\|\s*CATEGORY:\s*(.+?))?(?:\s*\|\s*PRIORITY:\s*(.+?))?\]/);
console.log(match);
