import Link from "next/link"
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { formatShortDate, groupByYear } from "@/lib/utils"

export default function PhotosPage() {
  try {
    // Get all projects synchronously
    const projectsDirectory = path.join(process.cwd(), "content/projects")

    // Check if directory exists
    if (!fs.existsSync(projectsDirectory)) {
      return (
        <div>
          <h1>Photos</h1>
          <p>No photos found. Create some in the content/projects directory.</p>
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
        }
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Group projects by year
    const projectsByYear = groupByYear(projects)

    return (
      <div>
        <h1>Photos</h1>

        <div className="post-list">
          {Object.keys(projectsByYear).length === 0 ? (
            <p>No photos found.</p>
          ) : (
            Object.entries(projectsByYear).map(([year, yearProjects]) => (
              <div key={year} className="mb-4">
                {yearProjects.map((project, index) => (
                  <div key={project.slug} className="post-row">
                    {index === 0 && <div className="year-heading">{year}</div>}
                    {index !== 0 && <div className="year-heading"></div>}

                    <Link href={`/photos/${project.slug}`} className="post-title">
                      {project.title}
                    </Link>

                    <div className="post-date">{formatShortDate(project.date)}</div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error rendering photos page:", error)
    return (
      <div>
        <h1>Photos</h1>
        <p>An error occurred while loading photos. Please try again later.</p>
      </div>
    )
  }
}
