import fs from 'fs';
import path from 'path';

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;

      // Fix broken import block
      content = content.replace(/import\s*\{\s*,*\s*\}\s*from\s*['"]@clerk\/nextjs\/server['"];\s*/g, "");
      
      // Fix broken commas like import {    ,     }
      content = content.replace(/import\s*\{\s*,*\s*,*\s*\}\s*from\s*['"]@clerk\/nextjs\/server['"];\s*/g, "");

      // Fix double semicolons
      content = content.replace(/;;/g, ";");

      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log(`Fixed syntax in ${fullPath}`);
      }
    }
  }
}

processDirectory('./src/app');

// Fix auth-util promise bug
let utilPath = './src/lib/auth-util.ts';
let utilContent = fs.readFileSync(utilPath, 'utf8');
utilContent = utilContent.replace("return auth().userId;", "const session = await auth();\n    return session.userId;");
fs.writeFileSync(utilPath, utilContent);
console.log('Fixed auth-util.ts');
