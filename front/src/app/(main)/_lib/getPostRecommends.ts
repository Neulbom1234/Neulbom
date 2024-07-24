export async function getPostRecommends() {
  const res = await fetch(`http://localhost:9090/api/postRecommends`,{
    next: {
      tags: ['posts', 'recommends'], //캐시 초기화를 위한 태그
    }
  })

  if(!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
};