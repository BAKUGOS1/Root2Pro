import fs from 'node:fs';
import path from 'node:path';

const graphDir = path.join(process.cwd(), 'data', 'graphs');
const outDir = path.join(process.cwd(), 'public', 'generated');
fs.mkdirSync(outDir, { recursive: true });

const items = [];
const seenIds = new Set();
for (const file of fs.readdirSync(graphDir).filter(file => file.endsWith('.json'))) {
  const graph = JSON.parse(fs.readFileSync(path.join(graphDir, file), 'utf8'));
  for (const node of graph.nodes) {
    if (seenIds.has(node.id)) continue;
    seenIds.add(node.id);
    items.push({
      id: node.id,
      title: node.title,
      track: node.track,
      type: node.type,
      tags: node.tags || [],
      contentRef: node.contentRef
    });
  }
}

fs.writeFileSync(path.join(outDir, 'search-index.json'), JSON.stringify({ generatedAt: new Date().toISOString(), items }, null, 2));
console.log(`Generated search index with ${items.length} item(s).`);
