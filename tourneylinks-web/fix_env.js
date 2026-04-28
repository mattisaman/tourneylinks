const fs = require('fs');
let env = fs.readFileSync('.env.local', 'utf8');
env = env.replace('6543/postgres', '5432/postgres');
fs.writeFileSync('.env.local', env);
console.log('Fixed port to 5432');
