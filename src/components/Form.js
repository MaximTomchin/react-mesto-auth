import React, {useState} from 'react';

const Form = React.memo((props) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleEmail(evt) {
        setEmail(evt.target.value);
    }

    function handlePassword(evt) {
        setPassword(evt.target.value);
    }

    function handleSubmit(evt) {
        evt.preventDefault();
        props.onSubmit(password, email);
        setPassword('');
        setEmail('');
    }


    return (

            <div className="form">
                <form
                    className="form__box"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <h2 className="form__title">{props.title}</h2>
                    <input
                        type="email"
                        className="form__input"
                        id="email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={handleEmail}
                        autoComplete="off"
                        required
                    />
                    <input
                        type="password"
                        className="form__input"
                        id="password"
                        name="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={handlePassword}
                        autoComplete="off"
                        required
                    />
                    <button className="form__button" type="submit">{props.subtitle}</button>
                    {props.children}
                </form>
            </div>
    );
})

export default Form;