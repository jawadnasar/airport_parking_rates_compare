let complete_url = new URL(window.location.href);

window.addEventListener('load', function () {
    /* Clearing the URL Once we reach this url START*/
    // chrome.storage.local.get(['f_destination_href'], (p) => {
    //     if (p.f_destination_href == complete_url.href) {
    //         chrome.storage.local.set({
    //             'f_destination_href': '',
    //             'f_destination_path': '',
    //             'eno_file_reference_number': '',
    //             'eno_file_record_number': '',
    //             'eno_passport': '',
    //             'user_ip': complete_url.searchParams.get('ip')
    //         });
    //     }
    // })
    /* Clearing the URL Once we reach this url START*/

    /* Header Start */
    const header_button_div = create_header_for_new_form_filling();
    $('body').prepend(header_button_div); // Custom Header used for updation button
    $('.page-header-top').css({
        "margin-top": $('.header_button_div').height() - 15 + "px"
    })
    /* Header End */

    /* 
        Fill in Form For Enjaz 
    */
    const _fref = complete_url.searchParams.get('fref');
    const _recno = complete_url.searchParams.get('recno');

    chrome.runtime.sendMessage({
        page_from: "enjaz_redirection",
        action: "get_user_data_for_filling",
        file_reference: _fref,
        record_number: _recno
    }, (res) => {
        console.log('res:', res);
        $('#VisaKind').val(res.data.VisaKind);
            $('#COMING_THROUGH').val(res.data.COMING_THROUGH);
            $('#EmbassyCode').val(res.data.EmbassyCode);
            $('#call_external_select2').click();
            $('#NUMBER_OF_ENTRIES').val(res.data.NUMBER_OF_ENTRIES); 
            $('#COMING_THROUGH').val(res.data.COMING_THROUGH);
            $('#EmbassyCode').val(res.data.EmbassyCode);
            $('#call_external_select2').click();
            $('#NUMBER_OF_ENTRIES').val(res.data.NUMBER_OF_ENTRIES);
            if (document.getElementById('DocumentNumber')!=null){
                 $('#DocumentNumber').val(res.data.DocumentNumber);
            }
            $('#AFIRSTNAME').val(res.data.AFIRSTNAME);
            $('#AFATHER').val(res.data.AFATHER);
            $('#AGRAND').val(res.data.AGRAND);
            $('#AFAMILY').val(res.data.AFAMILY);
            $('#EFIRSTNAME').val(res.data.EFIRSTNAME);
            $('#EFATHER').val(res.data.EFATHER);
            $('#EGRAND').val(res.data.EGRAND);
            $('#EFAMILY').val(res.data.EFAMILY);
            $('#NATIONALITY').val(res.data.NATIONALITY).trigger('change');
            if (res.data.NATIONALITY==res.data.NATIONALITY_FIRST){
               $('input:radio[name=Has_NATIONALITY_FIRST]:nth(1)').attr('checked',true);
            }else{
                Swal.fire({
                    type: 'info',
                    title: 'Please, answar to: Do you have previous Nationality?',
                    showConfirmButton: true
                });
            }
            
            $('input:radio[name=HaveTraveledToOtherCountries]:nth(1)').attr('checked',true);
            $('#NATIONALITY_FIRST').val(res.data.NATIONALITY_FIRST);
            $('#PASSPORTnumber').val(res.data.PASSPORTnumber);
            $('#PASSPORType').val(res.data.PASSPORType);
            $('#PASSPORT_ISSUE_DATE').val(res.data.PASSPORT_ISSUE_DATE);
            $('#PASSPORT_EXPIRY_DATe').val(res.data.PASSPORT_EXPIRY_DATe);
            $('#BIRTH_PLACE').val(res.data.BIRTH_PLACE);
            $('#BIRTH_DATE').val(res.data.BIRTH_DATE);
            $('#PersonId').val(res.data.PersonId);
            $('#JOB_OR_RELATION').val(res.data.JOB_OR_RELATION);
            //if (res.data.imagePath){
              if ($('#theimage').val()==''){
                pasteFromClipboard();
              }
            //}
            $('#theprof').val(res.data.JOB_OR_RELATION);
            $('#RELIGION').val(res.data.RELIGION);
            $('#SOCIAL_STATUS').val(res.data.SOCIAL_STATUS);
            $('#Sex').val(res.data.Sex);
            $('#DEGREE').val(res.data.DEGREE);
            $('#DEGREE_SOURCE').val(res.data.DEGREE_SOURCE);
            $('#ADDRESS_HOME').val(res.data.ADDRESS_HOME);
            $('#SPONSER_NAME').val(res.data.SPONSER_NAME);
            $('#SPONSER_NUMBER').val(res.data.SPONSER_NUMBER);
            $('#SPONSER_ADDRESS').val(res.data.SPONSER_ADDRESS);
            $('#SPONSER_PHONE').val(res.data.SPONSER_PHONE);
            $('#ENTRY_POINT').val(res.data.ENTRY_POINT);
            $('#ExpectedEntryDate').val(res.data.ExpectedEntryDate);
            $('#porpose').val(res.data.porpose);
            $('#Endorsement').prop('checked',true);
            //$('#NUMBER_OF_ENTRIES').val(res.data.NUMBER_OF_ENTRIES);
            // $('#Number_Entry_Day').val(res.data.Number_Entry_Day);
            // $('#RESIDENCY_IN_KSA').val(res.data.RESIDENCY_IN_KSA);

            /* If the page is not ENG (english) then we need to put arabic values in some fields START*/
            const eng_button = this.document.getElementById('en-US');
            const arb_button = this.document.getElementById('ar-SA');
            if (!eng_button && arb_button) { // If english button is not present and arabic button is present then the page is already in english
                $('#PASSPORT_ISSUE_PLACE').val(res.data.PASSPORT_ISSUE_PLACE); // This means the page is in English
            } else if (eng_button && !arb_button) {
                if (res.data.PASSPORT_ISSUE_PLACEA) { // If arabic country name is present
                    $('#PASSPORT_ISSUE_PLACE').val(res.data.PASSPORT_ISSUE_PLACEA);
                } else {
                    $('#PASSPORT_ISSUE_PLACE').val('باكستان');
                }
            }
            /* If the page is not ENG (english) then we need to put arabic values in some fields END*/
        
            this.document.getElementById('put_image').addEventListener('click', function () {
                //$('#NUMBER_OF_ENTRIES').val(res.data.NUMBER_OF_ENTRIES);
                // $('#Number_Entry_Day').val(res.data.Number_Entry_Day);
                // $('#RESIDENCY_IN_KSA').val(res.data.RESIDENCY_IN_KSA);
                //$('#call_external_selectImage').click();
                pasteToClipboard();
            });
        this.document.getElementById('put_values').addEventListener('click', function () {
            //$('#NUMBER_OF_ENTRIES').val(res.data.NUMBER_OF_ENTRIES);
            // $('#Number_Entry_Day').val(res.data.Number_Entry_Day);
            // $('#RESIDENCY_IN_KSA').val(res.data.RESIDENCY_IN_KSA);
            $('#call_external_select2').click();
            const alert_success_error = res.data.DocumentNumber ? "success" : "error";
            show_sweet_alert_message(alert_success_error);
        });

        // External Scripts called
        var s = document.createElement('script');
        s.src = chrome.runtime.getURL('/js/external_select2_caller.js');
        s.onload = function () {
            this.remove();
        };
        (document.head || document.documentElement).appendChild(s);
    });

    /* Clicking Save Button START
     * After this button clicked all the information is save in chrome local storage
     */
    try {
        if (document.getElementsByName('Command')[0].value == 'Save') {
            this.document.getElementsByName('Command')[0].addEventListener('click', function () {
                chrome.storage.local.set({
                    'eno_file_reference_number': complete_url.searchParams.get('fref'),
                    'eno_file_record_number': complete_url.searchParams.get('recno'),
                    'eno_passport': complete_url.searchParams.get('pp'),
                    'user_ip': complete_url.searchParams.get('ip')
                });
            });
        }
    } catch (error) {
        console.log('Save Button Command:', error); // This is usually empty case value for the button is present but will not work once save button have no value
    }
    /* Clicking Save Button END*/
});

function create_header_for_new_form_filling() {
    let put_values_button = '<button id="put_values" class="defaultbtnWide btn blue_white pull-right">Put Values</button><button id="put_image" class="defaultbtnWide btn blue_white pull-right">Put Image</button>';
    //let put_values_hidden_button = '<button id="put_values_hidden_button">Hidden Button</button>';
    // let put_image_button = '<button id="put_image" class="defaultbtnWide btn blue_white pull-right">Put Image</button>';
    const header_button_div = `<div class="container-fluid header_button_div">
                                    <div class="row">
                                        <div class="col-sm-6 header_info_col">
                                            <span class="header_info">FXSoft&trade; AcBooks&copy; for Recruiting Agents <input tyep='hidden' style='color:black;display:none' id="theimage" imagePath='' value=''/> <input type='text' id='theprof' style='color:black;' onClick='navigator.clipboard.writeText(this.value)' value=''/></span>
                                        </div>
                                        <div class="col-sm-6">
                                            ${put_values_button}
                                          
                                        </div>
                                    </div>
                                </div>`;
    return header_button_div;
}

function show_sweet_alert_message(scs_err) {
    let icon_type, show_message;
    if (scs_err == 'success') {
        icon_type = 'success';
        show_message = 'Please check all the field before submitting'
    } else {
        icon_type = 'error';
        show_message = 'Error ocurred! Please refresh the page and try again'
    }
    Swal.fire({
        position: 'top-end',
        type: icon_type,
        title: show_message,
        showConfirmButton: true
    })
}

function show_hide_pending_spinner(on_off) {
    let spinner_src = chrome.runtime.getURL(`img/spinner.gif`);
    if (on_off == 'on') {
        $('body').prepend(`<div class="overlay_spinner">
                                <div class="loader"></div>
                                <img id="main_spinner" src="${spinner_src}" alt="Loading"></img>
                            </div>`);
    } else {
        $('.overlay_spinner').remove();
    }
}
async function pasteFromClipboard() {
    const text = await navigator.clipboard.readText();
    $('#theimage').val(text);
  }
  async function pasteToClipboard() {
    var theimagetext=await $('#theimage').val();
    navigator.clipboard.writeText(theimagetext);
    nextmove=await $('#PersonalImage').trigger('click');
    //var theproftext=await $('#theprof').val();
    //navigator.clipboard.writeText(theproftext);
  }