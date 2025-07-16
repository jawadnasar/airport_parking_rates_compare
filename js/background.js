chrome.runtime.onMessage.addListener(function (param, sender, sendResponse) {
    console.log('background param:', param);
    /* Looking4parking prices Details Start */
    if (param['page_from'] == 'looking4_getting_data') {
        switch (param['action']) {
            case 'get_pricing_data_for_filling': // * Getting rates about all the services from looking4.com
                fetch_call_db(sendResponse, param['action'], param['pricing_data']);
                break;
        }
        return true;
    }
    /* Looking4parking prices Details END */

})

// Function to call the database using fetch API
function fetch_call_db(call_back_function, action, form_data) {
    console.clear();
    try {
        fetch('http://127.0.0.1:8000/api/update_websites_prices', {
            method: 'POST',
            body: JSON.stringify(form_data),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        })
            .then((fetres) => {
                if (!fetres.ok) {
                    return fetres.text().then(text => {
                        throw new Error(`Server responded with ${fetres.status}: ${text}`);
                    });
                }
                return fetres.json(); // parse the JSON response
            })
            .then((fetjson) => {
                if (!fetjson || typeof fetjson !== 'object') {
                    throw new Error('Invalid JSON response');
                }

                call_back_function({
                    status: fetjson.status || 'success',
                    data: fetjson,
                    form_data: form_data
                });
            })
            .catch(error => {
                console.log('%c Catch Error: ', 'background: #000; color: #bada55', error);
                call_back_function({
                    status: "error",
                    data: error.message || error
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