"use client";

import { Bold, Code, Eye, Heading2, Italic, Link2, List, ListOrdered, Quote } from "lucide-react";
import { useRef, useState } from "react";
import { MarkdownContent } from "./MarkdownContent";

type FormatAction = "bold" | "italic" | "code" | "heading" | "quote" | "bullet" | "number" | "link";

const actions: Array<{ id: FormatAction; label: string; icon: typeof Bold }> = [
  { id: "bold", label: "Bold", icon: Bold },
  { id: "italic", label: "Italic", icon: Italic },
  { id: "heading", label: "Heading", icon: Heading2 },
  { id: "bullet", label: "Bulleted list", icon: List },
  { id: "number", label: "Numbered list", icon: ListOrdered },
  { id: "quote", label: "Quote", icon: Quote },
  { id: "link", label: "Link", icon: Link2 },
  { id: "code", label: "Inline code", icon: Code },
];

export function MarkdownEditor({
  value,
  onChange,
  required = false,
}: {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);

  function applyFormat(action: FormatAction) {
    const field = textareaRef.current;
    if (!field) return;

    const start = field.selectionStart;
    const end = field.selectionEnd;
    const selected = value.slice(start, end) || "your text";
    const before = value.slice(0, start);
    const after = value.slice(end);
    let insertion = selected;
    let selectionStart = start;
    let selectionEnd = start + selected.length;

    if (action === "bold" || action === "italic" || action === "code" || action === "link") {
      const [prefix, suffix] = action === "bold"
        ? ["**", "**"]
        : action === "italic"
          ? ["*", "*"]
          : action === "code"
            ? ["`", "`"]
            : ["[", "](https://example.com)"];
      insertion = `${prefix}${selected}${suffix}`;
      selectionStart = start + prefix.length;
      selectionEnd = selectionStart + selected.length;
      if (action === "link") {
        selectionStart = selectionEnd + 2;
        selectionEnd = selectionStart + "https://example.com".length;
      }
    } else {
      const prefix = action === "heading" ? "## " : action === "quote" ? "> " : action === "number" ? "1. " : "- ";
      insertion = selected.split("\n").map((line) => `${prefix}${line}`).join("\n");
      selectionEnd = start + insertion.length;
    }

    onChange(`${before}${insertion}${after}`);
    requestAnimationFrame(() => {
      field.focus();
      field.setSelectionRange(selectionStart, selectionEnd);
    });
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-forest/15 bg-white shadow-sm" aria-label="Post content editor">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-forest/10 bg-mint/40 px-3 py-3">
        <div className="flex flex-wrap gap-1" role="toolbar" aria-label="Text formatting">
          {actions.map(({ id, label, icon: Icon }) => (
            <button
              aria-label={label}
              className="inline-flex size-9 items-center justify-center rounded-lg text-forest/75 transition hover:bg-white hover:text-forest focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest"
              key={id}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => applyFormat(id)}
              title={label}
              type="button"
            >
              <Icon aria-hidden="true" size={17} />
            </button>
          ))}
        </div>
        <div className="flex rounded-lg bg-white p-1 text-xs font-semibold">
          <button
            aria-pressed={!preview}
            className={`rounded-md px-3 py-1.5 ${!preview ? "bg-forest text-white" : "text-ink/60"}`}
            onClick={() => setPreview(false)}
            type="button"
          >
            Write
          </button>
          <button
            aria-pressed={preview}
            className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 ${preview ? "bg-forest text-white" : "text-ink/60"}`}
            onClick={() => setPreview(true)}
            type="button"
          >
            <Eye aria-hidden="true" size={14} /> Preview
          </button>
        </div>
      </div>
      {preview ? (
        <div className="min-h-72 px-5 py-4 text-base leading-7 text-ink" aria-live="polite">
          {value.trim()
            ? <MarkdownContent content={value} />
            : <p className="text-ink/40">Your formatted post preview will appear here.</p>}
        </div>
      ) : (
        <textarea
          aria-label="Content"
          className="min-h-72 w-full resize-y border-0 bg-white px-5 py-4 font-normal leading-7 text-ink outline-none placeholder:text-ink/35 focus:ring-0"
          onChange={(event) => onChange(event.target.value)}
          placeholder="Start with a story, an idea, or a question…"
          ref={textareaRef}
          required={required}
          value={value}
        />
      )}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-forest/10 px-5 py-3 text-xs text-ink/50">
        <span>Markdown formatting supported · {value.trim().length} characters</span>
        {required && <span>At least 4 characters required</span>}
      </div>
    </section>
  );
}
