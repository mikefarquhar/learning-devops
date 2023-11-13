import { Link } from "react-router-dom";

export function NotFound() {
    return (
        <>
            <h1>Not Found</h1>
            <Link to={"/"}>Home</Link>
            <Link to={"/about"}>About</Link>
        </>
    )
}