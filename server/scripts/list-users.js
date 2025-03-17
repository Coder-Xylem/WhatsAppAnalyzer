import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listUsers() {
  try {
    console.log('Fetching all users and their analyses...\n');
    
    const users = await prisma.user.findMany({
      include: {
        analyses: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (users.length === 0) {
      console.log('No users found in the database.');
      return;
    }

    users.forEach((user, index) => {
      console.log(`User ${index + 1}:`);
      console.log('ID:', user.id);
      console.log('Username:', user.username);
      console.log('Email:', user.email);
      console.log('Created at:', user.createdAt);
      console.log('Updated at:', user.updatedAt);
      console.log('\nAnalyses:', user.analyses.length ? '' : ' None');
      
      if (user.analyses.length > 0) {
        user.analyses.forEach((analysis, aIndex) => {
          console.log(`\n  Analysis ${aIndex + 1}:`);
          console.log('  ID:', analysis.id);
          console.log('  File Path:', analysis.filePath);
          console.log('  Created at:', analysis.createdAt);
          console.log('  Results:', JSON.stringify(analysis.results, null, 2));
        });
      }
      console.log('\n' + '-'.repeat(50) + '\n');
    });

    console.log(`Total users: ${users.length}`);
    console.log(`Total analyses: ${users.reduce((sum, user) => sum + user.analyses.length, 0)}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers(); 