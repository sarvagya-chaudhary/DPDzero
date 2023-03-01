const fs = require('fs');

const channelCost = JSON.parse(fs.readFileSync('cost.json'));
const channelUsage = JSON.parse(fs.readFileSync('channel-cost.json'));

const usageByDate = channelUsage.reduce((acc, cur) => {
    const date = cur.date.substring(0, 10);
    const channel = Object.keys(cur).filter(key => key !== 'date')[0];

    if (!acc[date]) {
        acc[date] = {};
    }

    if (!acc[date][channel]) {
        acc[date][channel] = 0;
    }

    acc[date][channel] += cur[channel];

    return acc;
}, {});

const usageByChannel = Object.keys(channelCost).reduce((acc, cur) => {
    acc[cur] = {};

    Object.keys(usageByDate).forEach(date => {
        const usage = usageByDate[date][cur] || 0;
        acc[cur][date] = (usage * channelCost[cur]).toFixed(2);
    });

    return acc;
}, {});

const result = Object.keys(usageByDate).map(date => {
    const totalCostInRupees = Object.keys(usageByChannel).reduce((acc, cur) => {
        acc[cur] = usageByChannel[cur][date];
        return acc;
    }, {});

    return { sms: totalCostInRupees.sms, whatsapp: totalCostInRupees.whatsapp, email: totalCostInRupees.email, ivr: totalCostInRupees.ivr, date: date };
}).sort((a, b) => new Date(a.date) - new Date(b.date));

fs.writeFileSync('output.json', JSON.stringify(result));
