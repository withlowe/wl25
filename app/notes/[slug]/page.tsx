import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import html from "remark-html"
import { notFound } from "next/navigation"
import Link from "next/link"

export default function NotePage({ params }: { params: { slug: string } }) {
  const { slug } = params

  try {
    // Get post data synchronously
    const postsDirectory = path.join(process.cwd(), "content/posts")

    // Try both .mdx and .md extensions
    let fullPath = path.join(postsDirectory, `${slug}.mdx`)
    let fileExists = fs.existsSync(fullPath)

    if (!fileExists) {
      fullPath = path.join(postsDirectory, `${slug}.md`)
      fileExists = fs.existsSync(fullPath)
    }

    if (!fileExists) {
      notFound()
    }

    // Check if the path is a directory
    const stats = fs.statSync(fullPath)
    if (stats.isDirectory()) {
      notFound()
    }

    // Read and parse the file
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    // Process the content synchronously
    const processedContent = remark().use(html).processSync(content)
    const contentHtml = processedContent.toString()

    // Extract metadata
    const title = data.title || slug

    return (
      <article className="prose dark:prose-invert">
        <h1 className="font-medium">{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        <Link href="/notes" className="back-link">
          ← Back to notes
        </Link>
      </article>
    )
  } catch (error) {
    console.error(`Error rendering note page for slug ${slug}:`, error)
    notFound()
  }
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params

  try {
    // Get post data synchronously for metadata
    const postsDirectory = path.join(process.cwd(), "content/posts")

    // Try both .mdx and .md extensions
    let fullPath = path.join(postsDirectory, `${slug}.mdx`)
    let fileExists = fs.existsSync(fullPath)

    if (!fileExists) {
      fullPath = path.join(postsDirectory, `${slug}.md`)
      fileExists = fs.existsSync(fullPath)
    }

    if (!fileExists) {
      return {
        title: "Note Not Found",
      }
    }

    // Read and parse the file
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data } = matter(fileContents)

    return {
      title: `${data.title || slug} | Notes`,
      description: data.excerpt || "",
    }
  } catch (error) {
    console.error(`Error generating metadata for slug ${slug}:`, error)
    return {
      title: "Note Not Found",
    }
  }
}
