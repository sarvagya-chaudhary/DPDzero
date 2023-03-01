const fs = require('fs');

// Read the channel cost data from the JSON file
const channelCost = JSON.parse(fs.readFileSync('cost.json'));

// Read the channel usage data from the JSON file
const usageData = JSON.parse(fs.readFileSync('channel-cost.json'));

// Calculate the total cost per day across different channels
const dailyCosts = Object.entries(usageData).map(([date, channels]) => {
    const totalCosts = {
        sms: channels.sms * channelCost.sms,
        whatsapp: channels.whatsapp * channelCost.whatsapp,
        email: channels.email * channelCost.email,
        ivr: channels.ivr * channelCost.ivr
    };
    const totalCostInRupees = Object.fromEntries(
        Object.entries(totalCosts).map(([channel, cost]) => [channel, (cost / 100).toFixed(2)])
    );
    return { date, ...totalCostInRupees };
});

// Sort the daily costs by date in ascending order
dailyCosts.sort((a, b) => a.date.localeCompare(b.date));

// Write the daily costs to a JSON file
fs.writeFileSync('daily-costs.json', JSON.stringify(dailyCosts, null, 2));

console.log('Daily costs saved to daily-costs.json');
