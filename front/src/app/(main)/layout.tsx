import {ReactNode} from "react";
import Link from "next/link";
import Style from "@/app/(main)/layout.module.css";

type Props = { children: ReactNode, modal: ReactNode };
export default function AfterLoginLayout({ children, modal }: Props) {
  const me = { // 임시로 내 정보 있는것처럼
    id: 'person'
  }

  return (
    <div>
        {children}
        하단 탭바 
        <Link href="/"> 홈</Link>
        <Link href="/search"> 검색</Link>
        <Link href="/post"> 게시글 작성</Link>
        <Link href="/notice"> 알림</Link>
        <Link href={`/${me?.id}`}> 프로필</Link>
        <Link href="/login"> 로그인</Link>
      {modal}
    </div>
  )
}