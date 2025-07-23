chrome.runtime.onMessage.addListener(function (param, sender, sendResponse) {
    console.log('background param:', param);
    /* Looking4parking prices Details Start */
    if (param['page_from'] == 'looking4_getting_data') {
        switch (param['action']) {
            case 'get_pricing_data_for_filling': // * Getting rates about all the services from looking4.com
                fetch_call_db(sendResponse, param['action'], param['pricing_data']);
                break;
            case 'refresh_pages_for_data': // * Refreshing the pages for data on user request
                const from_date = increment_from_date_by_one(param['from_date']);
                sendResponse({
                    message: 'Refreshing pages for data',
                    refreshing_url: start_refreshing_looking4_parking_prices(from_date, param['gapDays'], 'Refresh')
                });
        }
        return true;
    }
    /* Looking4parking prices Details END */

    /* CompareParking prices Details Start */
    if (param['page_from'] == 'compareparking_getting_data') {
        switch (param['action']) {
            case 'get_pricing_data_for_filling': // * Getting rates about all the services from looking4.com
                fetch_call_db(sendResponse, param['action'], param['pricing_data']);
                break;
            case 'refresh_pages_for_data': // * Refreshing the pages for data on user request]
                const from_date = increment_from_date_by_one(param['from_date']);
                sendResponse({
                    message: 'Refreshing pages for data',
                    refreshing_url: start_refreshing_compare_parking_prices(from_date, param['gapDays'], 'Refresh')
                });
        }
        return true;
    }
    /* CompareParking prices Details END */

    /* Popup form data saving START */
    if (param['page_from'] == 'popup') {
        switch (param['action']) {
            case 'refresh_pages_for_data': // * Refreshing the pages for data on user request
                if (param['data'].lookingForParking) {      // Data for Looking4Parking
                    sendResponse({
                        message: 'Refreshing pages for data',
                        refreshing_url: start_refreshing_looking4_parking_prices(param['data'].fromDate, param['data'].gapDays, 'New Tab')
                    });
                }
                if (param['data'].compareParking) {      // Data for CompareParking
                    sendResponse({
                        message: 'Refreshing pages for data',
                        refreshing_url: start_refreshing_compare_parking_prices(param['data'].fromDate, param['data'].gapDays, 'New Tab')
                    });
                }
                break;
        }
        return true;
    }

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

// Function to start refreshing looking4 parking prices
function start_refreshing_looking4_parking_prices(from_date, gapDays, refresh) {
    if (from_date && gapDays) {
        // Calculate end_date by adding gapDays to fromDate
        const end_date = get_end_date(from_date, gapDays);
        // Open the Looking4Parking website with the specified dates
        const url = `https://booking.parking.looking4.com/search/?entryDate=${from_date}&entryTime=12%3A00&exitDate=${end_date}&exitTime=23%3A00&terminal=95&airport=LGW&pop_extension=true`;

        if (refresh == 'Refresh') {
            // Redirect the current tab to the Looking4Parking URL
            return url;
        } else {
            // Open a new tab with the Looking4Parking URL
            chrome.tabs.create({ url: url }, function (tab) {
                console.log('Opened Looking4Parking tab:', tab);
            });
        }
    }
}

// Function to start refreshing compare parking prices
function start_refreshing_compare_parking_prices(from_date, gapDays, refresh) {
    if (from_date && gapDays) {
        // Calculate end_date by adding gapDays to fromDate
        const end_date = get_end_date(from_date, gapDays);
        // Open the Looking4Parking website with the specified dates
        const url = `https://compareparkingdeals.co.uk/search/?departure=${from_date}+12%3A00&arrival=${end_date}+12%3A00&airport=LGW&pop_extension=true`;

        if (refresh == 'Refresh') {
            // Redirect the current tab to the Looking4Parking URL
            return url;
        } else {
            // Open a new tab with the Looking4Parking URL
            chrome.tabs.create({ url: url }, function (tab) {
                console.log('Opened CompareParking tab:', tab);
            });
        }
    }
}

function get_end_date(fromDate, gapDays) {
    const fromDateObj = new Date(fromDate);
    const gap = parseInt(gapDays, 10) || 0;
    const endDateObj = new Date(fromDateObj);
    endDateObj.setDate(fromDateObj.getDate() + gap);
    const pad = n => n.toString().padStart(2, '0');
    const end_date = `${endDateObj.getFullYear()}-${pad(endDateObj.getMonth() + 1)}-${pad(endDateObj.getDate())}`;
    return end_date;
}

function increment_from_date_by_one(from_date) {
    const fromDateObj = new Date(from_date);
    fromDateObj.setDate(fromDateObj.getDate() + 1);
    const pad = n => n.toString().padStart(2, '0');
    from_date = `${fromDateObj.getFullYear()}-${pad(fromDateObj.getMonth() + 1)}-${pad(fromDateObj.getDate())}`;
    return from_date;
}