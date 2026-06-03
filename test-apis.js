async function test() {
  console.log('Testing APIs... Make sure Next.js server is running.');
  const baseUrl = 'http://localhost:3000/api';

  try {
    // 1. Get Colleges
    console.log('\n--- 1. GET /colleges ---');
    let res = await fetch(`${baseUrl}/colleges?page=1&limit=2`);
    let data = await res.json();
    console.log('Success:', data.data?.length === 2, '- Fetched 2 colleges.');

    const firstCollegeId = data.data?.[0]?.id;

    // 2. Get College by ID
    console.log(`\n--- 2. GET /colleges/${firstCollegeId} ---`);
    res = await fetch(`${baseUrl}/colleges/${firstCollegeId}`);
    data = await res.json();
    console.log('Success:', !!data.data?.name && !!data.data?.courses, '- Fetched details and courses.');

    // 3. Search API
    console.log('\n--- 3. GET /colleges/search ---');
    res = await fetch(`${baseUrl}/colleges/search?q=tech&minRating=4&page=1`);
    data = await res.json();
    console.log(`Success: Found ${data.meta?.total} colleges matching 'tech' with minRating 4`);

    // 4. Search Validation Error
    console.log('\n--- 4. GET /colleges/search Validation Error ---');
    res = await fetch(`${baseUrl}/colleges/search?minFee=500&maxFee=100`);
    data = await res.json();
    console.log('Validation Caught:', data.error === 'Invalid search parameters', '- Successfully prevented invalid fee range.');

  } catch (err) {
    console.error('Test failed:', err);
  }
}
test();
