// let db_host_address = "http://localhost/projects/abu/tempkx/query_runner_json/run_query_for_json.php";
let db_host_address = '';
chrome.storage.local.get(['user_ip'], (res) => {
    db_host_address = res['user_ip']; // User IP Address
});

// Inserting Complete Information for Visa 
export function send_add_update_visa_information(call_back_function, visa_complete_data_obj) {
    // let request_url = db_host_address + "projects/abu/tempkx/query_runner_json/run_query_for_json.php";
    const request_url = db_host_address + "/savevisas.html";

    // Get Local Storage keys and then send them using a form
    getLocalStorageKeysObject(['file_reference']).then(storage_keys=>{
        let form_data = new FormData();
        form_data.append('file_reference', storage_keys['file_reference']);
        form_data.append('visa_issue_number', visa_complete_data_obj['visa_issue_number']);
        form_data.append('visa_date', visa_complete_data_obj['visa_date']);
        form_data.append('sponsor_full_name', visa_complete_data_obj['sponsor_full_name']);
        form_data.append('sponsor_address', visa_complete_data_obj['sponsor_address']);
        form_data.append('sponsor_id_number', visa_complete_data_obj['sponsor_id_number']);
        form_data.append('embassy_location', visa_complete_data_obj['embassy_location']);
        form_data.append('jobs_list', JSON.stringify(visa_complete_data_obj['jobs_list']));
        form_data.append('delegation_of_embassies', JSON.stringify(visa_complete_data_obj['delegation_of_embassies']));
        form_data.append('delegation_list', JSON.stringify(visa_complete_data_obj['delegation_list']));
        fetch_call_db(call_back_function, 'add_update_visa_info', request_url, form_data);
        return true; 
    });
}

// Customer Log Details 
export function get_customer_log_details(call_back_function) {
    const request_url = db_host_address + "/mopalogin.html";
    let form_data = new FormData();
    form_data.append('action', 'get_user_log_details');
    fetch_call_db(call_back_function, 'get_user_log_details', request_url, form_data);
}

// New Form Filling Data for enjaz
export function get_user_new_form_filling_data(call_back_function, params){
    const request_url = db_host_address + "/passportdata.html";
    let form_data = new FormData();
    form_data.append('action', 'get_user_data_for_filling');
    form_data.append('file_reference', params['file_reference']);
    form_data.append('record_number', params['record_number']);
    fetch_call_db(call_back_function, 'get_user_data_for_filling', request_url, form_data);
}

// New Form PTN Data for enjaz
export function get_user_new_form_ptn_data(call_back_function, params){
    const request_url = db_host_address + "/ptndata.html";
    let form_data = new FormData();
    form_data.append('action', 'get_user_data_for_ptn');
    form_data.append('file_reference', params['file_reference']);
    form_data.append('record_number', params['record_number']);
    fetch_call_db(call_back_function, 'get_user_data_for_ptn', request_url, form_data);
}

// save ptn data
export function fill_new_ptn(call_back_function, params){
    const request_url = db_host_address+"/insert_new_ptn.html";
    let form_data = new FormData();
    form_data.append('action', params['action']);
    form_data.append('new_enumber', params['new_enumber']);
    form_data.append('file_reference', params['file_reference']);
    form_data.append('record_number', params['record_number']);
    fetch_call_db(call_back_function, params['action'], request_url, form_data);
}


// save reg data
export function fill_new_reg(call_back_function, params){
    const request_url = db_host_address+"/insert_new_reg.html";
    let form_data = new FormData();
    form_data.append('action', params['action']);
    form_data.append('new_enumber', params['new_enumber']);
    form_data.append('file_reference', params['file_reference']);
    form_data.append('record_number', params['record_number']);
    fetch_call_db(call_back_function, params['action'], request_url, form_data);
}
// New Form REG Data for enjaz
export function get_user_new_form_reg_data(call_back_function, params){
    const request_url = db_host_address + "/regdata.html";
    let form_data = new FormData();
    form_data.append('action', 'get_user_data_for_reg');
    form_data.append('file_reference', params['file_reference']);
    form_data.append('record_number', params['record_number']);
    fetch_call_db(call_back_function, 'get_user_data_for_reg', request_url, form_data);
}
// Inserting New Created ENumber
export function fill_new_enumber(call_back_function, params){
    const request_url = db_host_address+"/insert_new_enumber.html";
    let form_data = new FormData();
    form_data.append('action', params['action']);
    form_data.append('new_enumber', params['new_enumber']);
    form_data.append('file_reference', params['file_reference']);
    form_data.append('record_number', params['record_number']);
    fetch_call_db(call_back_function, params['action'], request_url, form_data);
}

function fetch_call_db(call_back_function, action, request_url, form_data) {
    try {
        fetch(request_url, {
                method: 'POST',
                processData: false,
                contentType: false,
                body: form_data
            })
            .then((fetres) => { // fetres => fetch response
                // console.log("Response Text", fetres.text());
                if (fetres.ok) return fetres.json();
                // return fetres.text().then((text) => {throw Error(text)});
            })
            .then((fetjson) => { // fetjson => fetch json
                // In case of OK, this sendResponse will be called
                call_back_function({
                    status: fetjson['status'],
                    data: fetjson
                });
            })
            .catch(error => {
                // In case of error, this sendResponse will be called
                console.log('%c Catch Error: ', 'background: #000; color: #bada55', action, error)
                call_back_function({
                    status: "error",
                    data: error
                });
            });
    } catch (err) {
        console.log('%c Catch Error: ', 'background: #9633FF; color: #FFFFFF', action, error)
        call_back_function({
            status: "error",
            data: err
        });
    }
}

// Local Storage Values are called through promise from here using array of keys [storage_key]
export const getLocalStorageKeysObject = async function (storagekeysArray) {
    return new Promise((resolve, reject) => {
        try {
            let storage_keys_and_values = {};
            let i = 0;
            storagekeysArray.forEach(storage_key => {
                chrome.storage.local.get(storage_key, function (value) {
                    storage_keys_and_values[storage_key] = value[storage_key];
                    if(storagekeysArray.length == (i+1)){           // Resolve when array length is equal to number of iteration
                        resolve(storage_keys_and_values);
                    }
                    i++;
                });
            });
        } catch (ex) {
            reject(ex);
        }
    });
};