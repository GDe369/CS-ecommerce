import { Outlet } from "react-router-dom";
import Header from "../components/client/Header"; // Sửa 'Footer' thành 'Header' ở đây
import Footer from "../components/client/Footer";

export default function ClientLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
