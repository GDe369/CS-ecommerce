import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X, Send, User, Loader2 } from "lucide-react";
import { sendMessage, getChatHistory } from "../../../services/messageService";
import {
  startSignalRConnection,
  stopSignalRConnection,
} from "../../../services/signalRService";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";

export default function ChatBox({ isOpen, onClose, currentProduct }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(false);
  const scrollRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // ID của Admin mặc định là 1
  const ADMIN_ID = 1;
  const currentUserId = user?.id;

  useEffect(() => {
    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        const history = await getChatHistory(ADMIN_ID);
        setMessages(history);
      } catch (err) {
        console.error("Không thể tải tin nhắn cũ");
      } finally {
        setLoadingHistory(false);
      }
    };
    if (isOpen && user) {
      fetchHistory();
    } else {
      setMessages([]);
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (!isOpen || !user) return;

    let isMounted = true;

    const normalizeHubMessage = (message) => ({
      id: message.id ?? message.Id,
      senderId: message.senderId ?? message.SenderId,
      receiverId: message.receiverId ?? message.ReceiverId,
      content: message.content ?? message.Content,
      sentAt: message.sentAt ?? message.SentAt,
    });

    const startRealtime = async () => {
      await startSignalRConnection(user.id, (message) => {
        if (!isMounted) return;

        const normalized = normalizeHubMessage(message);
        const isRelevant =
          normalized.senderId === currentUserId ||
          normalized.receiverId === currentUserId;

        if (!isRelevant) return;

        setMessages((prev) => {
          if (normalized.id && prev.some((m) => m.id === normalized.id)) {
            return prev;
          }
          return [...prev, normalized];
        });
      });
    };

    startRealtime();

    return () => {
      isMounted = false;
      stopSignalRConnection();
    };
  }, [isOpen, user, currentUserId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Vui lòng đăng nhập để gửi tin nhắn.");
      navigate("/login");
      return;
    }

    if (!input.trim()) return;

    const payload = {
      receiverId: ADMIN_ID,
      content: input,
    };

    try {
      const res = await sendMessage(payload);
      // Backend trả về message vừa tạo, ta đưa vào state để hiển thị ngay
      setMessages((prev) => [...prev, res]);
      setInput("");
    } catch (error) {
      toast.error("Lỗi gửi tin nhắn");
    }
  };

  if (!isOpen) return null;

  if (!user) {
    return (
      <div className="fixed bottom-24 right-8 z-50 w-80 md:w-96 bg-white rounded-4xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
        <div className="bg-slate-900 p-5 text-white flex justify-between items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-widest">
              Hỗ trợ Tech3D
            </p>
            <p className="text-xs text-slate-200">
              Bạn cần đăng nhập để sử dụng chat.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 text-center space-y-4">
          <p className="text-sm text-slate-600">
            Đăng nhập để chat với admin và xem lịch sử.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-24 right-8 z-50 w-80 md:w-96 bg-white rounded-4xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="bg-slate-900 p-5 text-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-black">
            T3
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest">
              Hỗ trợ Tech3D
            </p>
            <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>{" "}
              Trực tuyến
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-800 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Gợi ý sản phẩm (Giữ nguyên logic của bạn) */}
      {currentProduct && (
        <div className="p-3 bg-blue-50 border-b border-blue-100 flex items-center gap-3">
          <img
            src={currentProduct.imageUrl}
            className="w-10 h-10 rounded-lg object-cover"
            alt=""
          />
          <div className="flex-1">
            <p className="text-[10px] font-bold text-blue-600 uppercase">
              Đang xem
            </p>
            <p className="text-xs font-bold text-slate-800 truncate">
              {currentProduct.name}
            </p>
          </div>
          <button
            onClick={() =>
              setInput(`Tôi muốn tư vấn về: ${currentProduct.name}`)
            }
            className="p-2 bg-white rounded-lg text-blue-600 shadow-sm hover:bg-blue-600 hover:text-white transition-all"
          >
            <Send size={14} />
          </button>
        </div>
      )}

      {/* Nội dung chat */}
      <div className="h-80 overflow-y-auto p-4 bg-slate-50 space-y-4 custom-scrollbar">
        {loadingHistory ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-slate-300" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-slate-400 text-xs py-10 font-medium italic">
            Chào bạn! Tech3D có thể giúp gì cho bạn?
          </p>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div
                key={index}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-[13px] font-medium shadow-sm ${
                    isMe
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-slate-700 rounded-tl-none border border-slate-100"
                  }`}
                >
                  {msg.content}
                  {msg.sentAt && (
                    <div className="text-[10px] mt-1 text-slate-400 text-right">
                      {new Date(msg.sentAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={scrollRef} />
      </div>

      {/* Ô nhập liệu */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 bg-white border-t flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập tin nhắn..."
          className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 ring-blue-500 transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="p-3 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
