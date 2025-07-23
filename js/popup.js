
// Save form data to chrome.storage.local for later use
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('parkingForm');
    if (!form) return;

    // Load last saved data and show in form and output
    if (chrome && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get('popup_form_data', function (result) {
            if (result && result.popup_form_data) {
                const data = result.popup_form_data;
                document.getElementById('fromDate').value = data.fromDate || '';
                document.getElementById('toDate').value = data.toDate || '';
                document.getElementById('gapDays').value = data.gapDays || '';
                document.getElementById('lookingForParking').checked = !!data.lookingForParking;
                document.getElementById('simplyParking').checked = !!data.simplyParking;
                document.getElementById('compareParking').checked = !!data.compareParking;
            }
        });
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const fromDate = document.getElementById('fromDate').value;
        const toDate = document.getElementById('toDate').value;
        const gapDays = document.getElementById('gapDays').value;
        const lookingForParking = document.getElementById('lookingForParking').checked;
        const simplyParking = document.getElementById('simplyParking').checked;
        const compareParking = document.getElementById('compareParking').checked;
        const data = {
            fromDate,
            toDate,
            gapDays,
            lookingForParking,
            simplyParking,
            compareParking, 
        };
        // Save to chrome.storage.local
        if (chrome && chrome.storage && chrome.storage.local) {
            chrome.storage.local.set({ popup_form_data: data }, function () {
                const output = document.getElementById('output');
                if (output) {
                    output.innerHTML = `<div>Information saved!</div>`
                }

                // Start refreshing the pages for data on user request
                chrome.runtime.sendMessage({
                    page_from: "popup",
                    action: "refresh_pages_for_data",
                    data: data
                }, (response) => {
                    console.log('Response from background:', response);
                });
            });
        }
    });
});
