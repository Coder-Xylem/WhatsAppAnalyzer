import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Test connection
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('Successfully connected to MongoDB!');

    // Create a test user
    const testUser = await prisma.user.create({
      data: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword123'
      }
    });
    console.log('Created test user:', testUser);

    // List all users
    const allUsers = await prisma.user.findMany({
      include: {
        analyses: true
      }
    });
    console.log('\nAll users in database:', JSON.stringify(allUsers, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 