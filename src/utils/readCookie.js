import Cookies from 'js-cookie';

export const readCookie = (name) => {
    let cookieValue = Cookies.get(name);

    if (cookieValue) {
        cookieValue = JSON.parse(cookieValue);
    }
    return cookieValue;
};