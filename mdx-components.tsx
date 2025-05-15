import type { MDXComponents } from "mdx/types"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    img: (props: any) => {
      // Ensure the src path is properly formatted for public directory
      let src = props.src || ""
      if (src && !src.startsWith("/") && !src.startsWith("http")) {
        src = `/${src}`
      }

      return (
        <div className="my-8">
          <img src={src || "/placeholder.svg"} alt={props.alt || ""} className="rounded-sm max-w-full h-auto" />
        </div>
      )
    },
    a: (props: any) => (
      <a
        href={props.href || "#"}
        className="text-gray-900 underline underline-offset-4 hover:text-gray-600 transition-colors"
      >
        {props.children}
      </a>
    ),
  }
}
