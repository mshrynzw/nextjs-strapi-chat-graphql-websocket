// backend/src/api/chat/controllers/chat.js
module.exports = {
  async create(ctx) {
    const { userId, text } = ctx.request.body;

    if (!userId || !text) {
      return ctx.badRequest('userId and text are required fields.');
    }

    try {
      const chat = await strapi.services.chat.create({ userId, text });
      strapi.io.emit('chat:create', chat); // WebSocketで新しいチャットを通知
      return chat;
    } catch (error) {
      strapi.log.error("Error creating chat:", error);
      return ctx.internalServerError('An error occurred while creating the chat.');
    }
  },
};
