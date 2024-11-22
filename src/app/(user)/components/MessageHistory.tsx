import CardMessage, { CardMessageInterface } from "./CardMessage"

interface Props {
    className?: string,
    cardMessages: CardMessageInterface[]
}

export default function MessageHistory({ className, cardMessages } : Props){
    return (
        <div className={`overflow-auto flex items-center justify-start flex-col gap-4 py-2 scrollableContainer ${className}`}>
            {cardMessages.length > 0 && cardMessages.map((item, index) =>{
                return <CardMessage key={index} {...item}/>
            })}
        </div>
    )
}