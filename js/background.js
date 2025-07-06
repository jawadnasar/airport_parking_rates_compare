import * as db from "/js/db_caller.js";

chrome.runtime.onMessage.addListener(function (param, sender, sendResponse) {
    console.log('background param:', param);
    /* View Visa Details Start */
    if (param['page_from'] == 'view_visa_details') {
        switch (param['action']) {
            case 'add_update_visa_info': // * User Visa Details entry to DB
                db.send_add_update_visa_information(sendResponse, param['visa_complete_data']);
                break;
            case 'check_user_came_from_software': // * Check if called from inside the software or the user came by himself 
                chrome.storage.local.get(['user_ip'], (res) => {
                    let hide_show_upd_btn = res.user_ip ? 'show_update_button' : 'hide_update_button';
                    sendResponse({
                        'show_hide_button': hide_show_upd_btn
                    });
                });
                break;
        }
        return true;
    }
    /* View Visa Details END */
    /* New Form Filling Start */
    else if (param['page_from'] == 'enjaz_redirection') {
        switch (param.action) {
            case 'get_log_details':
                db.get_customer_log_details(sendResponse);
                break;
            case 'get_user_data_for_filling':
                db.get_user_new_form_filling_data(sendResponse, param); // Boths params will go in this -> 1.file_reference 2.record_number
                break;
            case 'get_user_data_for_ptn':
                db.get_user_new_form_ptn_data(sendResponse, param); // Boths params will go in this -> 1.file_reference 2.record_number
                break;
            case 'get_user_data_for_reg':
                db.get_user_new_form_reg_data(sendResponse, param); // Boths params will go in this -> 1.file_reference 2.record_number
                break;
        }
        return true;
    }
    /* New Form Filling END */

    /* All Enjaz Pages START*/
    console.log('E_all_pages:', "E_all_pages")
    if (param['page_from'] == 'E_all_pages') {
        switch (param.action) {
            case 'fill_new_enumber':
                db.fill_new_enumber(sendResponse, param);
                break;
            case 'fill_new_ptn':
                db.fill_new_ptn(sendResponse, param);
                break;
            case 'fill_new_reg':
                db.fill_new_reg(sendResponse, param);
                break;
        }
        return true;
    }
    /* All Enjaz Pages END */

})


/* Getting URL Before Redirection Start*/
chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        let complete_url = new URL(details.url);
        console.log('complete_url.searchParams.get(action):', complete_url.searchParams.get('action'))
        if (complete_url.searchParams.get('action')) {
            chrome.storage.local.set({
                'f_destination_href': complete_url.href,
                'f_destination_path': complete_url.pathname,
                'user_ip': complete_url.searchParams.get('ip')
            });
            return {
                requestHeaders: details.requestHeaders
            }
        }
    }, {
        urls: ["*://services.ksavisa.sa/SmartForm/TraditionalApp?*",
            "*://services.ksavisa.sa/SmartForm/ElectronicAgreement?*",
            "*://services.ksavisa.sa/Enjaz/Main?*"
        ]
    }
);
/* Getting URL Before Redirection END*/