import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  const rawData = fs.readFileSync(path.join(__dirname, 'data/colleges.json'), 'utf-8')
  const collegesData = JSON.parse(rawData)

  // Clear existing data
  await prisma.cutoff.deleteMany()
  await prisma.course.deleteMany()
  await prisma.savedCollege.deleteMany()
  await prisma.college.deleteMany()
  await prisma.user.deleteMany()

  // Seed Colleges, Courses, and Cutoffs
  for (const c of collegesData) {
    await prisma.college.create({
      data: {
        name: c.name,
        slug: c.slug,
        location: c.location,
        baseFees: parseFloat(c.baseFees),
        rating: parseFloat(c.rating),
        placements: c.placements,
        courses: {
          create: c.courses
        },
        cutoffs: {
          create: c.cutoffs
        }
      }
    })
  }
  
  console.log('Seeding finished successfully. Inserted', collegesData.length, 'colleges along with their courses and cutoffs.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
