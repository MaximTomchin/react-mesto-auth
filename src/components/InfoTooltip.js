import React, {useEffect, useCallback} from 'react'
import success from '../images/union.svg'
import unsuccess from '../images/unsuccess.svg'

const InfoTooltip = React.memo ((props) =>  {
    const image = props.isLogged ? success : unsuccess;
    const message = props.isLogged ? "Вы успешно зарегистрировались!" : "Что-то пошло не так! Попробуйте ещё раз."
    const escFunction = useCallback((evt) => {
        if(evt.keyCode === 27) {
            props.onClose();
        }
    }, [props]);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);

        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);

    return (
           <div className={'popup popup_type_tooltip' + (props.isOpen ? ' popup_opened' : '')}>
               <div className="popup__overlay" onClick={props.onClose} />
               <figure className="popup__container popup__container_type_tooltip">
                   <button className="popup__close-button" type="reset" aria-label="Close" onClick={props.onClose}/>
                   <img className="popup__tooltip-image" src={image} alt={message}/>
                   <h2 className="popup__title popup__title_type_tooltip">{message}</h2>
               </figure>
           </div>
    )
});

export default InfoTooltip