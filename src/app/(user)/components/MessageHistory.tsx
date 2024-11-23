import React, { useEffect, useRef } from "react";
import CardMessage, { CardMessageInterface } from "./CardMessage";

interface Props {
  className?: string;
  cardMessages: CardMessageInterface[];
}

export default function MessageHistory({ className, cardMessages }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null); // Create a ref for the container

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight; // Scroll to the bottom
    }
  }, [cardMessages]);

  return (
    <div
      ref={containerRef}
      className={`scrollableContainer flex flex-col items-center justify-start gap-4 py-2 ${className}`}
    >
      {cardMessages.length > 0 &&
        cardMessages.map((item, index) => {
          return <CardMessage key={index} {...item} />;
        })}
    </div>
  );
}
