import { Link } from "react-router-dom";

export function About() {
    return (
        <>
            <h1>About</h1>
            <Link to={"/"}>Home</Link>
            <Link to={"/about"}>About</Link>
        </>
    )
}