import React, {useEffect, useState} from 'react';
import { Redirect, Route, Switch, useHistory} from 'react-router-dom';
import '../index.css';
import api from '../utils/api';
import * as auth from '../utils/auth';
import CurrentUserContext from '../contexts/CurrentUserContext';
import Header from './Header';
import Main from './Main';
import Login from './Login';
import Register from "./Register";
import Footer from './Footer';
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from './ImagePopup';
import ConfirmDeletionPopup from "./ConfirmDeletionPopup";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";


const App = React.memo ((props) =>  {
    const [currentUser, setCurrentUser] = useState({});
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [isLogged, setIsLogged] = useState(false);
    const [email, setEmail] = useState();
    const [cards, setCards] = useState([]);
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
    const [isInfoTooltipOpen, setInfoTooltipOpen] = React.useState(false);
    const [isConfirmDeletionPopupOpen, setIsConfirmDeletionPopupOpen] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState(null);
    const [removedCard, setRemovedCard] = React.useState(null);

    const history = useHistory()

    useEffect(() => {
        api.getAllNeededData().then(argument => {
            const [ currentUser, cards ] = argument
            setCurrentUser(currentUser)
            setCards(cards)
        })
        .catch((err) => alert(err));
    }, []);

    useEffect(() => {
        if(localStorage.getItem("jwt")) {
            let token = localStorage.getItem("jwt")
            auth.checkToken(token)
                .then((res) => {
                    setLoggedIn(true);
                    setEmail(res.data.email);
                    history.push("/cards");
                })
                .catch(err => console.log(err));
        }
    }, [history]);

    function handleLogin(password, email) {
        auth.authorize(password, email)
            .then((res) => {
                localStorage.setItem("jwt", res.token);
                setLoggedIn(true);
                setEmail(email);
                history.push('/cards');
            })
            .catch((err) => {
                setIsLogged(false);
                setInfoTooltipOpen(true);
                console.log(err)});
    }

    function handleRegister(password, email) {
        auth.register(password, email)
            .then((res) => {
                setIsLogged(true);
                history.push("/signin");
                setInfoTooltipOpen(true);
            })
            .catch((err) => {
                setIsLogged(false);
                setInfoTooltipOpen(true);
                console.log(err);
            })
    }

    function onSignOut() {
        setLoggedIn(false)
        localStorage.removeItem('jwt');
    }

    function handleEditAvatarClick () {
        setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
    }

    function handleEditProfileClick () {
       setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
    }

    function handleAddPlaceClick () {
      setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
    }

    function handleConfirmDeletionClick (card) {
        setIsConfirmDeletionPopupOpen(!isConfirmDeletionPopupOpen);
        setRemovedCard({
            _id: card._id,
        })
    }

    function handleCardClick (card) {
        setSelectedCard({
            name: card.name,
            link: card.link
        });
    }

    function handleUpdateUser (avatar) {
        api.setUserInfo(avatar).then(currentUser => {
            setCurrentUser(currentUser);
            closeAllPopups()
        })
            .catch((err) => alert(err));
    }

    function handleUpdateAvatar (data) {
        api.setUserAvatar(data).then(currentUser => {
            setCurrentUser(currentUser);
            closeAllPopups()
        })
            .catch((err) => alert(err));
    }

    function handleAddPlaceSubmit (card) {
        api.setNewCard(card).then(newCard => {
            setCards([newCard, ...cards]);
            closeAllPopups()
        })
            .catch((err) => alert(err));
    }

    function handleCardLike(card) {
        const isLiked = card.likes.some(i => i._id === currentUser._id);
        api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
            const newCards = cards.map((c) => c._id === card._id ? newCard : c);
            setCards(newCards);
        })
            .catch((err) => alert(err));
    }

    function handleCardDelete(card) {
        api.deleteCard(card._id).then(() => {
            const newCards = cards.filter(c => c._id !== card._id);
            setCards(newCards);
            closeAllPopups()
        })
        .catch((err) => alert(err));
    }

    function closeAllPopups () {
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setIsEditAvatarPopupOpen(false);
        setIsConfirmDeletionPopupOpen(false);
        setInfoTooltipOpen(false);
        setSelectedCard(null);
    }

    return (
        <div className="page">

            <CurrentUserContext.Provider value={currentUser}>

                <Switch>

                    <ProtectedRoute
                        exact path="/cards"
                        isLoggedIn = {loggedIn}
                    >
                        <Header
                            email={email}
                            text="Выйти"
                            link="/signin"
                            class="active"
                            onClick={onSignOut}
                        />

                        <Main
                            onEditProfile={handleEditProfileClick}
                            onAddPlace={handleAddPlaceClick}
                            onEditAvatar={handleEditAvatarClick}
                            onCardClick={handleCardClick}
                            cards = {cards}
                            onCardLike = {handleCardLike}
                            onCardDelete = {handleConfirmDeletionClick}
                        />

                    </ProtectedRoute>

                    <Route exact path="/signin">
                        <Header
                            link="/signup"
                            text="Зарегистрироваться"
                        />

                        <Login
                            handleLogin={handleLogin}/>
                    </Route>

                    <Route exact path="/signup">
                        <Header
                            link="/signin"
                            text="Войти"
                        />

                        <Register
                            handleRegister={handleRegister}/>
                    </Route>

                    <Route>
                        {loggedIn ? (
                            <Redirect to="/cards" />
                        ) : (
                            <Redirect to="/signin" />
                        )}
                    </Route>

                </Switch>

                <Footer />

                <EditProfilePopup
                    isOpen={isEditProfilePopupOpen}
                    onClose={closeAllPopups}
                    onUpdateUser={handleUpdateUser}
                />

                <AddPlacePopup
                    isOpen={isAddPlacePopupOpen}
                    onClose={closeAllPopups}
                    onAddPlace={handleAddPlaceSubmit}
                />

                <EditAvatarPopup
                    isOpen={isEditAvatarPopupOpen}
                    onClose={closeAllPopups}
                    onUpdateAvatar={handleUpdateAvatar}
                />

                <ConfirmDeletionPopup
                    isOpen={isConfirmDeletionPopupOpen}
                    card = {removedCard}
                    onClose={closeAllPopups}
                    onDeleteCard={handleCardDelete}
                />

                <ImagePopup
                    card = {selectedCard}
                    onClose={closeAllPopups}
                />

                <InfoTooltip
                    isOpen={isInfoTooltipOpen}
                    isLogged={isLogged}
                    onClose={closeAllPopups}
                />

            </CurrentUserContext.Provider>

        </div>
    );
})

export default App;
