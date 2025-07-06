$(document).ready(function () {

    // Making Header
    const header_button_div = create_header_for_getting_visa_details();
    $('body').prepend(header_button_div); // Custom Header used for updation button
    $('.page-header-top').css({"margin-top":$('.header_button_div').height()-15+"px"})

    /* 
        Login Button and its event listener
        * If it came from software then we must apply Event Listener to update_visa_info button
        * If the person has no link and came by himself then we should hide update button from him
    */
    chrome.runtime.sendMessage({
        page_from: "view_visa_details",
        action: "check_user_came_from_software"
    }, (res) => {
        if (res.show_hide_button == 'show_update_button') {
            event_listener_for_update_visa_info_button(); // Event Listener for add update visa button
        } else {
            // $('#update_visa_info').hide();                // If can't update then don't need even listener
            $('.header_button_div').hide();                // If can't update then don't need even listener
        }
    });


});

function create_header_for_getting_visa_details() {
    let add_update_button = '<button id="update_visa_info" class="defaultbtnWide btn blue_white pull-right">Update Visas</button>';
    const header_button_div = `<div class="container-fluid header_button_div">
                                    <div class="row">
                                        <div class="col-sm-6 header_info_col">
                                            <span class="header_info">FXSoft © Recruiting Software for updation</span>
                                        </div>
                                        <div class="col-sm-6">
                                            ${add_update_button}
                                        </div>
                                    </div>
                                </div>`;
    return header_button_div;
}

function event_listener_for_update_visa_info_button() {
    /* Update Visa Information Button clicked START */
    const update_visa_info = document.getElementById('update_visa_info'); // Custom Header Button 
    update_visa_info.addEventListener('click', function () {
        let visa_complete_info_obj = {}; // Visa Info Object
        let action_1 = $('form').attr('action');
        if (action_1 == '/Enjaz/ViewVisaDetails/Person') {
            let f_visa_number, f_visa_date, f_sponsor_full_name, f_sponsor_address, f_sponsor_id_number, f_embassy_location;
            for (let i = 0; i < $('form label').length; i++) {
                const element = $('form label')[i];
                switch (element.textContent.trim()) {
                    case 'Visa Issued Number':
                        f_visa_number = element.nextElementSibling.innerHTML.trim();
                        break;
                    case 'رقم الصادر':
                            f_visa_number = element.nextElementSibling.innerHTML.trim();
                            break;
                    case 'Visa Date':
                            f_visa_date = element.nextElementSibling.innerHTML.trim();
                            break;
                    case 'تاريخ التأشيرة':
                            f_visa_date = element.nextElementSibling.innerHTML.trim();
                            break;
                    case 'Full Name':
                        f_sponsor_full_name = element.nextElementSibling.innerHTML.trim();
                        break;
                    case 'الاسم':
                        f_sponsor_full_name = element.nextElementSibling.innerHTML.trim();
                        break;
                    case 'Sponsor Address':
                        f_sponsor_address = element.nextElementSibling.innerHTML.trim();
                        break;
                    case 'العنوان':
                        f_sponsor_address = element.nextElementSibling.innerHTML.trim();
                        break;
                    case 'Residence/National ID Number':
                        f_sponsor_id_number = element.nextElementSibling.innerHTML.trim();
                        break;
                    case 'رقم  الإقامة':
                        f_sponsor_id_number = element.nextElementSibling.innerHTML.trim();
                        break;
                    case 'Display Visas related to Embassy in:':
                        f_embassy_location = $(element).siblings().find('select').val();
                        break;
                    case 'عرض التأشيرات الموجودة في ممثلية:':
                        f_embassy_location = $(element).siblings().find('select').val();
                        break;
                    default:
                        console.log('Swith value: ', element.textContent.trim());
                }
            }

            // * Getting Jobs List array of objects from tabl
            let vi_jobs_list_array = [];
            const job_elements = $('#dvJobsGrid table tbody tr');
            for (let i = 0; i < job_elements.length; i++) {
                vi_jobs_list_array[i] = {
                    j_persons_count: $(job_elements[i]).find('td').eq(0).text(),
                    j_occupation: $(job_elements[i]).find('td').eq(1).text(),
                    j_nationality: $(job_elements[i]).find('td').eq(2).text(),
                    j_visa_issuing_authority: $(job_elements[i]).find('td').eq(3).text(),
                    j_available_number: $(job_elements[i]).find('td').eq(4).text(),
                    name: $(job_elements[i]).find('td').eq(5).text()
                };
            }

            // * Getting Delegation of embassies array of objects from table
            let vi_delegation_of_embassies_array = [];
            const de_elements = $('#dvDelegationsInEmbassies table tbody tr');
            for (let i = 0; i < de_elements.length; i++) {
                vi_delegation_of_embassies_array[i] = {
                    e_delegation_number: $(de_elements[i]).find('td').eq(0).text(),
                    e_visa_issuing_authority: $(de_elements[i]).find('td').eq(1).text(),
                    e_persons_count: $(de_elements[i]).find('td').eq(2).text(),
                    e_occupation: $(de_elements[i]).find('td').eq(3).text(),
                    e_delegation_number_hash: $(de_elements[i]).find('td').eq(4).text(),
                    e_delegated_agency_name: $(de_elements[i]).find('td').eq(5).text()
                };
            }

            // * Getting Delegation List array of objects from table
            let vi_delegation_list_array = [];
            const dlist_elements = $('#dvDelegationGrid table tbody tr');
            for (let i = 0; i < dlist_elements.length; i++) {
                vi_delegation_list_array[i] = {
                    l_delegation_number: $(dlist_elements[i]).find('td').eq(0).text(),
                    l_delegated_agency_name: $(dlist_elements[i]).find('td').eq(1).text(),
                    l_visa_issuing_authority: $(dlist_elements[i]).find('td').eq(2).text(),
                    l_occupation: $(dlist_elements[i]).find('td').eq(3).text(),
                    l_persons_count: $(dlist_elements[i]).find('td').eq(4).text(),
                    l_ratified_by: $(dlist_elements[i]).find('td').eq(5).text(),
                    l_ratification_date: $(dlist_elements[i]).find('td').eq(6).text()
                };
            }

            visa_complete_info_obj = {
                visa_issue_number: f_visa_number,
                visa_date: f_visa_date,
                sponsor_full_name: f_sponsor_full_name,
                sponsor_address: f_sponsor_address,
                sponsor_id_number: f_sponsor_id_number,
                embassy_location: f_embassy_location,
                jobs_list: vi_jobs_list_array,
                jobs_list_html: $('#dvJobsGrid table').html(), 
                delegation_of_embassies: vi_delegation_of_embassies_array,
                delegation_of_embassies_html: $('#dvDelegationsInEmbassies table').html(),
                delegation_list: vi_delegation_list_array, 
                delegation_list_html: $('#dvDelegationGrid table').html()
            };

            show_hide_pending_spinner('on');
            chrome.runtime.sendMessage({
                    page_from: "view_visa_details",
                    action: "add_update_visa_info",
                    visa_complete_data: visa_complete_info_obj
                },
                function (res) {
                    console.log('DataBase REsponse:', res);
                    show_hide_pending_spinner('off');
                    let a_type, a_message, a_title;
                    if (res['status'] == 'success') {
                        a_type = 'success';
                        a_title = "Updated!";
                        a_message = res['data']['message'];
                    } else {
                        a_type = 'error';
                        a_title = 'Updation Failed';
                        a_message = res['data']['message'];
                    }
                    Swal.fire({
                        type: a_type,
                        html: a_message,
                        title: a_title
                    });
                }
            )
        }
    })

    /* Update Visa Information Button clicked END */
}

function show_hide_pending_spinner(on_off){
    let spinner_src = chrome.runtime.getURL(`img/spinner.gif`);
    if(on_off == 'on'){
        $('body').prepend(`<div class="overlay_spinner">
                                <div class="loader"></div>
                                <img id="main_spinner" src="${spinner_src}" alt="Loading"></img>
                            </div>`);
    }else{
        $('.overlay_spinner').remove();
    }
}