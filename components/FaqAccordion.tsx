'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<string>(isOpen ? '500px' : '0px');

  useEffect(() => {
    if (isOpen) {
      const el = contentRef.current;
      if (el) {
        setMaxHeight(`${el.scrollHeight}px`);
      }
    } else {
      setMaxHeight('0px');
    }
  }, [isOpen]);

  return (
    <div className="border-b border-[#e5e5e5]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-8 py-5 text-left text-[24px] font-light text-[#555]"
      >
        <span>{item.question}</span>
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center text-[30px] leading-none text-[var(--color-brown)] transition-transform duration-300"
          style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
        >
          +
        </span>
      </button>
      <div
        ref={contentRef}
        style={{ maxHeight, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden transition-all duration-300 ease-in-out"
      >
        <p className="pb-5 max-w-[1560px] text-[18px] font-light leading-relaxed text-[#777]">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export default function FaqAccordion({
  questions,
}: {
  questions: FaqItem[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <div className="space-y-0">
      {questions.map((item, index) => (
        <AccordionItem
          key={item.question}
          item={item}
          isOpen={openIndex === index}
          onToggle={() => handleToggle(index)}
        />
      ))}
    </div>
  );
}
