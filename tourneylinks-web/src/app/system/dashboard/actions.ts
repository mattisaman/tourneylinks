'use server';

import { exec } from 'child_process';
import { revalidatePath } from 'next/cache';

export async function triggerCheckbackEngine() {
  console.log('Triggering checkback engine via server action...');
  
  // Fire and forget - do not await the exec, let it run in the background.
  exec('npx tsx scripts/checkback_engine.ts', (error, stdout, stderr) => {
    if (error) {
      console.error(`Checkback Engine Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Checkback Engine Stderr: ${stderr}`);
    }
    console.log(`Checkback Engine Output: ${stdout}`);
  });

  // Revalidate the dashboard so the user sees updated metrics (like "active checkbacks" if we add them)
  revalidatePath('/system/dashboard');
  
  return { success: true, message: 'Checkback Engine started in the background.' };
}
