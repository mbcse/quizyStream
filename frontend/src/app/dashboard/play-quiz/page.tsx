"use client";
import { usePathname, useSearchParams } from 'next/navigation'

export default function Detail() {
  const params  = usePathname()
  const searchParams = useSearchParams()
  // const { id } = router.query;
  const id = 1

  console.log("usePathname", params)
  console.log("searchParams", searchParams)
console.log("id", searchParams.get("id"))
  return (
    <div>
      <h1>Play Quiz Page</h1>
      <p>The ID passed is: {id}</p>
    </div>
  );
}
