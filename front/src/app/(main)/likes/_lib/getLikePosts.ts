import { QueryFunction } from "@tanstack/react-query";
import { Post } from "@/model/Post";


// JWT 토큰을 디코딩하는 함수?
function parseJwt(token: string) {
  const base64Url = token.split('.')[1]; // JWT의 Payload 부분 추출
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
      .join('')
  );

  return JSON.parse(jsonPayload); // Payload를 JSON 형태로 반환
}


// 로그인 상태 확인 함수
function getLoginIdFromToken(): string | null {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  const decodedToken = parseJwt(token);

  const currentTime = Math.floor(Date.now() / 1000);
  if (decodedToken.exp < currentTime) {
    localStorage.removeItem('accessToken');
    return null;
  }

  return decodedToken?.loginId || null;
}

type Props = { pageParam?: number };

export const getLikePosts: QueryFunction<Post[], [_1: string, _2: string, _3: string], number> = async ({ queryKey, pageParam }) => {
  const [_1, _2, userId] = queryKey;

  // 로그인 상태 확인
  if (!userId) {
    throw new Error('로그인이 필요합니다.');
  }

  // pageParam 기본값 처리
  const currentPage = pageParam ?? 0;

  const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_SERVER}/mypage/like?page=${currentPage}&size=15`;
  console.log('API URL:', apiUrl);  // URL 확인

  try {
    const res = await fetch(apiUrl, {
      method: 'GET',  
      cache: 'no-store',
      credentials: 'include',  
    });

    if (!res.ok) {
      console.log('Fetch failed with status:', res.status); 
      throw new Error(`Failed to fetch data: ${res.statusText}`);
    }

    const data = await res.json();
    console.log('Fetched data:', data);  
    return data;
  } catch (error) {
    console.error('Fetch error:', error);  
    throw new Error('Error fetching liked posts');
  }
};

