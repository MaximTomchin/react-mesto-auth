import React from 'react';
import Form from "./Form";

const Login = React.memo((props) => {

    function handleSubmit(password, email) {
        props.handleLogin(password, email)
    }

    return (
        <main className="content">
            <Form
                title="Вход"
                subtitle="Войти"
                onSubmit={handleSubmit}
            />
        </main>
    );
})

export default Login;