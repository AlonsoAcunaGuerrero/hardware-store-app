import { BaseTemplate } from "./Templates";

export default function NotFoundPage(){
    document.title = 'Not Found';

    return(
        <BaseTemplate>
            <div className="flex flex-col gap-2 p-2 h-full w-full">
                <h3 className="font-bold text-[4em] border-b-4 border-red-400">
                    Error 404 - Not Found
                </h3>

                <p className="text-[2em]">
                    Sorry the resource or the page what want to access is not found.
                </p>
            </div>
        </BaseTemplate>
    )
}