import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import html from "remark-html"
import { notFound } from "next/navigation"
import Link from "next/link"

export default function PhotoPage({ params }: { params: { slug: string } }) {
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

    // Process the content synchronously
    const processedContent = remark().use(html).processSync(content)
    const contentHtml = processedContent.toString()

    // Extract metadata
    const title = data.title || slug
    const description = data.description || ""

    return (
      <article className="prose dark:prose-invert">
        <h1 className="font-medium">{title}</h1>
        {description && <p className="text-lg mb-8">{description}</p>}
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        <Link href="/photos" className="back-link">
          ← Back to photos
        </Link>
      </article>
    )
  } catch (error) {
    console.error(`Error rendering photo page for slug ${slug}:`, error)
    notFound()
  }
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params

  try {
    // Get project data synchronously for metadata
    const projectsDirectory = path.join(process.cwd(), "content/projects")

    if (!fs.existsSync(projectsDirectory)) {
      return {
        title: "Photo Not Found",
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
        title: "Photo Not Found",
      }
    }

    // Check if the path is a directory
    const stats = fs.statSync(fullPath)
    if (stats.isDirectory()) {
      return {
        title: "Photo Not Found",
      }
    }

    // Read and parse the file
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data } = matter(fileContents)

    return {
      title: `${data.title || slug} | Photos`,
      description: data.description || "",
    }
  } catch (error) {
    console.error(`Error generating metadata for slug ${slug}:`, error)
    return {
      title: "Photo Not Found",
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
