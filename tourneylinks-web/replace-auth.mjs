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
      let changed = false;

      // Handle auth()
      if (content.includes("auth()") && content.includes("@clerk/nextjs")) {
        // Replace destructure or direct imports
        content = content.replace(/import\s+\{([^}]*)auth([^}]*)\}\s+from\s+['"]@clerk\/nextjs\/?(server)?['"]/g, "import { $1 $2 } from '@clerk/nextjs/server';\nimport { getUserId } from '@/lib/auth-util';");
        content = content.replace(/\bauth\(\)/g, "getUserId()");
        content = content.replace(/import\s+\{\s+\}\s+from\s+['"]@clerk\/nextjs\/server['"];\n/g, ""); // clean empty
        changed = true;
      }

      // Handle currentUser()
      if (content.includes("currentUser()") && content.includes("@clerk/nextjs")) {
        content = content.replace(/import\s+\{([^}]*)currentUser([^}]*)\}\s+from\s+['"]@clerk\/nextjs\/?(server)?['"]/g, "import { $1 $2 } from '@clerk/nextjs/server';\nimport { getCurrentUser } from '@/lib/auth-util';");
        content = content.replace(/\bcurrentUser\(\)/g, "getCurrentUser()");
        content = content.replace(/import\s+\{\s+\}\s+from\s+['"]@clerk\/nextjs\/server['"];\n/g, ""); // clean empty
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory('./src/app');
