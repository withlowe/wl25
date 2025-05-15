import Link from "next/link"
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { formatLongDate } from "@/lib/utils"

export default function PostcardsPage() {
  try {
    // Get all projects synchronously
    const projectsDirectory = path.join(process.cwd(), "content/projects")

    // Check if directory exists
    if (!fs.existsSync(projectsDirectory)) {
      return (
        <div>
          <h1>Postcards</h1>
          <p>No postcards found. Create some in the content/projects directory.</p>
        </div>
      )
    }

    const fileNames = fs.readdirSync(projectsDirectory)
    const projects = fileNames
      .filter((fileName) => {
        // Filter out directories and only include .md and .mdx files
        const fullPath = path.join(projectsDirectory, fileName)
        return !fs.statSync(fullPath).isDirectory() && (fileName.endsWith(".mdx") || fileName.endsWith(".md"))
      })
      .map((fileName) => {
        const slug = fileName.replace(/\.(mdx|md)$/, "")
        const fullPath = path.join(projectsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, "utf8")
        const { data } = matter(fileContents)

        return {
          slug,
          title: data.title || slug,
          date: data.date || new Date().toISOString(),
          description: data.description || "",
          image: data.image || `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(data.title || slug)}`,
        }
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return (
      <div>
        <h1>Postcards</h1>

        <div className="grid grid-cols-1 gap-12 mt-8">
          {projects.length === 0 ? (
            <p>No postcards found.</p>
          ) : (
            projects.map((project) => (
              <div key={project.slug} className="postcard">
                <Link href={`/postcards/${project.slug}`} className="block">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md mb-3">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-auto object-cover rounded-md"
                    />
                  </div>
                  <div className="font-mono text-sm text-center">
                    <p className="flex justify-between items-center">
                      <span className="text-muted-foreground">{formatLongDate(project.date)}</span>
                      <span>{project.title}</span>
                    </p>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error rendering postcards page:", error)
    return (
      <div>
        <h1>Postcards</h1>
        <p>An error occurred while loading postcards. Please try again later.</p>
      </div>
    )
  }
}
