import {ReactNode} from "react";
import Link from "next/link";
import style from "@/app/(main)/layout.module.css";
import NavMenu from "./_component/NavMenu";

type Props = { children: ReactNode, modal: ReactNode };
export default function AfterLoginLayout({ children, modal }: Props) {
  const me = { // 임시로 내 정보 있는것처럼
    id: 'person'
  }

  return (
    <div className={style.container}>
      <main className={style.main}>
        {children}
      </main>
      <div className={style.bottomSectionWrapper}>
        <div className={style.bottomSectionInner}>
          <nav className={style.nav}>
            <NavMenu/>
          </nav>
        </div>
      </div>
      {modal}
    </div>
  )
}