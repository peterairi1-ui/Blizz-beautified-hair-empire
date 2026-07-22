require('dotenv').config();
const { MongoClient } = require('mongodb');

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set in this terminal session.');
    process.exit(1);
  }

  console.log('Attempting connection...');
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });

  try {
    await client.connect();
    console.log('CONNECTED SUCCESSFULLY');
    const admin = client.db().admin();
    const info = await admin.serverStatus();
    console.log('Server version:', info.version);
  } catch (err) {
    console.error('CONNECTION FAILED');
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    if (err.cause) {
      console.error('Cause:', err.cause);
    }
  } finally {
    await client.close();
    process.exit(0);
  }
}

run();