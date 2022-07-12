export const baseUrl = 'http://localhost';
// export const baseUrl = 'http://omcbe.arise.software';

export const setCookie = (name, value) => {
    document.cookie = name +'='+ value +'; path=/;';
}

export const deleteCookie = (name) => {


    if (document.location.hostname === 'localhost') {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost';
    } else {
        document.cookie = name + '=; path=/; domain=.arise.software; expires=' + new Date(0).toUTCString();
    }
}

// Thank you W3Schools
export const getCookie = (cname) => {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


export const requestCookie = () => {
    return fetch(`${baseUrl}/sanctum/csrf-cookie`, {credentials: 'include'});    
};