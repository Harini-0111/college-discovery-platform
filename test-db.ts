import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Testing Prisma connection...');
  const count = await prisma.college.count();
  console.log(`Total colleges in DB: ${count}`);

  if (count > 0) {
    const firstCollege = await prisma.college.findFirst({
      include: { courses: true, cutoffs: true }
    });
    console.log('Successfully fetched sample college:', firstCollege?.name);
    console.log(`Courses: ${firstCollege?.courses.length}, Cutoffs: ${firstCollege?.cutoffs.length}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
