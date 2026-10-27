// Copies ../components into src/components so the demo imports them the way a user
// would after copy-pasting: bare imports resolve against the demo's node_modules.
import { cpSync, rmSync } from 'node:fs';

const from = new URL('../../components', import.meta.url);
const to = new URL('../src/components', import.meta.url);

rmSync(to, { recursive: true, force: true });
cpSync(from, to, { recursive: true });
