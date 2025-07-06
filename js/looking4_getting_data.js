chrome.storage.local.clear();               // Clearing local storage at the start

$(document).ready(function () {
    let complete_url = new URL(window.location.href);
    console.log('Trying to start working in looking4_getting_data.js');
     chrome.runtime.sendMessage({
        page_from: "looking4_getting_data",
        action: "get_pricing_data_for_filling"
    }, (res) => {
        console.log('res:', res);
    });
});

window.addEventListener('load', function () {
    /* If page is not English page and ENGLISH button is present START*/
    // let complete_url = new URL(window.location.href);
    // const page_language = complete_url.searchParams.get('lang').toUpperCase();
    const page_language = "ENG";                            // Made it english by default but in future versions user can change it
    const eng_button = this.document.getElementById('en-US');
    if(eng_button && page_language == "ENG"){
        // eng_button.click();
    }
    /* If page is not English page and ENGLISH button is present END*/
});
