// export const baseUrl = 'http://localhost';
export const baseUrl = 'http://omcbe.arise.software';

export const setCookie = (name, value) => {
    document.cookie = name +'='+ value +'; path=/;';
    // document.cookie = name+'=; Max-Age=-99999999;';  
}

export const deleteCookie = (name) => {
    console.log('attempting to delete cookie ' + name)
    // document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

export const getCookie = (cname) => {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    
    for(let i = 0; i <ca.length; i++) {
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