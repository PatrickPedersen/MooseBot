const { Command } = require('discord.js-commando');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas')
const { MessageAttachment, MessageEmbed } = require('discord.js')
const moment = require('moment');
const _ = require('lodash')
const ms = require('ms');

const width = 800
const height = 600
const canvas = new ChartJSNodeCanvas({ width, height })

// noinspection JSUnresolvedFunction,DuplicatedCode
module.exports = class MemsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'mems',
            aliases: [],
            group: 'moderator',
            memberName: 'mems',
            description: 'Shows message stats',
            examples: [],
            guildOnly: true
        });
    }

    // noinspection JSCheckFunctionSignatures
    async run(msg, args) {

        // Check if there are any arguments passed
        if (!args) return msg.channel.send('You have to provide 1d/1w/1m/1y!')
            .then(m => m.delete({timeout: 3000}));

        // Split Arguments
        let argsArray = args.split(" ");

        let arrayData, currentGroup;
        let resultChanged = []

        if (argsArray[0] === '1d') {
            await querySetResult(Date.now() - ms(argsArray[0]), this.client)
                .then(() => {
                    currentGroup = 'forHour'
                    arrayData = sortTimesForDay(resultChanged)
                })
        }
        if (argsArray[0] === '1w') {
            await querySetResult(Date.now() - ms(argsArray[0]), this.client)
                .then(() => {
                    currentGroup = 'byDay'
                    arrayData = sortTimesforWeek(resultChanged)
                })
        }
        if (argsArray[0] === '1m') {
            await querySetResult(Date.now() - 2678400 * 1000, this.client)
                .then(() => {
                    currentGroup = 'byDay'
                    arrayData = sortTimesForMonth(resultChanged)
                })
        }
        if (argsArray[0] === '1y') {
            await querySetResult(Date.now() - ms(argsArray[0]), this.client)
                .then(() => {
                    currentGroup = 'forMonth'
                    arrayData = sortTimesPerMonths(resultChanged)
                })

        }

        async function querySetResult(startTime, client) {
            // Query DB for the specific Guild and the startTime
            let result = await client.provider.fetchMessageStat(msg.guild.id, startTime)
                .catch(err => client.logger.error(err.stack))

            // Take the DB result and parse the timestamps to INT, change the object keys to y & x for Graph usage.
            for (let msg in result) {
                let values = result[msg].dataValues
                resultChanged.push({y: values.id, x: parseInt(values.timestamp)})
            }
        }

        // If data has been gathered for 1 day only. Split all messages into each hour.
        function sortTimesForDay(array) {
            let arrayReverse = array.reverse()
            let results = []
            let currentHour = +moment(Date.now()).startOf('hour')

            for (let i = 0; i < 25; i++) {
                for (const msg in arrayReverse) {
                    // If msg is greater than the currentDay time, push to array.
                    // This takes all messages sent for the current day and sends the rest onto the next if statement.
                    if (i === 0 && arrayReverse[msg].x > currentHour) {
                        results.push(arrayReverse[msg])
                    }
                    // If msg is less than currentDay (It wasn't sent today), check if message fits into the given day.
                    // If it does, push to array. If not, continue onto the next message.
                    if (arrayReverse[msg].x < ((currentHour - 3600 * 1000 * (i + 1)) + 3600 * 1000) && arrayReverse[msg].x > (currentHour - 3600 * 1000 * (i + 1))) {
                        results.push(arrayReverse[msg])
                    }
                }
                // If no messages match the current time, insert empty msg with time marker.
                results.push({y: null, x: (currentHour - (3600 * 1000) * i)})
            }
            return results.reverse()
        }

        // If data has been gathered for 1 week only. Split all messages into each day.
        function sortTimesforWeek(array) {
            let arrayReverse = array.reverse()
            let results = []
            let currentDay = +moment(Date.now()).startOf('day')

            for (let i = 0; i < 8; i++) {
                for (const msg in arrayReverse) {
                    // If msg is greater than the currentDay time, push to array.
                    // This takes all messages sent for the current day and sends the rest onto the next if statement.
                    if (i === 0 && arrayReverse[msg].x > currentDay) {
                        results.push(arrayReverse[msg])
                    }
                    // If msg is less than currentDay (It wasn't sent today), check if message fits into the given day.
                    // If it does, push to array. If not, continue onto the next message.
                    if (arrayReverse[msg].x < ((currentDay - 86400 * 1000 * (i + 1)) + 86400 * 1000) && arrayReverse[msg].x > (currentDay - 86400 * 1000 * (i + 1))) {
                        results.push(arrayReverse[msg])
                    }
                }
                // If no messages match the current time, insert empty msg with time marker.
                results.push({y: null, x: (currentDay - (86400 * 1000) * i)})
            }
            return results.reverse()
        }

        // If data has been gathered for 1 month only. Split all messages into each week.
        function sortTimesForMonth(array) {
            let arrayReverse = array.reverse()
            let results = []
            let currentDay = +moment(Date.now()).startOf('day')

            for (let i = 0; i < 32; i++) {
                for (const msg in arrayReverse) {
                    // If msg is greater than the currentDay time, push to array.
                    // This takes all messages sent for the current day and sends the rest onto the next if statement.
                    if (i === 0 && arrayReverse[msg].x > currentDay) {
                        results.push(arrayReverse[msg])
                    }
                    // If msg is less than currentDay (It wasn't sent today), check if message fits into the given day.
                    // If it does, push to array. If not, continue onto the next message.
                    if (arrayReverse[msg].x < ((currentDay - 86400 * 1000 * (i + 1)) + 86400 * 1000) && arrayReverse[msg].x > (currentDay - 86400 * 1000 * (i + 1))) {
                        results.push(arrayReverse[msg])
                    }
                }
                // If no messages match the current time, insert empty msg with time marker.
                results.push({y: null, x: (currentDay - (86400 * 1000) * i)})
            }
            return results.reverse()
        }

        // If data has been gathered for 1 year only. Split all messages into each month.
        function sortTimesPerMonths(array) {
            let arrayReverse = array.reverse()
            let results = []
            let currentMonth = +moment(Date.now()).startOf('month')

            for (let i = 0; i < 12; i++) {
                for (const msg in arrayReverse) {
                    // If msg is greater than the currentDay time, push to array.
                    // This takes all messages sent for the current day and sends the rest onto the next if statement.
                    if (i === 0 && arrayReverse[msg].x > currentMonth) {
                        results.push(arrayReverse[msg])
                    }
                    // If msg is less than currentDay (It wasn't sent today), check if message fits into the given day.
                    // If it does, push to array. If not, continue onto the next message.
                    if (arrayReverse[msg].x < ((currentMonth - 2678400 * 1000 * (i + 1)) + 2678400 * 1000) && arrayReverse[msg].x > (currentMonth - 2678400 * 1000 * (i + 1))) {
                        results.push(arrayReverse[msg])
                    }
                }
                // If no messages match the current time, insert empty msg with time marker.
                results.push({y: null, x: (currentMonth - (2678400 * 1000) * i)})
            }
            return results.sort((a, b) => b.x - a.x).reverse()
        }

        const groups = (() => {
            const byDay = (item) => moment(item.x).format('MM/DD/YYYY'),
                forHour = (item) => byDay(item) + ' ' + moment(item.x).format('kk:00'),
                by6Hour = (item) => {
                    const m = moment(item.x);
                    return byDay(item) + ' ' + ['first', 'second', 'third', 'fourth'][Number(m.format('k')) % 6] + ' 6 hours';
                },
                forMonth = (item) => moment(item.x).format('MMM YYYY'),
                forWeek = (item) => forMonth(item) + ' ' + moment(item.x).format('ww');
            return {
                byDay,
                forHour,
                by6Hour,
                forMonth,
                forWeek,
            };
        })();

        let groupedData = _.groupBy(arrayData, groups[currentGroup])
        let keys = Object.keys(groupedData)

        let dates = []
        let messages = []
        for (let i = 0; i < Object.keys(groupedData).length; i++) {
            let msgAmount = Object.values(groupedData)[i].filter(value => value.y !== null).length
            dates.push(keys[i])
            messages.push(msgAmount)
        }

        const config = {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Discord Messages',
                    data: messages,
                    backgroundColor: 'rgba(0,152,255,0.5)',
                    borderColor: 'rgb(0,152,255)',
                    borderWidth: 1,
                    tension: 0,
                    pointBorderColor: 'rgba(255,255,255,1)',
                    pointRadius: 6,
                    pointStyle: 'circle'
                }],
            },
            options: {
                title: {
                    display: true,
                    text: 'Message Stat',
                    fontColor: 'rgba(255,255,255,1)'
                },
                legend: {
                    display: true,
                    labels: {
                        fontColor: 'white',
                        font: 14
                    }
                },
                scales: {
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Messages',
                            fontColor: 'rgba(255,255,255,1)',
                            fontSize: 14
                        }
                    }],
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Date',
                            fontColor: 'rgba(255,255,255,1)',
                            fontSize: 14
                        },
                    }],
                }
            },
            plugins: [{
                id: 'custom_canvas_background_color',
                beforeDraw: (chart) => {
                    const ctx = chart.canvas.getContext('2d');
                    ctx.save();
                    ctx.globalCompositeOperation = 'destination-over';
                    ctx.fillStyle = 'rgba(35,39,42,1)';
                    ctx.fillRect(0, 0, chart.canvas.width, chart.canvas.height);
                    ctx.restore();
                }
            }]
        }

        const image = await canvas.renderToBuffer(config)
        const attachment = await new MessageAttachment(image)

        await msg.channel.send(attachment);
    }
}