/**
 * Performance benchmark — run: node scripts/perf-benchmark.mjs [baseUrl]
 * Omit baseUrl to benchmark service layer only.
 */

import { performance } from 'perf_hooks';

const BASE = process.argv[2] || null;
const RUNS = 8;

async function timeFn(label, fn) {
  // warmup
  await fn();
  const times = [];
  for (let i = 0; i < RUNS; i++) {
    const start = performance.now();
    await fn();
    times.push(performance.now() - start);
  }
  times.sort((a, b) => a - b);
  const median = times[Math.floor(times.length / 2)];
  const avg = times.reduce((s, t) => s + t, 0) / times.length;
  return { label, median: Math.round(median), avg: Math.round(avg), min: Math.round(times[0]), max: Math.round(times[times.length - 1]) };
}

async function benchHttp() {
  const results = [];
  const endpoints = [
    ['Search (no filters)', `${BASE}/api/colleges/search`],
    ['Search (q=IIT)', `${BASE}/api/colleges/search?q=IIT`],
    ['Search (location+rating)', `${BASE}/api/colleges/search?location=Delhi&minRating=4`],
    ['Compare list', `${BASE}/api/colleges?limit=100`],
    ['College detail (full)', `${BASE}/api/colleges/cmpzqrcwd0000r21h6xoyc4wr`],
    ['Predictor', `${BASE}/api/predictor?examName=JEE%20Main&category=General&rank=5000`],
  ];

  for (const [label, url] of endpoints) {
    results.push(await timeFn(label, async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${url} => ${res.status}`);
      await res.json();
    }));
  }

  results.push(await timeFn('Compare API (2 colleges)', async () => {
    const list = await fetch(`${BASE}/api/colleges?limit=100`).then(r => r.json());
    const id1 = list.data[0].id;
    const id2 = list.data[1].id;
    await fetch(`${BASE}/api/colleges/compare?ids=${id1},${id2}`).then(r => r.json());
  }));

  results.push(await timeFn('Compare flow (list + compare)', async () => {
    const list = await fetch(`${BASE}/api/colleges?limit=100`).then(r => r.json());
    const id1 = list.data[0].id;
    const id2 = list.data[1].id;
    await fetch(`${BASE}/api/colleges/compare?ids=${id1},${id2}`).then(r => r.json());
  }));

  // Legacy compare flow for before/after reference
  results.push(await timeFn('Compare flow (list + 2 details)', async () => {
    const list = await fetch(`${BASE}/api/colleges?limit=100`).then(r => r.json());
    const id1 = list.data[0].id;
    const id2 = list.data[1].id;
    await Promise.all([
      fetch(`${BASE}/api/colleges/${id1}`).then(r => r.json()),
      fetch(`${BASE}/api/colleges/${id2}`).then(r => r.json()),
    ]);
  }));

  return results;
}

async function benchServices() {
  const { searchColleges } = await import('../src/services/search.service.ts');
  const { predictColleges } = await import('../src/services/predictor.service.ts');
  const { getColleges, getCollegeById, getCollegesCompareData } = await import('../src/services/college.service.ts');

  const results = [];
  results.push(await timeFn('Service: search (no filters)', () => searchColleges({})));
  results.push(await timeFn('Service: search (q=IIT)', () => searchColleges({ q: 'IIT' })));
  results.push(await timeFn('Service: search (location+rating)', () => searchColleges({ location: 'Delhi', minRating: 4 })));
  results.push(await timeFn('Service: getColleges limit=100', () => getColleges({ limit: 100 })));
  results.push(await timeFn('Service: getCollegeById (full)', () => getCollegeById('cmpzqrcwd0000r21h6xoyc4wr')));
  results.push(await timeFn('Service: getCollegesCompareData (2)', () => getCollegesCompareData(['cmpzqrcwd0000r21h6xoyc4wr', 'cmpzqsqef0046r21hrbpv0qxd'])));
  results.push(await timeFn('Service: predictColleges', () => predictColleges({ examName: 'JEE Main', category: 'General', rank: 5000 })));
  return results;
}

function printResults(title, results) {
  console.log(`\n=== ${title} ===`);
  console.log('Label'.padEnd(40), 'median', 'avg', 'min', 'max', '(ms)');
  for (const r of results) {
    console.log(r.label.padEnd(40), String(r.median).padStart(5), String(r.avg).padStart(5), String(r.min).padStart(5), String(r.max).padStart(5));
  }
}

const serviceResults = await benchServices();
printResults('Service layer', serviceResults);

if (BASE) {
  const httpResults = await benchHttp();
  printResults(`HTTP (${BASE})`, httpResults);
}
