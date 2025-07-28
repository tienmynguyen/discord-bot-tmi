module.exports = (client) => {
  console.log("Bot is ready!");
  client.user.setPresence({
    activities: [{ name: "đùa tình cảm" }],
    status: "online",
  });
};
