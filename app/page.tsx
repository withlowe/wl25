import Link from "next/link"
import { RssIcon } from "lucide-react"

export default function Home() {
  return (
    <div>
      <h1>Now</h1>
      <p>Welcome to my blog. This is a space where I share my notes and postcards.</p>

      <div className="my-10">
        <div className="subscribe-container">
          <Link href="/rss.xml" className="subscribe-button">
            <span className="subscribe-text">Subscribe via RSS</span>
            <span className="subscribe-icon">
              <RssIcon size={18} />
            </span>
          </Link>
        </div>
      </div>


    </div>
  )
}
