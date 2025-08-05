import { Part } from "./Part"

export function Content(props) {
    const parts = props.parts
    return (
        <>
            <Part part={parts[0].name} exercise={parts[0].exercises}></Part >
            <Part part={parts[1].name} exercise={parts[1].exercises}></Part >
            <Part part={parts[2].name} exercise={parts[2].exercises}></Part >
        </>
    )
}