require('dotenv').config();
const mongoose = require('mongoose');

console.log('🧪 Testing Cosmos DB Connection...\n');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('❌ MONGODB_URI not found in .env file');
  process.exit(1);
}

// Show masked connection string
const maskedUri = uri.replace(/: ([^@]+)@/, ':****@');
console.log('📝 Connection String:', maskedUri);
console.log('');

// Connect
console.log('🔌 Connecting to Cosmos DB...');
mongoose.connect(uri)
  .then(async () => {
    console.log('✅ Successfully connected to Azure Cosmos DB!\n');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🌐 Host:', mongoose.connection.host);
    console.log('');
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Collections:', collections.map(c => c.name).join(', ') || 'None yet');
    console.log('');
    
    // Test models if they exist
    try {
      const Game = require('./models/Game');
      const User = require('./models/User');
      
      const gameCount = await Game.countDocuments();
      const userCount = await User.countDocuments();
      
      console.log('📈 Stats:');
      console.log('   Games:', gameCount);
      console.log('   Users:', userCount);
    } catch (err) {
      console.log('ℹ️  Models not tested:', err.message);
    }
    
    console.log('\n✅ All tests passed!');
    process.exit(0);
  })
  .catch(err => {
    console.error('\n❌ Connection Failed!');
    console.error('Error:', err.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check your connection string in .env');
    console.error('2. Verify database name is included: /sudoku_game');
    console.error('3. Check firewall settings in Azure portal');
    console.error('4. Run: az cosmosdb update --name sudoku-cosmos-strupwa --resource-group sudoku-rg --ip-range-filter "0.0.0.0/0"');
    process.exit(1);
  });
