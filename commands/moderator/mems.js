const { Command } = require('discord.js-commando');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas')
const { MessageAttachment, MessageEmbed } = require('discord.js')

const data = [
    { members: 1946, date: '10/1/2020' },
    { members: 2011, date: '10/2/2020' },
    { members: 2072, date: '10/3/2020' },
    { members: 2119, date: '10/4/2020' },
    { members: 2172, date: '10/5/2020' }
    ];

const members = []
const dates = []

for (const item of data) {
    members.push(item.members)
    dates.push(item.date)
}

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
        const config = {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Discord Messages',
                    data: members,
                    backgroundColor: [
                        'rgba(0,152,255,0.5)'
                    ],
                    borderColor: [
                        'rgb(0,152,255)'
                    ],
                    borderWidth: 1,
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