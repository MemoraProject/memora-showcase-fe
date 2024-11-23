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
    }, [cardMessages]); // Run this effect whenever cardMessages changes

    return (
        <div
            ref={containerRef} // Attach the ref to the container
            className={`overflow-auto flex items-center justify-start flex-col gap-4 py-2 scrollableContainer ${className}`}
        >
            {cardMessages.length > 0 && cardMessages.map((item, index) => {
                return (
                    <CardMessage
                        isLastestMessage={index === cardMessages.length - 1} // Set isLastestMessage for the last item
                        key={index}
                        {...item}
                    />
                );
            })}
        </div>
    );
}