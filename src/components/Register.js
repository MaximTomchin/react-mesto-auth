import React from 'react';
import {Link} from "react-router-dom";
import Form from "./Form";

const Register = React.memo((props) => {

    function handleSubmit(password, email) {
        props.handleRegister(password, email)
    }

    return (
        <main className="content">
            <Form
                title="Регистрация"
                subtitle="Зарегистрироваться"
                onSubmit={handleSubmit}
            >
                <Link className= "form__link" to="/signin">Уже зарегистрированы? Войти</Link>
            </Form>

        </main>
    );
})

export default Register;