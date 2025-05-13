import Link from "next/link"
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { formatShortDate, groupByYear } from "@/lib/utils"

export default function NotesPage() {
  try {
    // Get all posts synchronously
    const postsDirectory = path.join(process.cwd(), "content/posts")

    // Check if directory exists
    if (!fs.existsSync(postsDirectory)) {
      return (
        <div>
          <h1>Notes</h1>
          <p>No notes found. Create some in the content/posts directory.</p>
        </div>
      )
    }

    const fileNames = fs.readdirSync(postsDirectory)
    const posts = fileNames
      .filter((fileName) => {
        // Filter out directories and only include .md and .mdx files
        const fullPath = path.join(postsDirectory, fileName)
        return !fs.statSync(fullPath).isDirectory() && (fileName.endsWith(".mdx") || fileName.endsWith(".md"))
      })
      .map((fileName) => {
        const slug = fileName.replace(/\.(mdx|md)$/, "")
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, "utf8")
        const { data } = matter(fileContents)

        return {
          slug,
          title: data.title || slug,
          date: data.date || new Date().toISOString(),
          excerpt: data.excerpt || "",
        }
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Group posts by year
    const postsByYear = groupByYear(posts)

    return (
      <div>
        <h1>Notes</h1>

        <div className="post-list">
          {Object.keys(postsByYear).length === 0 ? (
            <p>No notes found.</p>
          ) : (
            Object.entries(postsByYear).map(([year, yearPosts]) => (
              <div key={year} className="mb-4">
                {yearPosts.map((post, index) => (
                  <div key={post.slug} className="post-row">
                    {index === 0 && <div className="year-heading">{year}</div>}
                    {index !== 0 && <div className="year-heading"></div>}

                    <Link href={`/notes/${post.slug}`} className="post-title">
                      {post.title}
                    </Link>

                    <div className="post-date">{formatShortDate(post.date)}</div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error rendering notes page:", error)
    return (
      <div>
        <h1>Notes</h1>
        <p>An error occurred while loading notes. Please try again later.</p>
      </div>
    )
  }
}
