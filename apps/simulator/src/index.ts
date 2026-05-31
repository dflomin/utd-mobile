import { runSimulation } from './runSimulation.js';

const summary = runSimulation({ seed: 7, maxTicks: 40 });
console.log(JSON.stringify(summary, null, 2));
