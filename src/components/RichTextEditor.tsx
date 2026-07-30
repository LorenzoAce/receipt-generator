import { useEffect, useMemo, useRef } from "react";
import { AlignCenter, AlignLeft, AlignRight, Bold, Eraser, Italic, Underline } from "lucide-react";
import { cn } from "../lib/utils";
import { sanitizeRichTextHtml } from "../utils/richText";

type RichTextEditorProps = {
  html: string;
  onChange: (html: string) => void;
  baseFontFamily: string;
  baseFontSize: number;
  baseAlignment: "left" | "center" | "right";
  baseLetterSpacing: number;
  placeholder?: string;
};

type ToolbarAction = {
  label: string;
  icon: typeof Bold;
  command: string;
  value?: string;
};

const INLINE_ACTIONS: ToolbarAction[] = [
  { label: "Grassetto", icon: Bold, command: "bold" },
  { label: "Corsivo", icon: Italic, command: "italic" },
  { label: "Sottolineato", icon: Underline, command: "underline" },
];

const ALIGN_ACTIONS: Array<{ label: string; icon: typeof AlignLeft; command: string }> = [
  { label: "Sinistra", icon: AlignLeft, command: "justifyLeft" },
  { label: "Centrato", icon: AlignCenter, command: "justifyCenter" },
  { label: "Destra", icon: AlignRight, command: "justifyRight" },
];

export function RichTextEditor({
  html,
  onChange,
  baseFontFamily,
  baseFontSize,
  baseAlignment,
  baseLetterSpacing,
  placeholder = "Scrivi o incolla qui il tuo testo",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const sanitizedHtml = useMemo(() => sanitizeRichTextHtml(html), [html]);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    if (editorRef.current.innerHTML !== sanitizedHtml) {
      editorRef.current.innerHTML = sanitizedHtml;
    }
  }, [sanitizedHtml]);

  const syncEditorValue = () => {
    if (!editorRef.current) {
      return;
    }

    const nextHtml = sanitizeRichTextHtml(editorRef.current.innerHTML);

    if (editorRef.current.innerHTML !== nextHtml) {
      editorRef.current.innerHTML = nextHtml;
    }

    onChange(nextHtml);
  };

  const handleCommand = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    syncEditorValue();
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {INLINE_ACTIONS.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.command}
              type="button"
              onClick={() => handleCommand(action.command, action.value)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition duration-200 hover:border-blue-200 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <Icon className="h-4 w-4" />
              {action.label}
            </button>
          );
        })}

        {ALIGN_ACTIONS.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.command}
              type="button"
              onClick={() => handleCommand(action.command)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition duration-200 hover:border-blue-200 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <Icon className="h-4 w-4" />
              {action.label}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => handleCommand("removeFormat")}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition duration-200 hover:border-blue-200 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          <Eraser className="h-4 w-4" />
          Pulisci formato
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={syncEditorValue}
        onBlur={syncEditorValue}
        onDoubleClick={(event) => event.stopPropagation()}
        data-placeholder={placeholder}
        className={cn(
          "min-h-[220px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 empty:before:pointer-events-none empty:before:text-slate-400 empty:before:content-[attr(data-placeholder)] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-blue-500/20",
          "[&_a]:text-blue-600 [&_a]:underline [&_div]:min-h-[1.2em] [&_p]:my-0 [&_ul]:my-0 [&_ol]:my-0",
        )}
        style={{
          fontFamily: baseFontFamily,
          fontSize: `${baseFontSize}px`,
          textAlign: baseAlignment,
          letterSpacing: `${baseLetterSpacing}px`,
        }}
      />

      <p className="text-xs text-slate-500 dark:text-slate-400">
        Qui puoi incollare testo formattato. Font, grassetto, corsivo, sottolineature e allineamenti vengono mantenuti.
      </p>
    </div>
  );
}
