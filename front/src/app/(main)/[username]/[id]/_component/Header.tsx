"use client";

import { useEffect, useState } from 'react';
import SeeMore from './SeeMore';
import style from './header.module.css';
import { useRouter } from 'next/navigation';
import { Post } from '@/model/Post';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';

type Props = {
  post: Post;
};

export default function Header({ post }: Props) {
  const [liked, setLiked] = useState(false); // 좋아요 상태
  const [likeCount, setLikeCount] = useState(post.likeCount); // 좋아요 수
  const [currentUser, setCurrentUser] = useState<string | null>(null); // 로그인된 사용자 ID
  const router = useRouter();
  const queryClient = useQueryClient();

  // 현재 로그인한 사용자의 정보
  const fetchCurrentUser = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_SERVER}/api/current-user`, {
      method: 'GET',
      credentials: 'include', // 세션 쿠키를 함께 전송
    });

    if (!response.ok) {
      throw new Error('Failed to fetch current user');
    }

    const user = await response.json();
    return user.loginId; // 로그인한 사용자의 id 반환
  };

  // 사용자가 해당 게시글에 좋아요 눌렀는지 확인
  const fetchLikes = async (loginId: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_SERVER}/photo/find/${post.id}/likes`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch likes');
    }

    const likes = await response.json();

    // 현재 로그인한 사용자가 좋아요를 눌렀는지 확인
    const userLiked = likes.some((like: { loginId: string }) => like.loginId === loginId);
    setLiked(userLiked);
  };

  useEffect(() => {
    // 컴포넌트가 마운트될 때 현재 로그인한 사용자 정보를 가져오고, 좋아요 상태를 확인
    fetchCurrentUser()
      .then((loginId) => {
        setCurrentUser(loginId);
        return fetchLikes(loginId); // 좋아요 상태 확인
      })
      .catch((error) => console.error('Error fetching current user or likes:', error));
  }, []);

  // 서버에 좋아요 상태 변경 요청 전송
  const updateLikeCount = (isLike: boolean) => {
    if (!process.env.NEXT_PUBLIC_BACKEND_API_SERVER) {
      throw new Error('NEXT_PUBLIC_BACKEND_API_SERVER environment variable is not set');
    }

    if (!post.id) {
      throw new Error('Post ID is not defined');
    }
    const url = `${process.env.NEXT_PUBLIC_BACKEND_API_SERVER}/photo/find/${post.id}/likes`;

    return fetch(url, {
      method: 'GET',
      credentials: 'include', // 세션 쿠키 포함
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isLike }), // 서버에 isLike 플래그를 전송
    }).then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    });
  };

  // 좋아요 눌렀을 경우
  const likeMutation = useMutation({
    mutationFn: () => updateLikeCount(true),
    onMutate: () => {
      setLiked(true);
      setLikeCount((prev) => prev + 1);

      queryClient.setQueryData(['posts'], (oldData: InfiniteData<Post[]> | undefined) => {
        if (oldData) {
          const updatedPages = oldData.pages.map((page) =>
            page.map((postItem) =>
              postItem.id === post.id
                ? { ...postItem, likeCount: postItem.likeCount + 1 }
                : postItem
            )
          );
          return { ...oldData, pages: updatedPages };
        }
        return oldData;
      });
    },
    onError: () => {
      console.error('Error occurred while liking the post');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  // 좋아요 취소했을 경우
  const unlikeMutation = useMutation({
    mutationFn: () => updateLikeCount(false),
    onMutate: () => {
      setLiked(false);
      setLikeCount((prev) => prev - 1);

      queryClient.setQueryData(['posts'], (oldData: InfiniteData<Post[]> | undefined) => {
        if (oldData) {
          const updatedPages = oldData.pages.map((page) =>
            page.map((postItem) =>
              postItem.id === post.id
                ? { ...postItem, likeCount: postItem.likeCount - 1 }
                : postItem
            )
          );
          return { ...oldData, pages: updatedPages };
        }
        return oldData;
      });
    },
    onError: () => {
      console.error('Error occurred while unliking the post');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  // 핸들러
  const handleHeartClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    if (liked) {
      unlikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  };

  return (
    <div className={style.header}>
      <button className={style.backButton} onClick={() => router.back()}>
        <svg aria-label="돌아가기" width={24} role="img" viewBox="0 0 24 24">
          <path d="M21 17.502a.997.997 0 0 1-.707-.293L12 8.913l-8.293 8.296a1 1 0 1 1-1.414-1.414l9-9.004a1.03 1.03 0 0 1 1.414 0l9 9.004A1 1 0 0 1 21 17.502Z" transform="rotate(270 12 12)" />
        </svg>
      </button>
      <div className={style.like}>
        <button onClick={handleHeartClick}>
          {liked ? (
            <svg width={25} viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.373 20.8056C14.7475 23.4311 13.2725 26.992 13.2725 30.7051C13.2725 34.4181 14.7475 37.9791 17.373 40.6046L31.5151 54.7467L38.5862 61.8178C39.3672 62.5988 40.6335 62.5988 41.4146 61.8178L48.4857 54.7467L62.6278 40.6046C65.2533 37.9791 66.7283 34.4181 66.7283 30.7051C66.7283 26.992 65.2533 23.4311 62.6278 20.8056C60.0023 18.1801 56.4413 16.7051 52.7283 16.7051C49.0153 16.7051 45.4543 18.1801 42.8288 20.8056L40.6914 22.943C40.3098 23.3246 39.691 23.3246 39.3094 22.943L37.172 20.8056C34.5464 18.1801 30.9855 16.7051 27.2725 16.7051C23.5594 16.7051 19.9985 18.1801 17.373 20.8056Z" fill="#FF0000" />
            </svg>
          ) : (
            <svg width={25} viewBox="0 0 24 24" aria-hidden="true">
              <g>
                <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01 1.102 1.81.842 4.17-.514 6.67z" fill="#000" />
              </g>
            </svg>
          )}
        </button>
        <span>{likeCount}</span>
      </div>
      <SeeMore />
    </div>
  );
}
