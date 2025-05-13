import Link from "next/link"

export default function Home() {
  return (
    <div>
      <h1>About</h1>
      <p>Welcome to my blog. This is a space where I share my notes and photos.</p>
      <p>
        <Link href="/notes">Browse all notes</Link>
      </p>
    </div>
  )
}
