"use client"

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getWomenPosts } from "../_lib/getWomenPosts";
import Post from "./Post";
import type { Post as IPost } from "@/model/Post";

export default function WomenPosts() {
  const { data } = useSuspenseQuery<IPost[]>({
    queryKey: ['posts', 'womens'], 
    queryFn: getWomenPosts,
    staleTime: 60 * 1000, //fresh -> stale로 바뀌는 시간, gcTime보다 작아야함
    gcTime: 300 * 1000, //캐싱한 데이터가 없어지는 시간
    
  });

  console.log(data)

  return data?.map((post) => (
    <Post key={post.postId} post={post}/>
  ))
}