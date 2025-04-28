'use client';

interface ErrorProps {
    message: string;
}

 export const Error: React.FC<ErrorProps> = ({message}) => {
    return (
        <div className="flex flex-col justify-center items-center h-[90vh] w-[100vw] text-white">
            <h1 className="font-title" style={{fontSize: '6em'}}>Error</h1>
            <p className="text-red-400 font-text tracking-wide text-[2em]">{message}</p>
        </div>
    )
}