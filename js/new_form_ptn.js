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
    //
    var s = document.createElement('script');
        s.src = chrome.runtime.getURL('/js/external_select2_caller.js');
        s.onload = function () {
            this.remove();
        };
        (document.head || document.documentElement).appendChild(s);
    
    /* Clearing the URL Once we reach this url START*/
    console.log('navigated to oep');
    /* Header Start */
    const header_button_div = create_header_for_new_form_ptn();
    console.log('header created');
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
        action: "get_user_data_for_ptn",
        file_reference: _fref,
        record_number: _recno
    }, (res) => {
        console.log('res:', res);
       // $('#demand_ltr_no').val(res.data.DocumentNumber);
        var myArray=res.data;
        for (var key in myArray) {
            console.log("key " + key + " has value " + myArray[key]);
            var idtochange=key;
            if (idtochange.substring(0,8)=='recordto'){
                if (parseInt(myArray[key])>0){
                console.log('new record'+myArray[key]);
                $(".add_another_job").trigger( "click" );
                setTimeout('', 2000);
                }
            }
            else
            {
            var changeid=document.getElementById(idtochange);
           if (changeid !=undefined){
            
            if (changeid.tagName=='SELECT' && changeid.options.length>0){
                var yesdone=0;
                //We will send either value or text of select
                //First we check for value
                for (cntr=0;cntr<changeid.options.length;cntr++){
                    if(changeid.options[cntr].value==myArray[key] && yesdone==0){
                        changeid.value=myArray[key];
                        yesdone=1;
                        console.log(idtochange+' from value');
                    }
                }
                for (cntr=0;cntr<changeid.options.length;cntr++){
                    if(changeid.options[cntr].text==myArray[key] && yesdone==0){
                        changeid.value=changeid.options[cntr].value;
                        yesdone=1;
                        console.log(idtochange+' from text');        
                    }
                } 
                 
                //
                yesdone=0;
                var thespankey='select2-'+idtochange+'-container';
                for (k=1;k<changeid.options.length;k++){
                    if (changeid.options[k].value==myArray[key] && yesdone==0){
                        this.document.getElementById(thespankey).innerHTML=changeid.options[k].text;
                        console.log(changeid.options[k].text);
                        yesdone=1;    
                    }
                    if (changeid.options[k].text==myArray[key] && yesdone==0){
                        this.document.getElementById(thespankey).innerHTML=changeid.options[k].text;
                        console.log(changeid.options[k].text);
                        yesdone=1;    
                    }
                }
            }
            else
            {
                changeid.value=myArray[key];
            }
        }
        }
          }
          allbuttons=this.document.getElementsByTagName('button');
          for (i=0;i<allbuttons.length;i++){
            if (allbuttons[i].innerHTML.trim()=='Request New Permission'){
            //    allbuttons[i].click();
            }else{
            //    console.log(allbuttons[i].innerHTML);
            }
          }
          //this.document.forms[0].submit();
        /* If the page is not ENG (english) then we need to put arabic values in some fields END*/
        this.document.getElementById('put_image').addEventListener('click', function(){
            $('#call_external_selectImage').click();
        });
      
        this.document.getElementById('put_values').addEventListener('click', function(){
             $('#call_external_select2').click();
            const alert_success_error = res.data.DocumentNumber ? "success" : "error";
            show_sweet_alert_message(alert_success_error);
        })
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
    //try {
    //    if (document.getElementsByName('Command')[0].value == 'Save') {
    //        this.document.getElementsByName('Command')[0].addEventListener('click', function () {
                chrome.storage.local.set({
                    'eno_file_reference_number': complete_url.searchParams.get('fref'),
                    'eno_file_record_number': complete_url.searchParams.get('recno'),
                    'eno_passport': complete_url.searchParams.get('pp'),
                    'user_ip': complete_url.searchParams.get('ip')
                });
    //        });
    //    }
    //} catch (error) {
    //    console.log('Save Button Command:', error); // This is usually empty case value for the button is present but will not work once save button have no value
    //}
    /* Clicking Save Button END*/
});

function create_header_for_new_form_ptn() {
    let put_values_button = '<button id="put_values" class="defaultbtnWide btn blue_white pull-right">Put Values</button>';
    // let put_image_button = '<button id="put_image" class="defaultbtnWide btn blue_white pull-right">Put Image</button>';
    const header_button_div = `<div class="container-fluid header_button_div">
                                    <div class="row">
                                        <div class="col-sm-6 header_info_col">
                                            <span class="header_info">FXSoft © Recruiting Software for updation</span>
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
        show_message = 'Please check all the field before submitting. '
    } else {
        icon_type = 'error';
        show_message = 'Error ocurred! Please refresh the page and try again.'
    }
    Swal.fire({
        position: 'top-end',
        type: icon_type,
        title: show_message,
        showConfirmButton: true
    })
}