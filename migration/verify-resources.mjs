import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { createServer, preview, resolveConfig } from 'vite';

const root = fileURLToPath(new URL('../', import.meta.url));
const inventory = JSON.parse(await fs.readFile(path.join(root, 'migration/storage-inventory.json'), 'utf8'));
const expectedFiles = new Map(
  [...inventory.files, ...inventory.recovered_extra_files].map(file => [file.local_path, file])
);
const sha256 = data => createHash('sha256').update(data).digest('hex');
const config = await resolveConfig({ root }, 'serve');
const dev = await createServer({
  configFile: false,
  root,
  base: config.base,
  server: { middlewareMode: true },
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
});
let site;

try {
  const { getResourceUrl } = await dev.ssrLoadModule('/src/lib/resource-url.ts');
  const resources = [];
  for (const name of ['src/lib/courseData.ts', 'src/components/desktop/ContentArea.tsx']) {
    const source = ts.createSourceFile(
      name, await fs.readFile(path.join(root, name), 'utf8'), ts.ScriptTarget.Latest, true,
      name.endsWith('tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
    );
    function visit(node) {
      if (ts.isCallExpression(node) && node.expression.getText(source) === 'getResourceUrl') {
        assert(ts.isStringLiteral(node.arguments[0]), 'Resource paths must be explicit strings');
        resources.push(node.arguments[0].text);
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
  assert.equal(new Set(resources).size, expectedFiles.size, 'All recovered files must be referenced');

  const assets = await fs.readdir(path.join(root, 'dist/assets'));
  for (const name of assets.filter(name => name.endsWith('.js'))) {
    const bundle = await fs.readFile(path.join(root, 'dist/assets', name), 'utf8');
    assert(!bundle.includes(inventory.project_host), 'Built site still references the old Supabase host');
  }

  site = await preview({ root, preview: { host: '127.0.0.1', port: 0, strictPort: false } });
  const origin = `http://127.0.0.1:${site.httpServer.address().port}`;
  assert.equal((await fetch(origin + dev.config.base)).status, 200, 'Site entry must load');
  for (const resource of new Set(resources)) {
    const expected = expectedFiles.get(`public/resources/${resource}`);
    assert(expected, `Missing inventory entry: ${resource}`);
    const url = getResourceUrl(resource);
    assert.equal(url, expected.target_url_path, `Inventory URL: ${resource}`);
    assert(url.startsWith(`${dev.config.base}resources/`), 'Resource must include the deployment base path');
    const response = await fetch(origin + url);
    assert.equal(response.status, 200, resource);
    assert(!response.headers.get('content-type')?.includes('text/html'), `HTML fallback: ${resource}`);
    const body = Buffer.from(await response.arrayBuffer());
    assert.equal(body.length, expected.size_bytes, resource);
    assert.equal(sha256(body), expected.sha256, resource);
    if (resource.endsWith('.mp3') || resource.startsWith('Proposals/')) {
      const ranged = await fetch(origin + url, { headers: { Range: 'bytes=0-1023' } });
      assert.equal(ranged.status, 206, `Byte range: ${resource}`);
      assert.equal((await ranged.arrayBuffer()).byteLength, 1024, resource);
    }
  }
  console.log(`PASS: ${expectedFiles.size} resources; HTTP status, SHA-256, deployment base path, MP3/PDF byte ranges, and no old Supabase host.`);
} finally {
  if (site) {
    site.httpServer.closeAllConnections();
    await new Promise((resolve, reject) => site.httpServer.close(error => error ? reject(error) : resolve()));
  }
  await dev.close();
}
