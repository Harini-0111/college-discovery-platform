/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata'];
const tiers = ['IIT', 'NIT', 'IIIT', 'Private Engineering College', 'State University'];

const colleges = [];

for (let i = 1; i <= 50; i++) {
  const city = cities[i % cities.length];
  const tier = tiers[i % tiers.length];
  const name = `${tier} ${city} - Institute of Technology ${i}`;
  const slug = `institute-of-technology-${i}-${city.toLowerCase()}`;
  
  colleges.push({
    name,
    slug,
    location: `${city}, India`,
    baseFees: 100000 + (Math.random() * 200000),
    rating: (3.5 + Math.random() * 1.5).toFixed(1),
    placements: `Highest: ${20 + Math.floor(Math.random() * 50)} LPA, Average: ${8 + Math.floor(Math.random() * 10)} LPA`,
    courses: [
      { name: "B.Tech Computer Science", durationYears: 4, totalFees: 400000 + (Math.random() * 200000) },
      { name: "B.Tech Electronics", durationYears: 4, totalFees: 350000 + (Math.random() * 150000) }
    ],
    cutoffs: [
      { examName: "JEE Main", category: "General", closingRank: 2000 + Math.floor(Math.random() * 20000), year: 2023 },
      { examName: "JEE Main", category: "OBC", closingRank: 5000 + Math.floor(Math.random() * 30000), year: 2023 }
    ]
  });
}

fs.mkdirSync('prisma/data', { recursive: true });
fs.writeFileSync('prisma/data/colleges.json', JSON.stringify(colleges, null, 2));
console.log('Successfully generated 50 mock colleges with courses and cutoffs.');
