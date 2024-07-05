"use client"

import style from './post.module.css'
import Link from 'next/link'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import {faker} from '@faker-js/faker';
import { Card } from 'antd';

const {Meta} = Card;

dayjs.locale('ko');
dayjs.extend(relativeTime)

export default function Post() {
  const target = {
    postId: 1,
    User: {
      id: 'elonmusk',
      nickname: 'Elon Musk',
    },
    content: '클론코딩 라이브로 하니 너무 힘들어요 ㅠㅠ',
    createdAt: new Date(),
    Images: [] as any[],
  }

  target.Images.push(
    {imgageId: 1, link: faker.image.urlLoremFlickr()},
  )
  //card
  //cover -> img
  //body -> meta -> title, description

  return (
    <>
      <div className={style.card}>
        <div className={style.cover}>
          <img src={target.Images[0]?.link} alt=""/>
        </div>
        <div className={style.body}>
          <div className={style.meta}>
            <div className={style.title}>리프펌</div>
            <div className={style.description}>쎄임|서울특별시 용산구</div>
          </div>
        </div>
      </div>
    </>
  )
}