import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// Lightweight inline markdown renderer: bold, italic, inline code, line breaks
function renderMarkdown(text) {
  if (!text) return null;

  const parts = [];
  // Split on markdown tokens: **bold**, *italic*, `code`, \n
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\n)/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token === "\n") {
      parts.push(<br key={key++} />);
    } else if (token.startsWith("**")) {
      parts.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("*")) {
      parts.push(<em key={key++}>{token.slice(1, -1)}</em>);
    } else if (token.startsWith("`")) {
      parts.push(
        <code key={key++} className="bg-muted px-1 rounded text-sm font-mono">
          {token.slice(1, -1)}
        </code>
      );
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function DifficultyBadge({ difficulty }) {
  const color =
    difficulty?.toLowerCase() === "easy"
      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      : difficulty?.toLowerCase() === "medium"
      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";

  return (
    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", color)}>
      {difficulty}
    </span>
  );
}

function Tag({ label }) {
  return (
    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
      {label}
    </span>
  );
}

// ── Type renderers ────────────────────────────────────────────────────────────

function TextContent({ content }) {
  return <p className="text-sm leading-relaxed">{renderMarkdown(content)}</p>;
}

function ApproachContent({ content, data }) {
  return (
    <div className="space-y-2">
      {data?.title && <p className="text-sm font-semibold">{data.title}</p>}
      <p className="text-sm text-muted-foreground">{content}</p>
      {data?.approach?.length > 0 && (
        <ol className="list-decimal list-inside space-y-1 text-sm">
          {data.approach.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      )}
      <div className="flex flex-wrap gap-2 items-center pt-1">
        {data?.complexity && (
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-mono">
            {data.complexity}
          </span>
        )}
        {data?.solutions &&
          Object.keys(data.solutions).map((lang) => (
            <Tag key={lang} label={lang} />
          ))}
      </div>
    </div>
  );
}

function ProblemContent({ content, data }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        {data?.title && <p className="text-sm font-semibold">{data.title}</p>}
        {data?.difficulty && <DifficultyBadge difficulty={data.difficulty} />}
      </div>
      <p className="text-sm text-muted-foreground">{content}</p>
      {data?.problem && <p className="text-sm">{data.problem}</p>}
      {data?.constraints && (
        <p className="text-xs text-muted-foreground border-l-2 border-border pl-2">
          {data.constraints}
        </p>
      )}
      {data?.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-1">
          {data.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
      )}
    </div>
  );
}

function QuizContent({ content, data, navigate }) {
  return (
    <div className="space-y-2">
      {data?.topic && (
        <p className="text-sm font-semibold capitalize">{data.topic} Quiz</p>
      )}
      <p className="text-sm">{content}</p>
      {data?.levels?.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {data.levels.map((level) => {
            const url = `${data.url?.split("/").slice(0, 3).join("/")}/${level}`;
            return (
              <button
                key={level}
                onClick={() => navigate(url)}
                className="text-xs px-3 py-1 rounded-full border border-border hover:bg-accent transition-colors capitalize"
              >
                {level}
              </button>
            );
          })}
        </div>
      )}
      {data?.url && (
        <button
          onClick={() => navigate(data.url)}
          className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Start Quiz →
        </button>
      )}
    </div>
  );
}

function PdfLinkContent({ content, navigate }) {
  return (
    <div className="space-y-2">
      <p className="text-sm">{content}</p>
      <button
        onClick={() => navigate("/documents")}
        className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Go to Documents →
      </button>
    </div>
  );
}

function ErrorContent({ content }) {
  return (
    <p className="text-sm">{content || "Something went wrong. Please try again."}</p>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ChatMessage({ message }) {
  const navigate = useNavigate();
  const isUser = message.role === "user";
  const isError = message.type === "error";

  const bubbleClass = cn(
    "max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm",
    isUser
      ? "bg-primary text-primary-foreground rounded-br-sm"
      : isError
      ? "bg-destructive/10 text-destructive border border-destructive/20 rounded-bl-sm"
      : "bg-card text-card-foreground border border-border rounded-bl-sm"
  );

  const renderContent = () => {
    switch (message.type) {
      case "approach":
        return <ApproachContent content={message.content} data={message.data} />;
      case "problem":
        return <ProblemContent content={message.content} data={message.data} />;
      case "quiz":
        return <QuizContent content={message.content} data={message.data} navigate={navigate} />;
      case "pdf_link":
        return <PdfLinkContent content={message.content} navigate={navigate} />;
      case "error":
        return <ErrorContent content={message.content} />;
      case "text":
      default:
        return <TextContent content={message.content} />;
    }
  };

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div className={bubbleClass}>{renderContent()}</div>
    </div>
  );
}
