import { Post } from "@/model/Post";
import { QueryFunction } from "@tanstack/react-query";

export const getSalonPosts: QueryFunction<Post[], [_1: string, _2: string]>
  = async ({queryKey}) => {
    const [_1, salonName] = queryKey;
    const res = await fetch(`http://localhost:9090/api/salon/${salonName}`, {
      next: {
        tags: ['salon', salonName],
      },
      cache: 'no-store',
    });

    if(!res.ok) {
      throw new Error('Failed to fetch data');
    }

    return res.json();
  }