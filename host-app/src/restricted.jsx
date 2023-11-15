import { Link } from "react-router-dom";

export function Restricted() {
    return (
        <>
            <h1>Restricted (Teachers only)</h1>
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
