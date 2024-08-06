export const cookiekey = {
    actkn: 'mg_T',
    userinfo:'USFDM'
}

export const setCookie=(name:string, value:any, expirationTimestamp: string | number | Date) =>{
    // 將時間戳記轉換為 Date 物件
    const expirationDate = new Date(expirationTimestamp);

    // 設定 cookie 字符串
    const cookieString = `${name}=${encodeURIComponent(value)}; domain=localhost; secure; expires=${expirationDate.toUTCString()}; path=/`;

    // 設定 cookie
    document.cookie = cookieString;
};
export const getCookie=(name:string) =>{
    const cookieArray = document.cookie.split('; ');

    for (const cookie of cookieArray) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }

    return null; // 如果找不到對應名稱的 cookie
}

export const deleteCookie=(cookieName:string) =>{
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
        if (name.trim() === cookieName) {
            document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            break;
        }
    }
}

//設定JWTTokenCookie
export const setTokenCookie= (value:any, expirationTimestamp: string | number | Date) =>{
    setCookie(cookiekey.actkn, value, expirationTimestamp);
}
export const getTokenCookie= ()=> {
    return getCookie(cookiekey.actkn);
}
export const getTokenCookieBearer= ()=>{
    let result = null;
    let token = getCookie(cookiekey.actkn);
    if (token)
        result = 'Bearer ' + getCookie(cookiekey.actkn);
    return result;
}

export const removeTokenCookie=() =>{
    deleteCookie(cookiekey.actkn);
}


