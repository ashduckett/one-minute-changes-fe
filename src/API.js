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

// Actual API stuff. Look into error handling later
// export const logIn = async (submitObj) => {
//     let cookie = null;
//     cookie = getCookie('XSRF-TOKEN');



//     // If there's no cookie but there is an email and password passed then it has to be a fresh login
//     if (submitObj) {
//         await requestCookie();
//         cookie = getCookie('XSRF-TOKEN');

//         const responseJSON = await fetch(`${baseUrl}/api/login`, {
//             credentials: 'include',
//             method: 'POST',
//             body: JSON.stringify(submitObj),
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-XSRF-TOKEN': cookie
//             }
//         });
        
//         const userData = await responseJSON.json();
//         const r = await fetch(`${baseUrl}/api/user/changes`, {
//             credentials: 'include',
//             headers: {
//                 'Accept': 'application/json',
//                 'X-XSRF-TOKEN': cookie
//             }
//         });
        
        
//         const finalResponse = await r.json();
//         return {
//             user: userData,
//             results: finalResponse,
//         };
//     } else {
//         // Without an email and password, it's safe, though still worth checking, that there's already a logged in user and thus a cookie.

//         const userResponse = await fetch(`${baseUrl}/api/user`, {
//             credentials: 'include',
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//                 'X-XSRF-TOKEN': cookie
//             }
//         });
        
//         const userResponseJSON = await userResponse.json();


//         const guitarChanges = await fetch(`${baseUrl}/api/user/changes`, {
//             credentials: 'include',
//             headers: {
//                 'Accept': 'application/json',
//             }
//         });
        
//         const guitarChangesJSON = await guitarChanges.json();

//         return {
//             user: userResponseJSON,
//             results: guitarChangesJSON
//         };
//     }
// };