import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import matter from "gray-matter"

export async function GET() {
  try {
    // Get all posts
    const postsDirectory = path.join(process.cwd(), "content/posts")

    // Check if directory exists
    if (!fs.existsSync(postsDirectory)) {
      return NextResponse.json({ error: "No posts found" }, { status: 404 })
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

    // Generate RSS XML
    const siteUrl = process.env.SITE_URL || "https://yourblog.com"
    const now = new Date().toUTCString()

    let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>My Blog</title>
    <description>A collection of notes and postcards</description>
    <link>${siteUrl}/</link>
    <atom:link href="${siteUrl}/api/rss" rel="self" type="application/rss+xml"/>
    <pubDate>${now}</pubDate>
    <lastBuildDate>${now}</lastBuildDate>
    <generator>Next.js</generator>`

    posts.forEach((post) => {
      const postDate = new Date(post.date).toUTCString()
      rss += `
    <item>
      <title>${post.title}</title>
      <description>${post.excerpt}</description>
      <pubDate>${postDate}</pubDate>
      <link>${siteUrl}/notes/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/notes/${post.slug}</guid>
    </item>`
    })

    rss += `
  </channel>
</rss>`

    // Return the RSS feed
    return new NextResponse(rss, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    })
  } catch (error) {
    console.error("Error generating RSS feed:", error)
    return NextResponse.json({ error: "Failed to generate RSS feed" }, { status: 500 })
  }
}
