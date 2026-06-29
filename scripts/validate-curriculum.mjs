import fs from 'node:fs';
import path from 'node:path';
import { curriculumGraphSchema } from '../schemas/zod/curriculumGraphSchema.js';

const graphDir = path.join(process.cwd(), 'data', 'graphs');
const graphFiles = fs.readdirSync(graphDir).filter(file => file.endsWith('.json'));
let failed = false;

for (const file of graphFiles) {
  const fullPath = path.join(graphDir, file);
  const raw = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  const result = curriculumGraphSchema.safeParse(raw);

  if (!result.success) {
    console.error(`Schema error in ${file}`);
    console.error(result.error.format());
    failed = true;
    continue;
  }

  const nodeIds = new Set(raw.nodes.map(node => node.id));

  for (const edge of raw.edges) {
    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) {
      console.error(`Broken edge in ${file}: ${edge.from} -> ${edge.to}`);
      failed = true;
    }
  }

  for (const node of raw.nodes) {
    if (!fs.existsSync(path.join(process.cwd(), node.contentRef))) {
      console.error(`Missing contentRef in ${file}: ${node.contentRef}`);
      failed = true;
    }
  }
}

if (failed) process.exit(1);
console.log(`Validated ${graphFiles.length} curriculum graph file(s).`);
