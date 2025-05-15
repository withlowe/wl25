import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { notFound } from "next/navigation"
import Link from "next/link"
import { remark } from "remark"
import html from "remark-html"

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

    // Extract metadata
    const title = data.title || slug

    // Process the content to fix image paths and convert to HTML
    const processedContent = processContent(content)

    return (
      <article className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-normal">{title}</h1>
        </div>

        <div
          className="prose dark:prose-invert prose-lg max-w-none font-serif"
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />

        <div className="mt-16">
          <Link href="/notes" className="back-link">
            ← Back to notes
          </Link>
        </div>
      </article>
    )
  } catch (error) {
    console.error(`Error rendering note page for slug ${slug}:`, error)
    notFound()
  }
}

// Process content to fix image paths and convert to HTML
function processContent(content: string): string {
  try {
    // Fix image paths in markdown
    const fixedContent = content.replace(/!\[(.*?)\]$$((?!http|https|\/|data:image).*?)$$/g, "![$1](/$2)")

    // Convert markdown to HTML
    const processedContent = remark()
      .use(html, { sanitize: false }) // Don't sanitize to allow custom HTML
      .processSync(fixedContent)

    // Further process HTML to ensure image paths are correct
    let htmlContent = processedContent.toString()

    // Fix image src attributes in HTML
    htmlContent = htmlContent.replace(
      /<img([^>]*)src="((?!http|https|\/|data:image).*?)"([^>]*)>/g,
      '<img$1src="/$2"$3>',
    )

    // Add loading="lazy" and class for styling
    htmlContent = htmlContent.replace(
      /<img([^>]*)>/g,
      '<img$1 loading="lazy" class="rounded-md max-w-full h-auto my-8">',
    )

    return htmlContent
  } catch (error) {
    console.error("Error processing content:", error)
    return content
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
