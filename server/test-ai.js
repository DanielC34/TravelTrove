const fetch = require('node-fetch');

async function testAIItinerary() {
  try {
    console.log('🧪 Testing AI Itinerary Generation...');
    
    const response = await fetch('http://localhost:3001/api/ai/test-itinerary');
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Test successful!');
      console.log('📋 Generated Itinerary:');
      console.log(`   Name: ${data.data.name}`);
      console.log(`   Description: ${data.data.description}`);
      console.log(`   Days: ${data.data.days.length}`);
      console.log(`   Total Cost: $${data.data.totalCost.amount} ${data.data.totalCost.currency}`);
      
      console.log('\n📅 Day-by-day breakdown:');
      data.data.days.forEach((day, index) => {
        console.log(`\n   Day ${day.dayNumber} (${day.date}):`);
        console.log(`   Activities: ${day.activities.length}`);
        day.activities.forEach((activity, actIndex) => {
          console.log(`     ${actIndex + 1}. ${activity.name} (${activity.startTime}-${activity.endTime})`);
          console.log(`        Category: ${activity.category}, Cost: $${activity.cost?.amount || 0}`);
        });
      });
    } else {
      console.log('❌ Test failed:', data);
    }
  } catch (error) {
    console.error('❌ Error testing AI itinerary:', error.message);
    console.log('💡 Make sure the server is running on port 3001');
  }
}

testAIItinerary();