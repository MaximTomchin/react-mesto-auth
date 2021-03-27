import React from 'react';
import Logo from '../images/logo.svg';
import { Link } from 'react-router-dom'

const Header = React.memo((props) => {

    return (
        <header className="header">
            <img src={Logo} className="header__logo" alt="Место-Россия" />
            <nav className="header__navigation">
                <p className="header__mail">{props.email}</p>
                <Link
                    className={`header__link header__link_${props.class}`}
                    to={props.link}
                    onClick={props.onClick}
                >
                    {props.text}
                </Link>
            </nav>
        </header>
    );
})

export default Header;