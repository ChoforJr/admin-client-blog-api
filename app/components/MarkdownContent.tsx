import React, { type ReactNode } from "react";

function safeHref(value: string): string | null {
  try {
    const url = new URL(value, "https://blog.invalid");
    return ["http:", "https:", "mailto:"].includes(url.protocol) ? value : null;
  } catch {
    return null;
  }
}

function inlineContent(value: string): ReactNode[] {
  const tokenPattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  return value.split(tokenPattern).filter(Boolean).map((token, index) => {
    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={index}>{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith("*") && token.endsWith("*")) {
      return <em key={index}>{token.slice(1, -1)}</em>;
    }
    if (token.startsWith("`") && token.endsWith("`")) {
      return <code className="rounded bg-forest/10 px-1.5 py-0.5 text-[0.9em]" key={index}>{token.slice(1, -1)}</code>;
    }
    const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const href = safeHref(link[2]);
      return href ? (
        <a className="font-semibold text-forest underline underline-offset-2" href={href} key={index} rel="noreferrer" target="_blank">
          {link[1]}
        </a>
      ) : <span key={index}>{link[1]}</span>;
    }
    return <span key={index}>{token}</span>;
  });
}

function isBlockStart(line: string): boolean {
  return /^(#{1,3}\s|>\s?|[-*]\s+|\d+\.\s+|---+$)/.test(line);
}

export function MarkdownContent({
  content,
  className = "",
}: {
  content: string;
  className?: string;
}) {
  const lines = content.replace(/\r\n?/g, "\n").split("\n");
  const blocks: ReactNode[] = [];

  for (let index = 0; index < lines.length;) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      const Heading = `h${heading[1].length}` as "h1" | "h2" | "h3";
      blocks.push(<Heading className="my-4 font-bold leading-tight" key={index}>{inlineContent(heading[2])}</Heading>);
      index += 1;
      continue;
    }
    if (/^---+$/.test(line.trim())) {
      blocks.push(<hr className="my-5 border-current/20" key={index} />);
      index += 1;
      continue;
    }
    if (/^>\s?/.test(line)) {
      blocks.push(
        <blockquote className="my-3 border-l-4 border-current/25 pl-4 italic" key={index}>
          {inlineContent(line.replace(/^>\s?/, ""))}
        </blockquote>,
      );
      index += 1;
      continue;
    }

    const listMatch = line.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
    if (listMatch) {
      const ordered = /^\d/.test(listMatch[2]);
      const items: ReactNode[] = [];
      while (index < lines.length) {
        const item = lines[index].match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
        if (!item || /^\d/.test(item[2]) !== ordered) break;
        items.push(<li key={index}>{inlineContent(item[3])}</li>);
        index += 1;
      }
      const List = ordered ? "ol" : "ul";
      blocks.push(<List className={`my-3 space-y-1 pl-6 ${ordered ? "list-decimal" : "list-disc"}`} key={index}>{items}</List>);
      continue;
    }

    const paragraph: string[] = [];
    while (index < lines.length && lines[index].trim() && !isBlockStart(lines[index])) {
      paragraph.push(lines[index]);
      index += 1;
    }
    blocks.push(
      <p className="my-3 whitespace-pre-wrap" key={index}>
        {paragraph.map((part, partIndex) => (
          <span key={partIndex}>{inlineContent(part)}{partIndex < paragraph.length - 1 && <br />}</span>
        ))}
      </p>,
    );
  }

  return <div className={className}>{blocks}</div>;
}
