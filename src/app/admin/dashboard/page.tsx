"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";

interface Post {
  id: string;
  title: string;
  category: string;
  date: string;
}

interface Inquiry {
  id: string;
  contact: string;
  address: string;
  details: string;
  status: string;
  date: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'posts' | 'inquiries'>('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'posts') {
      fetchPosts();
    } else {
      fetchInquiries();
    }
  }, [activeTab]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedPosts: Post[] = [];
      querySnapshot.forEach((document) => {
        const data = document.data();
        const date = data.createdAt ? new Date(data.createdAt.toMillis()).toISOString().split('T')[0] : "방금 전";
        fetchedPosts.push({
          id: document.id,
          title: data.title,
          category: data.category,
          date: date,
        });
      });
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("게시글 불러오기 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedInquiries: Inquiry[] = [];
      querySnapshot.forEach((document) => {
        const data = document.data();
        const date = data.createdAt ? new Date(data.createdAt.toMillis()).toISOString().split('T')[0] : "방금 전";
        fetchedInquiries.push({
          id: document.id,
          contact: data.contact,
          address: data.address,
          details: data.details || '-',
          status: data.status || '대기',
          date: date,
        });
      });
      setInquiries(fetchedInquiries);
    } catch (error) {
      console.error("신청 내역 불러오기 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      try {
        await deleteDoc(doc(db, "posts", id));
        setPosts(posts.filter(post => post.id !== id));
        alert("게시글이 삭제되었습니다.");
      } catch (error) {
        console.error("삭제 실패:", error);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (confirm("정말로 이 신청 내역을 삭제하시겠습니까?")) {
      try {
        await deleteDoc(doc(db, "inquiries", id));
        setInquiries(inquiries.filter(inquiry => inquiry.id !== id));
        alert("신청 내역이 삭제되었습니다.");
      } catch (error) {
        console.error("삭제 실패:", error);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 min-h-screen">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary mb-2">관리자 대시보드</h1>
          <p className="text-on-surface-variant">블로그 게시물 및 배달 신청 내역을 관리합니다.</p>
        </div>
        <Link 
          href="/admin/write" 
          className="bg-primary text-on-primary px-6 py-2 rounded-lg hover:bg-primary-container transition-colors shadow-sm font-bold"
        >
          새 글 쓰기
        </Link>
      </div>

      <div className="flex gap-4 mb-6 border-b border-outline-variant/30 pb-2">
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-4 py-2 font-bold tracking-widest ${activeTab === 'posts' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-background'}`}
        >
          게시물 관리
        </button>
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-4 py-2 font-bold tracking-widest ${activeTab === 'inquiries' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-background'}`}
        >
          배달 신청 내역
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            {activeTab === 'posts' ? (
              <tr className="bg-surface-container-low border-b border-outline-variant/30 text-secondary font-label-sm uppercase">
                <th className="p-4">제목</th>
                <th className="p-4 w-32">카테고리</th>
                <th className="p-4 w-32">작성일</th>
                <th className="p-4 w-32 text-center">관리</th>
              </tr>
            ) : (
              <tr className="bg-surface-container-low border-b border-outline-variant/30 text-secondary font-label-sm uppercase">
                <th className="p-4 w-32">신청일</th>
                <th className="p-4 w-40">연락처</th>
                <th className="p-4">희망 배송지</th>
                <th className="p-4">문의내용</th>
                <th className="p-4 w-24 text-center">상태</th>
                <th className="p-4 w-24 text-center">관리</th>
              </tr>
            )}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={activeTab === 'posts' ? 4 : 6} className="p-8 text-center text-on-surface-variant">
                  데이터를 불러오는 중입니다...
                </td>
              </tr>
            ) : activeTab === 'posts' ? (
              posts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-on-surface-variant">
                    작성된 게시글이 없습니다.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="border-b border-outline-variant/20 hover:bg-surface-container/50 transition-colors">
                    <td className="p-4 font-body-md text-on-background">{post.title}</td>
                    <td className="p-4 text-on-surface-variant text-sm">{post.category}</td>
                    <td className="p-4 text-on-surface-variant text-sm">{post.date}</td>
                    <td className="p-4 flex justify-center gap-2">
                      <button onClick={() => handleDeletePost(post.id)} className="text-error hover:underline text-sm px-2">삭제</button>
                    </td>
                  </tr>
                ))
              )
            ) : (
              inquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-on-surface-variant">
                    접수된 생수배달 신청이 없습니다.
                  </td>
                </tr>
              ) : (
                inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="border-b border-outline-variant/20 hover:bg-surface-container/50 transition-colors">
                    <td className="p-4 text-on-surface-variant text-sm">{inquiry.date}</td>
                    <td className="p-4 font-bold text-on-background">{inquiry.contact}</td>
                    <td className="p-4 text-on-surface-variant">{inquiry.address}</td>
                    <td className="p-4 text-on-surface-variant text-sm">{inquiry.details}</td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-1 bg-surface-container-high text-xs rounded-full">{inquiry.status}</span>
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleDeleteInquiry(inquiry.id)} className="text-error hover:underline text-sm px-2">삭제</button>
                    </td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
