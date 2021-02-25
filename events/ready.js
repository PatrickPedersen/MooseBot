module.exports = (client) => {
    client.logger.info(`Logged in as ${client.user.tag}! (${client.user.id})`);
}