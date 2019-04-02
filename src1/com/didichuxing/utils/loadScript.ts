function _loadScript(scriptSrc, callback) {
    let sid = '';
    if (scriptSrc.indexOf('.js') !== -1) {
        sid = 'j-' + scriptSrc.substring(scriptSrc.lastIndexOf('/') + 1, scriptSrc.length - 3);
    } else {
        sid = scriptSrc.split('/').slice(-2).join('');
    }
    sid = sid.replace(/(\?|\=|\&|\.)/gi, '');
    const scriptEle: any = document.getElementById(sid);
    if (!scriptEle) {
        const script: any = document.createElement('script');
        script.async = 'async';
        script.src = scriptSrc;
        script.id = sid;

        if (typeof callback === 'function') {
            script.onload = script.onreadystatechange = () => {
                script.onload = null;
                script.onreadystatechange = null;
                typeof callback === 'function' && callback();
            };
        }

        document.body.insertBefore(script, document.body.lastChild);
    } else {
        const onloadPrev = scriptEle.onload;
        if (onloadPrev) {
            /* Is loaded */
            scriptEle.onload = scriptEle.onreadystatechange = () => {
                onloadPrev();
                typeof callback === 'function' && callback();
            };
        } else {
            typeof callback === 'function' && callback();
        }
    }
}

export function loadScript(scriptSrc: string): Promise<void> {
    return new Promise((resolve) => {
        _loadScript(
            scriptSrc,
            () => {
                resolve();
            }
        );
    });
}

export function loadScripts(srcArr: string[]): Promise<void> {
    return new Promise((resolve) => {
        Promise.all(srcArr.map(loadScript)).then(() => {
            resolve();
        });
    });
}
