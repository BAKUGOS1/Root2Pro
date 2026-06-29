import webFoundations from '../../data/graphs/web-foundations.graph.json';
import gitGithub from '../../data/graphs/git-github.graph.json';
import html from '../../data/graphs/html.graph.json';
import css from '../../data/graphs/css.graph.json';
import javascript from '../../data/graphs/javascript.graph.json';
import python from '../../data/graphs/python.graph.json';
import react from '../../data/graphs/react.graph.json';
import sql from '../../data/graphs/sql.graph.json';
import dsaBasics from '../../data/graphs/dsa-basics.graph.json';

const graphs = {
  'web-foundations': webFoundations,
  'git-github': gitGithub,
  html,
  css,
  javascript,
  python,
  react,
  sql,
  'dsa-basics': dsaBasics
};

export function getGraph(id = 'web-foundations') {
  return graphs[id] || graphs['web-foundations'];
}

export function getAllGraphs() {
  return Object.values(graphs);
}

export function findNodeById(nodeId) {
  for (const graph of Object.values(graphs)) {
    const node = graph.nodes.find(item => item.id === nodeId);
    if (node) return { graph, node };
  }
  return null;
}
