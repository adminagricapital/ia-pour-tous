import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer = ({ content, className = "" }: MarkdownRendererProps) => (
  <div className={`prose prose-sm sm:prose-base max-w-none ${className}`}>
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <h1 className="font-display text-2xl font-bold text-foreground mt-8 mb-4 uppercase">{children}</h1>,
        h2: ({ children }) => <h2 className="font-display text-xl font-bold text-foreground mt-6 mb-3 uppercase">{children}</h2>,
        h3: ({ children }) => <h3 className="font-display text-lg font-semibold text-foreground mt-5 mb-2">{children}</h3>,
        p: ({ children }) => <p className="text-foreground/90 leading-relaxed mb-4">{children}</p>,
        strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
        em: ({ children }) => <em className="italic text-muted-foreground">{children}</em>,
        ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-4 text-foreground/90">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-4 text-foreground/90">{children}</ol>,
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary pl-4 py-2 my-4 bg-primary/5 rounded-r-lg italic text-muted-foreground">
            {children}
          </blockquote>
        ),
        a: ({ href, children }) => <a href={href} className="text-primary hover:underline font-medium" target="_blank" rel="noopener noreferrer">{children}</a>,
        hr: () => <hr className="my-6 border-border" />,
        table: ({ children }) => <div className="overflow-x-auto my-4"><table className="w-full border-collapse border border-border text-sm">{children}</table></div>,
        th: ({ children }) => <th className="border border-border bg-muted px-3 py-2 text-left font-semibold text-foreground">{children}</th>,
        td: ({ children }) => <td className="border border-border px-3 py-2 text-foreground/90">{children}</td>,
        code: ({ children }) => <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">{children}</code>,
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);

export default MarkdownRenderer;
