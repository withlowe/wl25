import Link from "next/link"

export default function Home() {
  return (
    <div>
      <h1>With Lowe</h1>
      <p>A random selection of notes and postcards from my time on planet Earth. Projects of fancy of my own interests, lessons learned and places explored.</p>
      <p>
        <Link href="/notes">Notes</Link>
      </p>
    </div>
  )
}
