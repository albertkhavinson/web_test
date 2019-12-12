/**
 * Determine the mobile operating system.
 * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
 *
 * @returns {String}
 */
function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
        return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    return "unknown";
}

function init(links=[], isBackBtn) {
    const os = getMobileOperatingSystem();
    console.log({os})
    const templates = {
        phishingHTMLTemplate: `
        <div id="wrapper" class="menu-item {{isAllowedOS}} multi-link">
            <div id="content">
                <a target="_blank" href="https://salesforce.sbm-demo.xyz/{{url}}"><div class="img-container"><img src="img/{{img}}"/></div></a>
                <div class="phishing-urls">
                    <a target="_blank" href="http://salesforce.sbm-demo.xyz/{{url}}"><div>{{title}}</div></a>
                    <a target="_blank" href="https://salesforce.sbm-demo.xyz/{{url}}"><div>{{title}} (SSL)</div></a>
                </div>
            </div>
        </div>
    `}

    const template = `<div id="wrapper" class="menu-item {{isAllowedOS}}">
            <a target="{{target}}" href="{{url}}">
                <div id="content">
                    <div class="img-container"><img src="img/{{img}}"/></div>
                    <h2>{{title}}</h2>
                    <a style="display:{{displaySub}}" target="_blank" href="{{subUrl}}"><div class="subtitle">{{subTitle}}</div></a>
                </div>
            </a>
        </div>`
    
    const pageContainer = document.getElementById("page-container");
    pageContainer.innerHTML = '';
    var menuContainer = document.createElement("div");
    menuContainer.id = "menu-container";
    items = 
        links
        .map(link => {
            allowedOS = !link.os || link.os === os || (link.os.includes && link.os.includes(os));
            console.log({allowedOS})
            return (templates[link.template] || template)
                .replace(/{{url}}/g, link.url)
                .replace(/{{title}}/g, link.title)
                .replace(/{{img}}/g, link.img || 'logo214.svg')
                .replace(/{{subTitle}}/g, link.subTitle || '')
                .replace(/{{subUrl}}/g, link.subUrl)
                .replace(/{{displaySub}}/g, link.subUrl ? '' : 'none')
                .replace(/{{target}}/g, link.target || '_blank')
                .replace(/{{isAllowedOS}}/g, allowedOS ? '' : 'disabled')
        }).join('')
    menuContainer.innerHTML = items
    pageContainer.appendChild(menuContainer)
    if (isBackBtn) {
        let backBtnElm = document.createElement("div");
        backBtnElm.style = "margin-top: 15px"
        backBtnElm.innerHTML =  `<a href='/'><div class="button r4 brand back">Back</div></a>`
        pageContainer.appendChild(backBtnElm)
    }
}