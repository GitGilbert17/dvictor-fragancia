import {rmSync} from 'node:fs';

// Solo se eliminan las salidas generadas del proyecto, desde cualquier directorio.
for (const output of ['../../dist/', '../../server.js']) {
  rmSync(new URL(output, import.meta.url), {recursive: true, force: true});
}
