import {Route, Redirect} from 'react-router-dom';

function ProtectedRoute(props) {
    return (
        <Route>
            {props.isLoggedIn ? props.children : <Redirect to="/signin" />}
        </Route>
    )
}

export default ProtectedRoute;