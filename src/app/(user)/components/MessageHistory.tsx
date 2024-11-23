import CardMessage, { CardMessageInterface } from "./CardMessage";

interface Props {
  className?: string;
  cardMessages: CardMessageInterface[];
}

export default function MessageHistory({ className, cardMessages }: Props) {
  return (
    <div
      className={`scrollableContainer flex flex-col items-center justify-start gap-4 py-2 ${className}`}
    >
      {cardMessages.length > 0 &&
        cardMessages.map((item, index) => {
          return <CardMessage key={index} {...item} />;
        })}
    </div>
  );
}
