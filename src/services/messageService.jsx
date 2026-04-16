import apiClient from "./apiClient";

const normalizeMessage = (message) => ({
  id: message.id ?? message.Id,
  senderId: message.senderId ?? message.SenderId,
  receiverId: message.receiverId ?? message.ReceiverId,
  content: message.content ?? message.Content,
  sentAt: message.sentAt ?? message.SentAt,
});

const normalizeConversation = (conversation) => ({
  partnerId: conversation.partnerId ?? conversation.PartnerId,
  partnerName: conversation.partnerName ?? conversation.PartnerName,
  partnerAvatar: conversation.partnerAvatar ?? conversation.PartnerAvatar,
  content: conversation.content ?? conversation.Content,
  sentAt: conversation.sentAt ?? conversation.SentAt,
  senderId: conversation.senderId ?? conversation.SenderId,
  receiverId: conversation.receiverId ?? conversation.ReceiverId,
});

/**
 * Gửi tin nhắn (khớp: POST /api/Messages/send)
 * @param {{ receiverId: number, content: string }} messageData
 */
export const sendMessage = async (messageData) => {
  try {
    const res = await apiClient.post("/messages/send", messageData);
    return normalizeMessage(res.data);
  } catch (error) {
    console.error("Lỗi gửi tin nhắn:", error);
    throw error;
  }
};

/**
 * Lấy lịch sử chat giữa current user và user khác
 * (khớp: GET /api/messages/history/{otherUserId})
 */
export const getChatHistory = async (otherUserId) => {
  try {
    const res = await apiClient.get(`/messages/history/${otherUserId}`);
    return (res.data || []).map(normalizeMessage);
  } catch (error) {
    console.error("Lỗi lấy lịch sử tin nhắn:", error);
    return [];
  }
};

/**
 * Lấy tất cả tin nhắn (raw - chưa group)
 * (khớp: GET /api/Messages)
 */
export const getAllMessages = async () => {
  try {
    const res = await apiClient.get("/messages");
    return (res.data || []).map(normalizeMessage);
  } catch (error) {
    console.error("Lỗi lấy tất cả tin nhắn:", error);
    return [];
  }
};

/**
 * Lấy danh sách hội thoại (đã group theo user)
 * (khớp: GET /api/messages/conversations)
 */
export const getConversations = async () => {
  try {
    const res = await apiClient.get("/messages/conversations");
    return (res.data || []).map(normalizeConversation);
  } catch (error) {
    console.error("Lỗi lấy danh sách hội thoại:", error);
    return [];
  }
};
