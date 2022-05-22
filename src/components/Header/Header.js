import { Link } from "react-router-dom";
import './Header.css'

const Header = () => {
    return (
        <nav className="Nav-list-wrapper">
            <ol className="Nav-list">
                <li className="Nav-item"><Link to="/">Home</Link></li>
                <li className="Nav-item"><Link to="/result">Result</Link></li>
            </ol>
        </nav>
    )
}

export default Header;