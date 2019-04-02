interface ICookie {
    username: string;
}

export function getCookie(): ICookie {
    const cookies: string[] = document.cookie.split(';');
    const cookieObj: any = {
        username: ''
    };
    cookies.forEach((item: any) => {
        item.replace(/([^=]+)=([^=]+)/, ($1, $2, $3) => {
            cookieObj[$2.trim()] = $3.trim();
        });
    });
    return cookieObj as ICookie;
}
