try {
    const complete_url = new URL(window.location.href);
    const page_url = complete_url.origin + "" + complete_url.pathname;
    if (page_url == 'https://services.ksavisa.sa/Enjaz/GetVisaInformation/Person') {
        $('#Embassy').select2();
    }
    if (page_url == 'https://services.ksavisa.sa/SmartForm/TraditionalApp') {
        $('body').append("<span id='call_external_select2' onclick='call_external_select2()'></span>");
        $('body').append("<span id='call_external_selectImage' onclick='call_external_selectImage()'></span>");
        $('#VisaKind').select2();
        $('#COMING_THROUGH').select2();
        $('#EmbassyCode').select2();
        $('#NATIONALITY').select2().trigger('change');
        $('#NATIONALITY_FIRST').select2().trigger('change');
        $('#PASSPORType').select2().trigger('change');
        $('#PASSPORT_ISSUE_PLACE').select2().trigger('change');
        $('#RELIGION').select2().trigger('change');
        $('#Sex').select2().trigger('change');
        $('#JOB_OR_RELATION').select2();
        $('#SOCIAL_STATUS').select2().trigger('change');
        $('#ENTRY_POINT').select2().trigger('change');
        setTimeout('',2000);
        $('#Number_Entry_Day').prop('selectedIndex',1).trigger('change');
        setTimeout('',2000);
        $('#RESIDENCY_IN_KSA').prop('selectedIndex',1).trigger('change');
       
    }
    if (page_url == 'https://beoe.gov.pk/oep-portal/emigrant-registrations/create') {
        $('body').append("<span id='call_external_select2' onclick='call_external_select2()'></span>");
        $('#ptn').trigger('change');
        setTimeout('',3000);
        $('#provinve_id').trigger('change');
        //setTimeout('',3000);
        //$("#district_id").prop("disabled", false);
        console.log('ptn triggered');
       //get_district_by_province($('#province_id').val(), $('#district_id'), true); 
       // setTimeout('',3000);
      
    }
} catch (err) {
    console.log('err:', err)
}

function call_external_select2() {
    $('#ENTRY_POINT').select2();
    $('#SOCIAL_STATUS').select2();
    //$('#NUMBER_OF_ENTRIES').trigger('change');
    $('#NUMBER_OF_ENTRIES, #Number_Entry_Day, #RESIDENCY_IN_KSA').select2();
    
}
function call_external_selectImage() {
        
}


