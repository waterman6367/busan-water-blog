"use client";

import { useState } from "react";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderModal({ isOpen, onClose }: OrderModalProps) {
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [details, setDetails] = useState("");
  const [agree, setAgree] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agree) {
      alert("개인정보 수집 및 이용에 동의해 주세요.");
      return;
    }

    if (!contact.trim() || !address.trim()) {
      alert("연락처와 희망 배송지를 모두 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "inquiries"), {
        contact,
        address,
        details,
        status: "대기",
        createdAt: serverTimestamp(),
      });
      alert("생수배달 신청이 완료되었습니다. 곧 연락드리겠습니다!");
      onClose();
      // 폼 초기화
      setContact("");
      setAddress("");
      setDetails("");
      setAgree(false);
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      alert("신청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-outline-variant/30">
          <h2 className="font-headline-lg text-2xl text-on-background font-bold">생수배달 신청 및 문의</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-background transition-colors p-1">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="contact" className="font-label-sm tracking-widest text-on-surface-variant uppercase">
              연락처 <span className="text-error">*</span>
            </label>
            <input
              id="contact"
              type="text"
              placeholder="예: 010-1234-5678"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="address" className="font-label-sm tracking-widest text-on-surface-variant uppercase">
              희망 배송지 <span className="text-error">*</span>
            </label>
            <input
              id="address"
              type="text"
              placeholder="예: 부산시 해운대구 센텀중앙로..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="details" className="font-label-sm tracking-widest text-on-surface-variant uppercase">
              문의내용 (선택)
            </label>
            <textarea
              id="details"
              placeholder="필요한 수량, 정기구독 여부 등 추가 문의사항을 적어주세요."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[100px] resize-none"
            />
          </div>

          <div className="flex items-start gap-3 mt-2 bg-surface-container-low p-4 rounded-lg border border-outline-variant/20">
            <input
              id="agree"
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-1 w-5 h-5 accent-primary cursor-pointer"
            />
            <label htmlFor="agree" className="text-sm text-on-surface-variant leading-relaxed cursor-pointer select-none">
              <span className="font-bold text-on-background">개인정보 수집 및 이용 동의 (필수)</span> <br />
              고객님의 연락처와 배송지 정보는 배달 및 상담 목적 외에는 사용되지 않으며, 안전하게 보호됩니다.
            </label>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 bg-surface-container-high text-on-surface rounded-xl font-bold tracking-widest hover:bg-outline-variant transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3.5 bg-primary text-on-primary rounded-xl font-bold tracking-widest hover:bg-on-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "신청 중..." : "신청하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
