// chrome.storage.local.clear(); // Clear local storage for testing purposes

$(document).ready(function () {

    // Check if the URL contains 'pop_extension=true' to determine if the extension is active
    if (window.location.search.includes('pop_extension=true')) {

        const pricing_data_obj = new Array();

        /* Observe the page for changes start*/
        const observer = new MutationObserver((mutations, obs) => {
            const product_card = document.querySelectorAll('div.product-card__wrapper');
            if (product_card && product_card.length > 0) {
                // From date is used below as well
                const from_date = formatDateToYMD(document.getElementsByClassName('date-time-picker__value')[0].innerText.trim());
                const to_date = formatDateToYMD(document.getElementsByClassName('date-time-picker__value')[2].innerText.trim());

                product_card.forEach((card, i) => {
                    const product_title = product_card[i].querySelector('.product-card__mobile-title').innerText.trim()
                    const product_price = product_card[i].querySelector('span[data-testid="productCardPrice"]').innerText.trim();

                    pricing_data_obj.push({
                        'product_title': product_title,     // name like "Meet & Greet Parking at London Heathrow Airport, lg parking"
                        'price': parseFloat(product_price.replace(/[^0-9.]/g, '')),
                        'from_date': from_date, // from date like "Mon, 20 Nov 2023"
                        'from_time': to24HourFormat(document.getElementsByClassName('date-time-picker__value')[1].innerText.trim()), // from time like "10:00 AM"
                        'to_date': to_date, // to date like "Tue, 21 Nov 2023"
                        'to_time': to24HourFormat(document.getElementsByClassName('date-time-picker__value')[3].innerHTML.trim()), // to time like "10:00 AM"
                        'airport_name': document.querySelector('.airport-select input').value.trim(), // airport name like "London Heathrow Airport"
                        'parking_type': '',
                        'transfer_time': product_card[i].querySelector('.transfer-text').innerText.trim(),
                        'website_id': 1
                    });
                });


                // Now send the data to background script
                chrome.runtime.sendMessage({
                    page_from: "looking4_getting_data",
                    action: "get_pricing_data_for_filling",
                    pricing_data: pricing_data_obj
                }, (res) => {
                    console.log('res:', res);
                    // Get extension local data (popup form data) and trying to refresh the page
                    chrome.storage.local.get('popup_form_data', function (result) {
                        if (result && result.popup_form_data) {
                            console.log('from to date', from_date , result.popup_form_data.fromDate, result.popup_form_data)
                            if (from_date == result.popup_form_data.toDate) {
                                alert('I have updated the prices for you till ' + result.popup_form_data.toDate);
                            } else {
                                // Try to refresh the page with new data
                                chrome.runtime.sendMessage({
                                    page_from: "looking4_getting_data",
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

        $('.search-parking-filter__list-desktop-item').html();
        chrome.runtime.sendMessage({
            page_from: "looking4_getting_data",
            action: "get_pricing_data_for_filling",
            data: {
                'company_name': 'Looking4Parking',
                'price': 44
            }
        }, (res) => {
            console.log('res:', res);
        });
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

function to24HourFormat(time12h) {
    const [time, modifier] = time12h.toLowerCase().split(/(am|pm)/);
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'pm' && hours !== 12) {
        hours += 12;
    } else if (modifier === 'am' && hours === 12) {
        hours = 0;
    }

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}