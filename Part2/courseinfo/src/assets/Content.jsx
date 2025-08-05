import { Part } from "./Part"

export function Content({ parts }) {    
    return (
        <>
            {parts.map((p) => <Part part={p} key={p.id}></Part >)}
        </>
    )

}