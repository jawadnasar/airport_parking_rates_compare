// chrome.storage.local.clear(); // Clear local storage for testing purposes

$(document).ready(function () {

    // Check if the URL contains 'pop_extension=true' to determine if the extension is active
    if (window.location.search.includes('pop_extension=true')) {
        const pricing_data_obj = new Array();

        /* Observe the page for changes start*/
        const observer = new MutationObserver((mutations, obs) => {
            const current_URL = new URL(window.location.href);
            const url_params = new URLSearchParams(current_URL.search);
            const product_card = document.querySelectorAll('div.single-product');

            if (product_card && product_card.length > 0) {
                // From date is used below as well
                const from_date = formatDateToYMD(url_params.get('departure')); // Assuming 'departure' is the from date parameter
                const to_date = formatDateToYMD(url_params.get('arrival')); // Assuming 'arrival' is the to date parameter

                product_card.forEach((card, i) => {
                    const product_title = product_card[i].getElementsByClassName('product-name')[0].innerText.trim()
                    const product_price = product_card[i].getElementsByClassName('price')[0].innerText.trim();

                    pricing_data_obj.push({
                        'product_title': product_title,     // name like "Meet & Greet Parking at London Heathrow Airport, lg parking"
                        'price': parseFloat(product_price.replace(/[^0-9.]/g, '')),
                        'from_date': from_date, // from date like "Mon, 20 Nov 2023"
                        'from_time': to24HourFormat(url_params.get('departure')), // from time like "10:00 AM"
                        'to_date': to_date, // to date like "Tue, 21 Nov 2023"
                        'to_time': to24HourFormat(url_params.get('arrival')), // to time like "10:00 AM"
                        'airport_name': url_params.get('airport'), // airport name like "London Heathrow Airport"
                        'parking_type': product_card[i].getElementsByClassName('type')[0].innerText.trim(),
                        'transfer_time': 'N/A', // Assuming transfer time is not available on this page
                        'website_id': 2
                    });
                });


                // Now send the data to background script
                chrome.runtime.sendMessage({
                    page_from: "compareparking_getting_data",
                    action: "get_pricing_data_for_filling",
                    pricing_data: pricing_data_obj
                }, (res) => {
                    console.log('res:', res);
                    // Get extension local data (popup form data) and trying to refresh the page
                    chrome.storage.local.get('popup_form_data', function (result) {
                        if (result && result.popup_form_data) {
                            console.log('from to date', from_date, result.popup_form_data.toDate, result.popup_form_data)
                            if (from_date == result.popup_form_data.toDate) {
                                // alert('I have updated the prices for you till ' + result.popup_form_data.toDate);
                                Swal.fire({
                                    position: 'center',
                                    type: 'success',
                                    title: 'Prices updated till ' + result.popup_form_data.toDate
                                })
                            } else {
                                // Try to refresh the page with new data
                                chrome.runtime.sendMessage({
                                    page_from: "compareparking_getting_data",
                                    action: "refresh_pages_for_data",
                                    from_date: from_date,
                                    gapDays: result.popup_form_data.gapDays
                                }, (response) => {
                                    window.location.href = response.refreshing_url; // Redirect to the new URL
                                    console.log('Response from background for refreshing the page:', response);
                                });
                                console.log('You are on the page with different dates. We are trying to refresh the page with new data.');
                            }
                        } else {
                            console.log('No popup_form_data found in local storage.');
                        }
                    });
                });

                obs.disconnect(); // Stop watching
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        /* Observe the page for changes end*/
    }

});

window.addEventListener('load', function () {
    /* If page is not English page and ENGLISH button is present START*/
    // let complete_url = new URL(window.location.href);
    // const page_language = complete_url.searchParams.get('lang').toUpperCase();
    const page_language = "ENG";                            // Made it english by default but in future versions user can change it
    const eng_button = this.document.getElementById('en-US');
    if (eng_button && page_language == "ENG") {
        // eng_button.click();
    }
    /* If page is not English page and ENGLISH button is present END*/
});


function formatDateToYMD(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`; // "2025-08-01"
}

function to24HourFormat(encodedDateTime) {
    const decoded = decodeURIComponent(encodedDateTime); // "2025-08-01 12:00"

    // Split and extract the time part
    const time = decoded.split(' ')[1];
    return time || '12:00:00'; // Return the time in 24-hour format
}