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

  return (
    <>
      <Card
        className={style.card}
        hoverable
        cover={<img src={target.Images[0]?.link} alt="example"/>}
        >
        <Meta title="리프컷" description="쎄임|한남동"/>
      </Card>
    </>
  )

}