import React from 'react';

export function renderParseNewlinesToBr(input: string) {
    return (
        <div>
            {input.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                    <p className='text-sm'>
                        {line}
                    </p>
                    {index < input.split('\n').length - 1 && <div className='h-2'/>}
                </React.Fragment>
            ))}
        </div>
    );
}