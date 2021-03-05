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

        // Set startTime for query to DB
        let startTime = Date.now() - ms(argsArray[0])

        // Query DB for the specific Guild and the startTime
        let result = await this.client.provider.fetchMessageStat(msg.guild.id, startTime)
            .catch(err => this.client.logger.error(err.stack))

        // Take the DB result and parse the timestamps to INT, change the object keys to y & x for Graph usage.
        let resultChanged = []
        for (let msg in result) {
            let values = result[msg].dataValues
            resultChanged.push({y: values.id, x: parseInt(values.timestamp)})
        }

        // If data has been gathered for 1 day only. Split all messages into each hour.
        function sortTimesPerHour(array) {
            let arrayReverse = array.reverse()
            let results = []
            let currentHour = +moment(Date.now()).startOf('hour')

            for (let i = 0; i < 25; i++) {
                for (const msg in arrayReverse) {
                    if (i === 0 && arrayReverse[msg].x > currentHour) {
                        results.push(arrayReverse[msg])
                    }
                    if (arrayReverse[msg].x < ((currentHour - 3600 * 1000 * (i + 1)) + 3600 * 1000) && arrayReverse[msg].x > (currentHour - 3600 * 1000 * (i + 1))) {
                        results.push(arrayReverse[msg])
                    }
                }
                results.push({y: null, x: (currentHour - (3600 * 1000) * i)})
            }
            return results.reverse()
        }

        // If data has been gathered for 1 week only. Split all messages into each day.
        function sortTimesPerDays(array) {
            let arrayReverse = array.reverse()
            let results = []
            let currentHour = +moment(Date.now()).startOf('hour')

            for (let i = 0; i < 25; i++) {
                for (const msg in arrayReverse) {
                    if (i === 0 && arrayReverse[msg].x > currentHour) {
                        results.push(arrayReverse[msg])
                    }
                    if (arrayReverse[msg].x < ((currentHour - 3600 * 1000 * (i + 1)) + 3600 * 1000) && arrayReverse[msg].x > (currentHour - 3600 * 1000 * (i + 1))) {
                        results.push(arrayReverse[msg])
                    }
                }
                results.push({y: null, x: (currentHour - (3600 * 1000) * i)})
            }
            return results.reverse()
        }

        // If data has been gathered for 1 month only. Split all messages into each week.
        function sortTimesPerWeeks(array) {
            let arrayReverse = array.reverse()
            let results = []
            let currentHour = +moment(Date.now()).startOf('hour')

            for (let i = 0; i < 25; i++) {
                for (const msg in arrayReverse) {
                    if (i === 0 && arrayReverse[msg].x > currentHour) {
                        results.push(arrayReverse[msg])
                    }
                    if (arrayReverse[msg].x < ((currentHour - 3600 * 1000 * (i + 1)) + 3600 * 1000) && arrayReverse[msg].x > (currentHour - 3600 * 1000 * (i + 1))) {
                        results.push(arrayReverse[msg])
                    }
                }
                results.push({y: null, x: (currentHour - (3600 * 1000) * i)})
            }
            return results.reverse()
        }

        // If data has been gathered for 1 year only. Split all messages into each month.
        function sortTimesPerMonths(array) {
            let arrayReverse = array.reverse()
            let results = []
            let currentHour = +moment(Date.now()).startOf('hour')

            for (let i = 0; i < 25; i++) {
                for (const msg in arrayReverse) {
                    if (i === 0 && arrayReverse[msg].x > currentHour) {
                        results.push(arrayReverse[msg])
                    }
                    if (arrayReverse[msg].x < ((currentHour - 3600 * 1000 * (i + 1)) + 3600 * 1000) && arrayReverse[msg].x > (currentHour - 3600 * 1000 * (i + 1))) {
                        results.push(arrayReverse[msg])
                    }
                }
                results.push({y: null, x: (currentHour - (3600 * 1000) * i)})
            }
            return results.reverse()
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

        let arrayData, currentGroup;

        if (argsArray[0] === '1d') {
            currentGroup = 'forHour'
            arrayData = sortTimesPerHour(resultChanged)
        }
        /*if (argsArray[0] === '1w') {
            arrayData = sortTimesPerHour(resultChanged)
        }
        if (argsArray[0] === '1m') {
            arrayData = sortTimesPerHour(resultChanged)
        }
        if (argsArray[0] === '1y') {
            arrayData = sortTimesPerHour(resultChanged)
        }*/

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