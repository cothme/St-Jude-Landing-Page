import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { FaComments, FaPaperPlane, FaRotateRight, FaXmark } from 'react-icons/fa6';
import type { ChatAssistantContent } from '../content/types';

type ChatMessage = {
  id: string;
  role: 'assistant' | 'user';
  content: string;
};

type ChatAssistantProps = {
  content: ChatAssistantContent;
};

function ChatAssistant({ content }: ChatAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      role: 'assistant',
      content: content.greeting,
    },
  ]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const conversationVersionRef = useRef(0);

  const history = useMemo(
    () =>
      messages
        .filter((message) => message.id !== 'welcome')
        .map((message) => ({
          role: message.role,
          content: message.content,
        })),
    [messages],
  );

  const openChat = () => {
    setIsOpen(true);
    window.setTimeout(() => inputRef.current?.focus(), 120);
  };

  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [isOpen, isSending, messages]);

  const resetChat = () => {
    const shouldRefresh = window.confirm('Refresh this chat? Your current messages and draft will be cleared.');
    if (!shouldRefresh) return;

    conversationVersionRef.current += 1;
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: content.greeting,
      },
    ]);
    setInput('');
    setIsSending(false);
  };

  const sendMessage = async (messageText: string) => {
    const trimmed = messageText.trim();
    if (!trimmed || isSending) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setInput('');
    setIsSending(true);
    const conversationVersion = conversationVersionRef.current;
    const startedAt = Date.now();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmed,
          history,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      const payload = contentType.includes('application/json') ? await response.json().catch(() => null) : null;
      const reply = payload?.reply || payload?.error || content.unavailableMessage;

      await waitForNaturalReply(startedAt, reply);
      if (conversationVersion !== conversationVersionRef.current) return;

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: reply,
        },
      ]);
    } catch {
      await waitForNaturalReply(startedAt, content.unavailableMessage);
      if (conversationVersion !== conversationVersionRef.current) return;

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: content.unavailableMessage,
        },
      ]);
    } finally {
      if (conversationVersion === conversationVersionRef.current) {
        setIsSending(false);
      }
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(input);
  };

  return (
    <div className="fixed bottom-5 left-5 z-40 sm:bottom-6 sm:left-6">
      {isOpen && (
        <section
          className="animate-chat-panel mb-4 flex h-[min(680px,calc(100vh-7rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[1.75rem] border border-moss/15 bg-white shadow-lift transition-colors duration-300 dark:border-white/10 dark:bg-[#0a180a] sm:w-[430px] lg:w-[460px]"
          aria-label="Website chat assistant"
        >
          <header className="flex items-start justify-between gap-4 border-b border-moss/10 bg-cream p-4 dark:border-white/10 dark:bg-white/10">
            <div className="min-w-0">
              <p className="text-base font-bold text-ink dark:text-white">{content.title}</p>
              <p className="mt-1 text-xs leading-5 text-ink/62 dark:text-white/62">{content.subtitle}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                className="focus-ring grid h-9 w-9 place-items-center rounded-full border border-moss/10 bg-white text-moss transition hover:border-sage/40 dark:border-white/10 dark:bg-white/10 dark:text-linen"
                aria-label="Reset chat"
                onClick={resetChat}
              >
                <FaRotateRight className="text-sm" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="focus-ring grid h-9 w-9 place-items-center rounded-full border border-moss/10 bg-white text-moss transition hover:border-sage/40 dark:border-white/10 dark:bg-white/10 dark:text-linen"
                aria-label="Close chat"
                onClick={() => setIsOpen(false)}
              >
                <FaXmark aria-hidden="true" />
              </button>
            </div>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto bg-white p-4 dark:bg-[#071307]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`animate-chat-message flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <p
                  className={`chat-bubble max-w-[88%] whitespace-pre-line rounded-[1.35rem] px-4 py-3.5 text-sm leading-6 shadow-sm sm:max-w-[86%] sm:px-5 sm:py-4 ${
                    message.role === 'user'
                      ? 'bg-moss text-white dark:bg-linen dark:text-ink'
                      : 'bg-cream text-ink/78 dark:bg-white/10 dark:text-white/78'
                  }`}
                >
                  {message.role === 'assistant' ? <LinkedText text={message.content} /> : message.content}
                </p>
              </div>
            ))}

            {isSending && (
              <div className="animate-chat-message flex justify-start">
                <div className="chat-bubble flex items-center gap-2 rounded-[1.35rem] bg-cream px-5 py-4 text-sm font-semibold text-ink/60 shadow-sm dark:bg-white/10 dark:text-white/60">
                  <span className="typing-dot" />
                  <span className="typing-dot animation-delay-150" />
                  <span className="typing-dot animation-delay-300" />
                  <span className="sr-only">Replying...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-moss/10 bg-cream p-4 dark:border-white/10 dark:bg-white/10">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {content.quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="focus-ring shrink-0 rounded-full border border-moss/10 bg-white px-3 py-2 text-xs font-semibold text-moss transition hover:border-sage/40 dark:border-white/10 dark:bg-white/10 dark:text-linen"
                  onClick={() => void sendMessage(prompt)}
                  disabled={isSending}
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form className="flex gap-2" onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={content.inputPlaceholder}
                className="focus-ring min-w-0 flex-1 rounded-full border border-moss/15 bg-white px-4 py-3 text-sm font-medium text-ink shadow-sm transition placeholder:text-ink/42 dark:border-linen/20 dark:bg-[#102410] dark:text-white dark:placeholder:text-white/38"
                disabled={isSending}
              />
              <button
                type="submit"
                className="focus-ring grid h-12 w-12 shrink-0 place-items-center rounded-full bg-moss text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60 dark:bg-linen dark:text-ink dark:hover:bg-white"
                aria-label="Send message"
                disabled={isSending || !input.trim()}
              >
                <FaPaperPlane className="text-sm" aria-hidden="true" />
              </button>
            </form>
          </div>
        </section>
      )}

      {!isOpen && (
        <button
          type="button"
          className="focus-ring button-glow flex items-center gap-3 rounded-full bg-moss px-5 py-4 text-sm font-bold text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-ink dark:bg-linen dark:text-ink dark:hover:bg-white"
          onClick={openChat}
        >
          <FaComments aria-hidden="true" />
          Chat with us
        </button>
      )}
    </div>
  );
}

function waitForNaturalReply(startedAt: number, reply: string) {
  const elapsed = Date.now() - startedAt;
  const textDelay = Math.min(1600, Math.max(650, reply.length * 12));
  const remaining = textDelay - elapsed;

  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, Math.max(0, remaining));
  });
}

type LinkedTextProps = {
  text: string;
};

function LinkedText({ text }: LinkedTextProps) {
  const parts = linkifyText(text);

  return (
    <>
      {parts.map((part, index) =>
        part.type === 'link' ? (
          <a
            key={`${part.value}-${index}`}
            href={part.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-harbor underline decoration-sage/50 underline-offset-4 transition hover:text-moss dark:text-linen dark:decoration-linen/40 dark:hover:text-white"
          >
            {part.value}
          </a>
        ) : (
          <span key={`${part.value}-${index}`}>{part.value}</span>
        ),
      )}
    </>
  );
}

type LinkedTextPart =
  | {
      type: 'text';
      value: string;
    }
  | {
      type: 'link';
      value: string;
      href: string;
    };

function linkifyText(text: string): LinkedTextPart[] {
  const urlPattern = /\bhttps?:\/\/[^\s<>"']+/gi;
  const parts: LinkedTextPart[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = urlPattern.exec(text))) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        value: text.slice(lastIndex, match.index),
      });
    }

    const { displayUrl, trailingText } = splitTrailingPunctuation(match[0]);
    parts.push({
      type: 'link',
      value: displayUrl,
      href: displayUrl,
    });

    if (trailingText) {
      parts.push({
        type: 'text',
        value: trailingText,
      });
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      value: text.slice(lastIndex),
    });
  }

  return parts.length ? parts : [{ type: 'text', value: text }];
}

function splitTrailingPunctuation(value: string) {
  const match = value.match(/^(.*?)([),.!?;:]+)?$/);

  return {
    displayUrl: match?.[1] || value,
    trailingText: match?.[2] || '',
  };
}

export default ChatAssistant;
