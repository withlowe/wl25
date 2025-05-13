import type { MDXComponents } from "mdx/types"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    img: (props: any) => (
      <div className="my-8">
        <img src={props.src || ""} alt={props.alt || ""} className="rounded-sm max-w-full h-auto" />
      </div>
    ),
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
