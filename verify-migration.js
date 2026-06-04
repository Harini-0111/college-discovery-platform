const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const http = require('http');

async function checkApi(path) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    }).on('error', err => {
      resolve({ status: 500, error: err.message });
    });
  });
}

async function verifyMigration() {
  try {
    console.log("=== Verifying Database Counts ===");
    const collegeCount = await prisma.college.count();
    const courseCount = await prisma.course.count();
    const cutoffCount = await prisma.cutoff.count();

    console.log(`Colleges: ${collegeCount}`);
    console.log(`Courses: ${courseCount}`);
    console.log(`Cutoffs: ${cutoffCount}`);

    console.log("\n=== Testing APIs ===");
    // Get a random college ID to test
    const firstCollege = await prisma.college.findFirst();
    const id = firstCollege?.id || 'cl_dummy_id';

    const tests = [
      '/api/colleges',
      '/api/colleges/search?q=Technology',
      `/api/colleges/${id}`,
      '/api/predictor?examName=JEE%20Main&category=General&rank=25000'
    ];

    for (const t of tests) {
      const res = await checkApi(t);
      console.log(`[${res.status}] GET ${t}`);
      if (res.status !== 200) {
        console.error("FAILED:", res.body || res.error);
      } else {
        const payload = res.body.data;
        const len = Array.isArray(payload) ? `${payload.length} items` : '1 item';
        console.log(`SUCCESS: Returned ${len}`);
      }
    }
  } catch (error) {
    console.error("Verification failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyMigration();
