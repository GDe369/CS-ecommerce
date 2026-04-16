import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getConversations,
  sendMessage,
  getChatHistory,
} from "../../services/messageService";
import {
  startSignalRConnection,
  stopSignalRConnection,
} from "../../services/signalRService";
import { MessageSquare, Send, User, CheckCheck, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [activeMessages, setActiveMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const scrollRef = useRef(null);
  const { user } = useAuth();

  const ADMIN_ID = user?.id ?? 1;
  const currentUserId = user?.id;

  // Tìm hội thoại hiện tại để lấy thông tin Partner
  const currentChat = conversations.find((c) => c.partnerId === selectedUser);

  const loadConversations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await getConversations();
      setConversations(data);

      // Nếu chưa chọn user nào, tự động chọn người đầu tiên trong danh sách
      if (!selectedUser && data.length > 0) {
        const firstPartnerId = data[0].partnerId;
        if (firstPartnerId) {
          handleSelectUser(firstPartnerId);
        }
      }
    } catch (err) {
      toast.error("Không thể tải danh sách hội thoại");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = async (userId) => {
    if (!userId) return;
    setSelectedUser(userId);
    setChatLoading(true);
    try {
      const history = await getChatHistory(userId);
      // Log để bạn kiểm tra cấu trúc dữ liệu thực tế từ API
      console.log("Lịch sử chat với user " + userId, history);
      setActiveMessages(history);
    } catch (err) {
      toast.error("Không thể tải lịch sử chat");
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const normalizeHubMessage = (message) => ({
      id: message.id ?? message.Id,
      senderId: message.senderId ?? message.SenderId,
      receiverId: message.receiverId ?? message.ReceiverId,
      content: message.content ?? message.Content,
      sentAt: message.sentAt ?? message.SentAt,
    });

    const startRealtime = async () => {
      if (!user) return;

      await startSignalRConnection(user.id, (message) => {
        if (!isMounted) return;

        const normalized = normalizeHubMessage(message);
        const otherUserId =
          normalized.senderId === currentUserId
            ? normalized.receiverId
            : normalized.senderId;

        const isCurrentConversation = selectedUser === otherUserId;

        setConversations((prev) => {
          const existed = prev.find((c) => c.partnerId === otherUserId);
          const updatedConversation = {
            partnerId: otherUserId,
            partnerName: existed?.partnerName || `User #${otherUserId}`,
            partnerAvatar: existed?.partnerAvatar,
            content: normalized.content,
            sentAt: normalized.sentAt,
            senderId: normalized.senderId,
            receiverId: normalized.receiverId,
          };

          return [
            updatedConversation,
            ...prev.filter((c) => c.partnerId !== otherUserId),
          ];
        });

        if (isCurrentConversation) {
          setActiveMessages((prev) => {
            if (normalized.id && prev.some((m) => m.id === normalized.id))
              return prev;
            return [...prev, normalized];
          });
        }
      });
    };

    startRealtime();

    return () => {
      isMounted = false;
      stopSignalRConnection().catch((error) => {
        console.warn("Failed to stop SignalR connection:", error);
      });
    };
  }, [user]);

  useEffect(() => {
    // Cuộn xuống cuối khi có tin nhắn mới hoặc đổi user
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedUser) return;

    const payload = {
      receiverId: parseInt(selectedUser),
      content: inputMessage,
    };

    try {
      const sentMsg = await sendMessage(payload);
      // Thêm tin nhắn mới vào danh sách hiển thị ngay lập tức
      setActiveMessages((prev) => [...prev, sentMsg]);
      setInputMessage("");

      // Cập nhật lại danh sách hội thoại bên trái để hiện nội dung mới nhất
      const updatedConvs = await getConversations();
      setConversations(updatedConvs);
    } catch (err) {
      toast.error("Gửi thất bại");
    }
  };

  return (
    <div className="p-8 h-[calc(100vh-40px)] flex flex-col bg-slate-50/50 font-sans">
      {/* HEADER TRANG */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 italic tracking-tighter">
          <MessageSquare className="text-blue-600" size={32} /> CHAT HỖ TRỢ
        </h1>
        <button
          onClick={loadConversations}
          className="p-2 hover:bg-white rounded-full transition-all text-slate-400 shadow-sm"
        >
          <Loader2
            size={20}
            className={loading ? "animate-spin text-blue-500" : ""}
          />
        </button>
      </div>

      <div className="flex-1 bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden flex">
        {/* SIDEBAR: Danh sách người nhắn */}
        <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/20">
          <div className="p-6 border-b border-slate-100 font-bold text-[11px] uppercase tracking-[0.2em] text-slate-400">
            Hội thoại gần đây
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="p-10 text-center animate-pulse text-slate-300 font-bold italic">
                Đang tải...
              </div>
            ) : (
              conversations.map((conv, index) => {
                const pId = conv.partnerId;
                const pName = conv.partnerName;
                const pAvt = conv.partnerAvatar;
                const isActive = selectedUser === pId;

                return (
                  <div
                    key={`conv-${pId}-${index}`}
                    onClick={() => handleSelectUser(pId)}
                    className={`p-5 cursor-pointer transition-all border-l-4 ${
                      isActive
                        ? "bg-white border-blue-600 shadow-md z-10 scale-[1.02]"
                        : "border-transparent hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-800 rounded-2xl shrink-0 flex items-center justify-center font-black text-white shadow-lg overflow-hidden border-2 border-white">
                        {pAvt ? (
                          <img
                            src={pAvt}
                            alt="avt"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{pName?.charAt(0).toUpperCase() || "U"}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <p className="font-bold text-slate-900 text-sm truncate uppercase">
                            {pName || `User #${pId}`}
                          </p>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {conv.sentAt &&
                              new Date(conv.sentAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium leading-relaxed">
                          {conv.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* KHUNG CHAT CHÍNH */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg overflow-hidden border-2 border-white">
                      {currentChat?.partnerAvatar ? (
                        <img
                          src={currentChat.partnerAvatar}
                          alt="avt"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={20} />
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
                  </div>
                  <div>
                    <div className="font-black text-slate-900 text-base tracking-tight uppercase">
                      {currentChat?.partnerName ||
                        `Khách hàng #${selectedUser}`}
                    </div>
                    <div className="text-[10px] text-emerald-500 font-extrabold flex items-center gap-1.5 uppercase tracking-widest">
                      Đang trực tuyến
                    </div>
                  </div>
                </div>
              </div>

              {/* Danh sách tin nhắn */}
              <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-slate-50/40 custom-scrollbar">
                {chatLoading ? (
                  <div className="h-full flex flex-col items-center justify-center gap-3">
                    <Loader2 className="animate-spin text-blue-500" size={32} />
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                      Đang kết nối lịch sử...
                    </span>
                  </div>
                ) : (
                  activeMessages.map((msg, idx) => {
                    // SỬA LỖI TẠI ĐÂY: Dùng == để so sánh linh hoạt kiểu dữ liệu
                    const isMe = msg.senderId === ADMIN_ID;

                    return (
                      <div
                        key={msg.id || idx}
                        className={`flex ${isMe ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2`}
                      >
                        <div
                          className={`max-w-[65%] p-4 rounded-[1.8rem] text-[13px] font-semibold shadow-sm leading-relaxed ${
                            isMe
                              ? "bg-slate-900 text-white rounded-br-none"
                              : "bg-white text-slate-700 rounded-tl-none border border-slate-100 shadow-md"
                          }`}
                        >
                          {msg.content}
                          <div
                            className={`text-[9px] mt-2 flex items-center gap-1.5 font-bold opacity-60 ${isMe ? "text-slate-300" : "text-slate-400"}`}
                          >
                            {msg.sentAt &&
                              new Date(msg.sentAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            {isMe && (
                              <CheckCheck size={12} className="text-blue-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={scrollRef} />
              </div>

              {/* Ô nhập liệu */}
              <form
                onSubmit={handleSend}
                className="p-6 bg-white border-t border-slate-100 flex gap-4 items-center"
              >
                <input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 px-7 py-4 bg-slate-100 rounded-3xl outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-bold text-xs shadow-inner"
                  placeholder="Viết phản hồi của bạn..."
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="p-4 bg-blue-600 text-white rounded-[1.2rem] shadow-xl hover:bg-slate-900 transition-all active:scale-90 disabled:opacity-40 disabled:grayscale"
                >
                  <Send size={22} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-200">
              <div className="w-24 h-24 bg-slate-50 rounded-4xl flex items-center justify-center mb-4">
                <MessageSquare
                  size={48}
                  className="opacity-20 text-slate-400"
                />
              </div>
              <p className="font-black text-slate-300 uppercase tracking-[0.3em] text-[11px]">
                Bắt đầu cuộc trò chuyện
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
