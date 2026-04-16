import { useState } from "react";
import RegisterForm from "./RegisterForm";
import OtpVerification from "./OtpVerification";

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-12">
      <div className="bg-white p-10 rounded-[3.5rem] shadow-3d-convex border border-white/50 w-full max-w-lg">
        <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter uppercase text-center">
          <span>Đăng ký</span>
        </h2>

        {step === 1 ? (
          <RegisterForm
            formData={formData}
            setFormData={setFormData}
            onSuccess={() => setStep(2)}
          />
        ) : (
          <OtpVerification
            formData={formData}
            setFormData={setFormData}
            onBack={() => setStep(1)}
          />
        )}
      </div>
    </div>
  );
}
