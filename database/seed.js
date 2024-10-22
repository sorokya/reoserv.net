import { syncContent } from '../app/.server/services/content/sync-content.js';
// import { syncLatestRelease } from '../app/.server/services/github/syncLatestRelease';
// import { syncLatestCommits } from '../app/.server/services/github/syncLatestCommits';

async function seedDatabase() {
  const results = await Promise.allSettled([
    syncContent(),
    // syncLatestCommits(),
    // syncLatestRelease(),
  ]);

  for (const result of results) {
    if (result.status === 'rejected') {
      console.error('Error seeding database:', result.reason);
    }
  }

  if (results.every((result) => result.status === 'fulfilled')) {
    console.log('Database seeded successfully.');
  }
}

seedDatabase();
