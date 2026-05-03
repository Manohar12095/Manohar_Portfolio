import client from './src/insforge.js';
import { PROFILE, SECTIONS, VIDEOS, CONTACT, ADMIN } from './src/data.js';

async function migrate() {
  console.log('Attempting to upload data to InsForge...');
  
  const payload = {
    profile: PROFILE,
    sections: SECTIONS,
    videos: VIDEOS,
    contact: CONTACT,
    admin: ADMIN
  };

  try {
    const { data, error } = await client.database
      .from('portfolio_data')
      .upsert({ id: 'main', payload });

    if (error) {
      console.error('Error object:', error);
      console.error('Error string:', String(error));
    } else {
      console.log('Successfully uploaded data:', data);
    }
  } catch (err) {
    console.error('Caught exception:', err);
  }
}

migrate();
