import { Link } from 'react-router-dom';
import '../Styles/HomePage.css';

const Homepage = () => {

    return (
        <div>
            <head>
                <title>Path Finder</title>
                <link rel="icon" type="image/x-icon" href="../Images/pathfinder-logo.jpg"></link>
            </head>
                <body>
                    <ul>
                        <li><a class="active" href="#home">Home</a></li>
                        <li><a href="#news">Updates</a></li>
                        <li><a href="#contact">Contact</a></li>
                        <li><a href="#about">About</a></li>
                    </ul>
                </body>
            <footer>
                <p class="copyright">
                    &copy;
                    2023 Daniel Tahj Wuilmel
                </p>
            </footer>
        </div>
    )
};

export default Homepage;