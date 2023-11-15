import { Link } from "react-router-dom";

export default function About() {
    return (
        <>
            <h1>About</h1>
            <ul>
                <li>
                    <Link to={"/"}>Home</Link>
                </li>
                <li>
                    <Link to={"/about"}>About</Link>
                </li>
                <li>
                    <Link to={"/restricted"}>Restricted</Link>
                </li>
            </ul>
        </>
    );
}
