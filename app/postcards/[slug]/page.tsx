import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { formatLongDate } from "@/lib/utils"
import { notFound } from "next/navigation"
import Link from "next/link"
import { remark } from "remark"
import html from "remark-html"

export default function PostcardPage({ params }: { params: { slug: string } }) {
  const { slug } = params

  try {
    // Get project data synchronously
    const projectsDirectory = path.join(process.cwd(), "content/projects")

    // Check if the directory exists
    if (!fs.existsSync(projectsDirectory)) {
      console.error(`Projects directory not found: ${projectsDirectory}`)
      notFound()
    }

    // Try both .mdx and .md extensions
    let fullPath = path.join(projectsDirectory, `${slug}.mdx`)
    let fileExists = fs.existsSync(fullPath)

    if (!fileExists) {
      fullPath = path.join(projectsDirectory, `${slug}.md`)
      fileExists = fs.existsSync(fullPath)
    }

    if (!fileExists) {
      console.error(`Project file not found for slug: ${slug}`)
      notFound()
    }

    // Check if the path is a directory (which would cause the EISDIR error)
    const stats = fs.statSync(fullPath)
    if (stats.isDirectory()) {
      console.error(`Expected a file but found a directory: ${fullPath}`)
      notFound()
    }

    // Read and parse the file
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    // Extract metadata
    const title = data.title || slug
    const date = data.date ? formatLongDate(data.date) : ""
    const description = data.description || ""
    const image = data.image || `/placeholder.svg?height=600&width=800&query=${encodeURIComponent(title)}`

    // Process the content to fix image paths and convert to HTML
    const processedContent = processContent(content)

    return (
      <article className="field-article">
        <div className="field-article-hero mb-1">
          <img src={image || "/placeholder.svg"} alt={title} loading="lazy" />
        </div>

        <header className="field-article-header mb-8">
          <div className="font-mono text-sm flex justify-between items-center">
            <span className="text-muted-foreground">{date}</span>
            <span>{title}</span>
          </div>
        </header>

        {description && <div className="mb-8 text-base md:text-lg font-serif italic">{description}</div>}

        <div className="field-article-content">
          <div dangerouslySetInnerHTML={{ __html: processedContent }} />
        </div>

        <footer className="field-article-footer">
          <Link href="/postcards" className="back-link">
            ← Back to postcards
          </Link>
        </footer>
      </article>
    )
  } catch (error) {
    console.error(`Error rendering postcard page for slug ${slug}:`, error)
    notFound()
  }
}

// Process content to fix image paths and convert to HTML
function processContent(content: string): string {
  try {
    // Fix image paths in markdown - ensure they use placeholder images
    const fixedContent = content.replace(
      /!\[(.*?)\]$$((?!http|https|\/placeholder\.svg).+?)$$/g,
      "![$1](/placeholder.svg?height=400&width=600&query=$1)",
    )

    // Convert markdown to HTML
    const processedContent = remark()
      .use(html, { sanitize: false }) // Don't sanitize to allow custom HTML
      .processSync(fixedContent)

    // Further process HTML to ensure image paths are correct
    let htmlContent = processedContent.toString()

    // Fix image src attributes in HTML - ensure they use placeholder images
    htmlContent = htmlContent.replace(
      /<img([^>]*)src="((?!http|https|\/placeholder\.svg).+?)"([^>]*)>/g,
      '<img$1src="/abstract-colorful-swirls.png"$3>',
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
    // Get project data synchronously for metadata
    const projectsDirectory = path.join(process.cwd(), "content/projects")

    if (!fs.existsSync(projectsDirectory)) {
      return {
        title: "Postcard Not Found",
      }
    }

    // Try both .mdx and .md extensions
    let fullPath = path.join(projectsDirectory, `${slug}.mdx`)
    let fileExists = fs.existsSync(fullPath)

    if (!fileExists) {
      fullPath = path.join(projectsDirectory, `${slug}.md`)
      fileExists = fs.existsSync(fullPath)
    }

    if (!fileExists) {
      return {
        title: "Postcard Not Found",
      }
    }

    // Check if the path is a directory
    const stats = fs.statSync(fullPath)
    if (stats.isDirectory()) {
      return {
        title: "Postcard Not Found",
      }
    }

    // Read and parse the file
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data } = matter(fileContents)

    return {
      title: `${data.title || slug} | Postcards`,
      description: data.description || "",
    }
  } catch (error) {
    console.error(`Error generating metadata for slug ${slug}:`, error)
    return {
      title: "Postcard Not Found",
    }
  }
}

export function generateStaticParams() {
  try {
    const projectsDirectory = path.join(process.cwd(), "content/projects")

    // Check if directory exists
    if (!fs.existsSync(projectsDirectory)) {
      return []
    }

    const fileNames = fs.readdirSync(projectsDirectory)
    return fileNames
      .filter((fileName) => {
        // Filter out directories and only include .md and .mdx files
        const fullPath = path.join(projectsDirectory, fileName)
        return !fs.statSync(fullPath).isDirectory() && (fileName.endsWith(".mdx") || fileName.endsWith(".md"))
      })
      .map((fileName) => ({
        slug: fileName.replace(/\.(mdx|md)$/, ""),
      }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}
