import { Post as IPost } from "@/model/Post";
import { InfiniteData, useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { getLikePosts } from "../_lib/getLikePosts";
import Post from "../../_component/Post";
import { Fragment, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import LoginModal from "../../_component/LoginModal";  

type Props = {
  userId: string | null; 
};

export default function LikePosts({ userId }: Props) {
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 로그인 상태 확인
  useEffect(() => {
    if (!userId) {
      setShowLoginModal(true);  // userId가 없으면 로그인 모달을 보여줌
    }
  }, [userId]);

  // 로그인 상태가 아니면 모달 창을 보여줌
  if (!userId) {
    return <LoginModal />;
  }

  // 쿼리 훅을 로그인 상태일 때만 호출
  return <LikePostsContent userId={userId} />;
}

function LikePostsContent({ userId }: { userId: string }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isError,
    error,
  } = useSuspenseInfiniteQuery<
    IPost[],
    Object,
    InfiniteData<IPost[]>,
    [_1: string, _2: string, _3: string],
    number
  >({
    queryKey: ["posts", "likes", userId],
    queryFn: getLikePosts,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.at(-1)?.id,
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
  });

  const { ref, inView } = useInView({
    threshold: 0,
    delay: 0,
  });

  useEffect(() => {
    if (inView) {
      !isFetching && hasNextPage && fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  // 로딩 상태 처리
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // 에러 처리
  if (isError) {
    return (
      <div>
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  return (
    <>
      {data?.pages?.map((page, idx) => (
        <Fragment key={idx}>
          {page?.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </Fragment>
      ))}
      <div ref={ref} style={{ height: 50 }} /> 
    </>
  );
}
