redirect_to_pages(); // We don't need to wait for documents to load
function redirect_to_pages() {
    const complete_url = new URL(window.location.href);
    const page_url = complete_url.origin + "" + complete_url.pathname;
    console.log("page_urltop",page_url);
    // Final destination should be acheived throgh this
    chrome.storage.local.get(['f_destination_path', 'f_destination_href'], (p) => { // p=> path
        console.log("path new",p.f_destination_href);
        console.log("page_url",page_url);
        /* Enjaz Redirection  START*/
        if (p.f_destination_path != '' && p.f_destination_path != page_url) { // Final Destination is not the url we are right now
            if (page_url == 'https://services.ksavisa.sa/') { // Thrown to before login page we redirect to login page                            
                this.location.href = 'https://services.ksavisa.sa/Account/Login/enjazcompany';
            } else if (page_url == 'https://services.ksavisa.sa/Account/Login/enjazcompany') { // Inside login page
                chrome.runtime.sendMessage({
                    page_from: "enjaz_redirection",
                    action: "get_log_details"
                }, (res) => {
                    // if(res.status == 'success'){

                    // }else{

                    // }   
                    $('#UserName').val(res['data']['UserName']);
                    $('#Password').val(res.data.Password);
                });
            } else if (page_url == 'https://services.ksavisa.sa/Enjaz/Main') { // Logged in! Now moving to Final Page    
                    this.location.href = p.f_destination_href;
            } else if (page_url == 'https://identity.ksavisa.sa/Account/Login') { // Logged in! Now moving to Final Page    
            this.location.href = 'https://services.ksavisa.sa/Account/Login/enjazcompany';
            }

            /* Enjaz Redirection  END*/


        }
    })
}

window.addEventListener('load', function () {
    /* If page is not English page and ENGLISH button is present START*/
    // let complete_url = new URL(window.location.href);
    // const page_language = complete_url.searchParams.get('lang').toUpperCase();
    const page_language = "ENG"; // Made it english by default but in future versions user can change it
    const eng_button = this.document.getElementById('en-US');
    if (eng_button && page_language == "ENG") {
        // eng_button.click();
    }
    /* If page is not English page and ENGLISH button is present END*/
});