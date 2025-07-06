let complete_url = new URL(window.location.href);

window.addEventListener('load', function () {
    /* Clearing the URL Once we reach this url START*/
    chrome.storage.local.get(['f_destination_href'], (p) => {
        if (p.f_destination_href == complete_url.href) {
            chrome.storage.local.set({
                'f_destination_href': '',
                'f_destination_path': '',
                'eno_file_reference_number': '',
                'eno_file_record_number': '',
                'eno_passport': '',
                'user_ip': complete_url.searchParams.get('ip')
            });
        }
    })
    /* Clearing the URL Once we reach this url START*/

    $('a[href="/SmartForm/TraditionalApp"]').click(function (e) {
        e.preventDefault();
        location.href = "/SmartForm/TraditionalApp" + complete_url.search;
    });

    // $('a[href="/SmartForm/TraditionalApp"]').click();

});