var ProposalNo = '',
    PIVC_LINK = '',
    IS_EKYC = '',
    QUOT_NUMBER = '',
    CUST_NAME = '',
    CUST_MOBILE_NUMBER = '',
    SR_NAME = '',
    SR_CODE = '',
    PLAN_NAME = '',
    LA_NAME = '',
    CUST_EMAIL = '',
    ADVISOR_EMAIL = '',
    strDocType = '',
    service_is_ekyc = '',
    sendOTPFlag = '',
    IS_ESIGN = '',
    is_aadhar_doc_selected = '',
    SOURCE_BANK_NAME = '',
    local_Language = '',
    str_para_ekyc_consent = '',
    consent3 = '';

var langData;
var currentDate = '';
var mOnePagerIMG, mUserPhoto, mUserMobilePhoto, mUserEmailPhoto;
var isOnePageImgUploaded = false;
var mOnePagerPDF, mOnePgrMobEmailPDF;
var mOnePagerVID;
var ONE_PAGER_ADDENDUM = "_ONEPAGER_ADDENDUM_"
var IMG_USER_PHOTO = "img_USER_PIC_01";
var IMG_USER_MOB_PHOTO = "img_USER_PIC_02";
var IMG_USER_EMAIL_PHOTO = "img_USER_PIC_03";
var IMG_ONEPAGER = "img_CUSTDECL_01";
var PDF_ONEPAGER = "pdf_onepager_01";
var PDF_MOB_EMAIL_VALIDATION = "pdf_onepager_02";
var VID_ONEPAGER = "vid_custvideo_01";
var orgnisation_name = 'SBI Life Insurance Company Limited (SBI Life)',
    orgnisation_name_a = 'SBI life';
var recorder; // globally accessible
var video;
var is_1w_addendum = false;
var isNameValidated, isMobileValidated, isEmailValidated;

var video, canvas, photo, startbutton;

// Grab elements, create settings, etc.
var videoUser, videoMobile, videoEmail;
var canvasUser, canvasMobile, canvasEmail;
var contextUser, contextMobile, contextEmail;

window.onload = function () {
    this.ready();
}

function getURLParameter(name) {
    return decodeURI((RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]);
}

function hideURLParams() {
    //Parameters to hide (ie ?success=value, ?error=value, etc)
    var hide = ['prop'];
    for (var h in hide) {
        if (getURLParameter(h)) {
            history.replaceState(null, document.getElementsByTagName("title")[0].innerHTML, window.location.pathname);
        }
    }
}

function ready() {

    let urlParm = new URLSearchParams(window.location.search.replace("&amp;", "&"));

    /* var data = urlParm.get('prop').split('|');
    let count = data.length
    switch (count) {
        case 2:
            if (data[1] && data[1] === "ADD") {
                is_1w_addendum = true;
            } else {
                PIVC_LINK = data[1];
                is_1w_addendum = false;
            }
            break;

        case 3:
            PIVC_LINK = data[1];
            if (data[1] && data[1] === "ADD") {
                is_1w_addendum = true;
            }
            break;

        default:
            break;
    }
    ProposalNo = data[0]; */

    //ProposalNo = '1BYB245877';
    //ProposalNo = '1HNC933892';
    //ProposalNo = '2R00000004';
    //ProposalNo = '2TAW000330';
    //ProposalNo = '2KYC886487';
    //ProposalNo = '2XYB254560';
    ProposalNo = '2XYB254632';
    //ProposalNo = '1WYB255341';
    PIVC_LINK = "https://youtube.com";
    is_1w_addendum = true;

    hideURLParams();

    document.getElementById('modalDesc1').innerText = `We request you to please complete pre-issuance verification process by clicking here `;
    document.getElementById('anchorPIVCLInk').href = PIVC_LINK;
    document.getElementById('anchorPIVCLInk').innerText = PIVC_LINK;
    document.getElementById('modalDesc2').innerText = `. Your policy issuance is subject to underwritting and verification process. Call our toll free `;
    document.getElementById('modalDesc3').innerText = ` for further info. In case of any error while clicking on link, please copy and paste the link directly in the web-browser.`;
    // When the user clicks anywhere outside of the modal, close it
    /* window.onclick = function(event) {
        if (event.target == document.getElementById('myModal')) {
            document.getElementById('myModal').style.display = "none";
        }
    } */

    document.getElementById('txtProposalNumer').innerText = `Annexure to Electronic Proposal Number ${ProposalNo}`;

    document.getElementById('linkProposalPDF').href = SERVICE_HOST_NAME + 'tempproposalpdf.aspx?prop=' +
        ProposalNo;

    video = document.querySelector('video');

    currentDate = new Date();
    document.getElementById('txtCustDeclarationDate').value = dateDDFullMonthYYYY(currentDate.toISOString().substr(0, 10));
    document.getElementById('txtSalesRepreDate').value = dateDDFullMonthYYYY(currentDate.toISOString().substr(0, 10));

    //check chrome browser is available and Browser supports Camera Functionality
    var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

    if (isChrome && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

        getProposalDetails();

        // Grab elements, create settings, etc.
        videoUser = document.getElementById('videoUser');
        canvasUser = document.getElementById('canvasUser');
        contextUser = canvasUser.getContext('2d');

        videoMobile = document.getElementById('videoMobile');
        canvasMobile = document.getElementById('canvasMobile');
        contextMobile = canvasMobile.getContext('2d');

        videoEmail = document.getElementById('videoEmail');
        canvasEmail = document.getElementById('canvasEmail');
        contextEmail = canvasEmail.getContext('2d');

    } else {

        self.hideLoader('loader');

        document.getElementById('divMainContainer').style.display = 'none';
        document.getElementById('divMainContainerError').style.display = 'block';
        document.getElementById('divMainContainerError1').innerHTML = 'Kindly use Google Chrome browser to open this link';
    }
}

function getMobEmailVadilationVal(radio, name) {

    switch (name) {
        case 'NameValidation':
            if (radio.value == 'No') {
                isNameValidated = false;
                alert('Proposal cannot be processed further in view of mismatch in Name. Please get in touch with your sales person.');
                document.getElementById('divNamePhoto').style.display = 'none';
            } else {
                isNameValidated = true;

                if (!CUST_EMAIL) {
                    // Get access to the camera!
                    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                        // Not adding `{ audio: true }` since we only want video now
                        navigator.mediaDevices.getUserMedia({
                            video: {
                                facingMode: 'user',
                            }
                        }).then(function (stream) {
                            //video.src = window.URL.createObjectURL(stream);
                            videoUser.srcObject = stream;
                            videoUser.play();
                        });
                    }
                    document.getElementById('divNamePhoto').style.display = 'block';
                } else {
                    document.getElementById('divNamePhoto').style.display = 'none';
                }
            }
            break;

        case 'MobileValidation':
            if (radio.value == 'No') {
                isMobileValidated = false;
                alert('Proposal cannot be processed further in view of mismatch in Mobile. Please get in touch with your sales person.');
                document.getElementById('divMobilePhoto').style.display = 'none';
            } else {
                isMobileValidated = true;

                // Get access to the camera!
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    // Not adding `{ audio: true }` since we only want video now
                    navigator.mediaDevices.getUserMedia({
                        video: {
                            facingMode: 'user',
                        }
                    }).then(function (stream) {
                        //video.src = window.URL.createObjectURL(stream);
                        videoMobile.srcObject = stream;
                        videoMobile.play();
                    });
                }
                document.getElementById('divMobilePhoto').style.display = 'block';
            }
            break;

        case 'EmailValidation':
            if (radio.value == 'No') {
                isEmailValidated = false;
                alert('Proposal cannot be processed further in view of mismatch in Email. Please get in touch with your sales person.');
            } else {
                isEmailValidated = true;

                if (CUST_EMAIL) {

                    // Get access to the camera!
                    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                        // Not adding `{ audio: true }` since we only want video now
                        navigator.mediaDevices.getUserMedia({
                            video: {
                                facingMode: 'user',
                            }
                        }).then(function (stream) {
                            //video.src = window.URL.createObjectURL(stream);
                            videoEmail.srcObject = stream;
                            videoEmail.play();
                        });
                    }
                    document.getElementById('divEmailPhoto').style.display = 'block';

                }
            }
            break;
    }
}

function onClickCapturePic(type) {

    if (type == 'name') {

        strDocType = IMG_USER_PHOTO;

        contextUser.drawImage(videoUser, 0, 0, 250, 250);
        canvasUser.style.display = "block";
        videoUser.style.display = 'none';

        mUserPhoto = canvasUser.toDataURL("image/png");
        //mUserPhoto = mUserPhoto.replace('data:image/png;base64,', '');

    } else if (type == 'mobile') {

        strDocType = IMG_USER_MOB_PHOTO;

        contextMobile.drawImage(videoMobile, 0, 0, 250, 250);
        canvasMobile.style.display = "block";
        videoMobile.style.display = 'none';

        mUserMobilePhoto = canvasMobile.toDataURL("image/png");
        //mUserMobilePhoto = mUserMobilePhoto.replace('data:image/png;base64,', '');
    } else if (type == 'email') {

        strDocType = IMG_USER_EMAIL_PHOTO;

        contextEmail.drawImage(videoEmail, 0, 0, 250, 250);
        canvasEmail.style.display = "block";
        videoEmail.style.display = 'none';

        mUserEmailPhoto = canvasEmail.toDataURL("image/png");
        //mUserEmailPhoto = mUserEmailPhoto.replace('data:image/png;base64,', '');
    }
}

function onClickRetakePic(type) {

    strDocType = "";

    if (type == 'name') {

        canvasUser.style.display = "none";

        videoUser.style.display = 'block';

        //contextUser.drawImage(null, 0, 0, 250, 250);
        mUserPhoto = undefined;
    } else if (type == 'mobile') {
        canvasMobile.style.display = "none";

        videoMobile.style.display = 'block';

        //contextMobile.drawImage(null, 0, 0, 250, 250);
        mUserMobilePhoto = undefined;
    } else if (type == 'email') {
        canvasEmail.style.display = "none";

        videoEmail.style.display = 'block';

        //contextEmail.drawImage(null, 0, 0, 250, 250);
        mUserEmailPhoto = undefined;
    }
}

function getProposalDetails(proposalNum) {

    var data, parser, xmlDoc;

    let SERVICE_NAME = 'getProposalDet_smrt';
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', serviceURL + '?op=' + SERVICE_NAME, true);
    // build SOAP request
    var sr =
        `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
          <soap:Body>
            <${SERVICE_NAME} xmlns="http://tempuri.org/">
              <strProposal>${ is_1w_addendum ? (ProposalNo+"|") : ProposalNo}</strProposal>
            </${SERVICE_NAME}>
          </soap:Body>
        </soap:Envelope>`;
    //console.log(sr);
    self.showLoader('loader');
    xmlhttp.onreadystatechange = function () {

        if (xmlhttp.readyState == 4) {
            self.hideLoader('loader');
            //console.log(xmlhttp.readyState);
            if (xmlhttp.status == 200) {

                var temp2 = unescapeHTML(xmlhttp.responseText);
                console.log("res -" + temp2);

                if (window.DOMParser) {
                    parser = new DOMParser();
                    xmlDoc = parser.parseFromString(temp2, "text/xml");
                } else {
                    xmlDoc = new ActiveXObject("MIcrosoft.XMLDOM");
                    xmlDoc.async = false;
                    xmlDoc.loadXML(text);
                }

                var errorResponse = xmlDoc.getElementsByTagName("getProposalDet_smrtResult")[0].textContent;
                if (errorResponse == '2') {

                    document.getElementById('divMainContainer').style.display = 'none';
                    document.getElementById('divMainContainerError').style.display = 'block';
                    document.getElementById('divMainContainerError1').innerHTML = 'Annexure already uploaded for given proposal number.';

                } else {
                    var temp4 = temp2.substr(temp2.indexOf('<Data>'),
                        temp2.length - temp2.indexOf('<Data>') - (temp2.length - temp2.indexOf('</Data>')));

                    json = self.parseToJson(temp4);

                    var valError = json.Data;
                    if (valError) {

                        document.getElementById('divMainContainer').style.display = 'block';
                        document.getElementById('divMainContainerError').style.display = 'none';
                        document.getElementById('divMainContainerError1').innerHTML = '';

                        var jsonArr = json.Data.Table;

                        if (!Array.isArray(jsonArr)) {
                            var temp = jsonArr;
                            jsonArr = new Array();
                            jsonArr.push(temp);
                        }

                        //var listXMLEFTPending = new Array();
                        for (var i = 0; i < jsonArr.length; i++) {

                            QUOT_NUMBER = jsonArr[i].QUOT_NUMBER;
                            if (QUOT_NUMBER == undefined) {
                                QUOT_NUMBER = '';
                            }

                            CUST_NAME = jsonArr[i].CUST_NAME;
                            if (CUST_NAME == undefined) {
                                CUST_NAME = '';
                            }

                            document.getElementById('paraNameValidation').innerHTML = `I confirm: My Name is ${CUST_NAME}`;

                            CUST_MOBILE_NUMBER = jsonArr[i].CUST_MOBILE_NUMBER;
                            if (CUST_MOBILE_NUMBER == undefined) {
                                CUST_MOBILE_NUMBER = '';
                            }
                            document.getElementById('paraMobileValidation').innerHTML = `My mobile number is ${CUST_MOBILE_NUMBER}`;

                            SR_NAME = jsonArr[i].SR_NAME;
                            if (SR_NAME == undefined) {
                                SR_NAME = '';
                            }

                            SR_CODE = jsonArr[i].SR_CODE;
                            if (SR_CODE == undefined) {
                                SR_CODE = '';
                            }

                            PLAN_NAME = jsonArr[i].PLAN_NAME;
                            if (PLAN_NAME == undefined) {
                                PLAN_NAME = '';
                            }

                            if (PLAN_NAME === 'Arogya Shield') {
                                orgnisation_name = 'SBI Life Insurance company Ltd/SBI General Insurance';
                                orgnisation_name_a = 'SBI life/SBI GENERAL';
                                document.getElementById('imgSBIGeneral').style.display = 'block'
                            }

                            NBM_IS_REVISED_BI = jsonArr[i].NBM_IS_REVISED_BI;
                            if (NBM_IS_REVISED_BI == undefined) {
                                NBM_IS_REVISED_BI = '';
                            }

                            if (NBM_IS_REVISED_BI === 'Y' || NBM_IS_REVISED_BI === 'y') {
                                var para_consent1 = `Placed below is the link to down load your proposal form along with Benefit Illustration, Need Analysis, FATCA and other forms and consent for extra premium and Revised Benifit. You are requested to download these documents and validate them by going through the process steps as given below.`
                                document.getElementById('para_consent1').innerHTML = para_consent1;
                            }

                            local_Language = jsonArr[i].NBD_PREFERRED_LANGUAGE;
                            //local_Language = 'Hindi'
                            if (local_Language && local_Language != 'English') {
                                langData = getAadhaarConsentLanguage(local_Language, CUST_NAME, CUST_MOBILE_NUMBER, PLAN_NAME)
                                //consent3 = langData.desc2;
                            }
                            /*  else {
                                                            consent3 = ` I, <font color='blue'>${CUST_NAME}</font> hereby give my consent to ${orgnisation_name} to use my Mobile Number (<font color='blue'>${CUST_MOBILE_NUMBER}</font>) for sending One Time Password [OTP] for authentication purposes and I hereby agree and consent that the authentication through OTP verification will be considered as my signature on the Proposal Form and that there is no need for my physical signatures on these documents once OTP based authentication is done.${orgnisation_name} has informed me that this OTP would be used ${PLAN_NAME === 'Arogya Shield' ? `for processing my proposal for <font color='blue'>${PLAN_NAME}</font>. policy.` : `only for processing my SBI Life application form for <font color='blue'>SBI Life-${PLAN_NAME}</font>.`}`
                                                        } */
                            consent3 = ` I, <font color='blue'>${CUST_NAME}</font> hereby give my consent to ${orgnisation_name} to use my Mobile Number (<font color='blue'>${CUST_MOBILE_NUMBER}</font>) for sending One Time Password [OTP] for authentication purposes and I hereby agree and consent that the authentication through OTP verification will be considered as my signature on the Proposal Form and that there is no need for my physical signatures on these documents once OTP based authentication is done.${orgnisation_name} has informed me that this OTP would be used ${PLAN_NAME === 'Arogya Shield' ? `for processing my proposal for <font color='blue'>${PLAN_NAME}</font>. policy.` : `only for processing my SBI Life application form for <font color='blue'>SBI Life-${PLAN_NAME}</font>.`}`
                            document.getElementById('lebelConsent3').innerHTML = consent3;

                            LA_NAME = jsonArr[i].LA_NAME;
                            /* if (LA_NAME == undefined) {
                                LA_NAME = '';
                                //document.getElementById('txtLifeAssuredName').value = CUST_NAME;
                            } else {
                                document.getElementById('txtLifeAssuredName').value = LA_NAME;
                            } */

                            CUST_EMAIL = jsonArr[i].CUST_EMAIL;
                            if (!CUST_EMAIL) {
                                CUST_EMAIL = '';
                                document.getElementById('divEmailValidation').style.display = 'none';
                            } else {
                                document.getElementById('divEmailValidation').style.display = 'block';
                            }

                            document.getElementById('paraEmailValidation').innerHTML = `My email ID is ${CUST_EMAIL}`;

                            ADVISOR_EMAIL = jsonArr[i].ADVISOR_EMAIL;
                            if (ADVISOR_EMAIL == undefined) {
                                ADVISOR_EMAIL = '';
                            }

                            var consentVidEng = `Myself ${CUST_NAME}.<br>My mobile no is ${CUST_MOBILE_NUMBER}.<br>I confirm the details given in the proposal.`
                            document.getElementById('lebelVidConsentEng').innerHTML = consentVidEng;

                            /* var consentVidHindi = `मैं ${CUST_NAME}.<br>मेरा मोबाइल नंबर ${CUST_MOBILE_NUMBER} है.<br>मैं प्रस्ताव पत्र में दी गई जानकारीयों की पुष्टि करता/करती हूँ|`;
                            document.getElementById('lebelVidConsentHin').innerHTML = consentVidHindi; */

                            service_is_ekyc = jsonArr[i].IS_EKYC;
                            if (service_is_ekyc == undefined) {
                                service_is_ekyc = '';
                            }

                            is_aadhar_doc_selected = jsonArr[i].IS_AADHAARDOC_SELECTED;
                            if (!is_aadhar_doc_selected) {
                                is_aadhar_doc_selected = '';
                            }

                            IS_EKYC = jsonArr[i].IS_KYC;

                            SOURCE_BANK_NAME = jsonArr[i].SOURCE_BANK_NAME;

                            NBM_MODE_KYC = jsonArr[i].NBM_MODE_KYC;
                            NBMD_FATCA_C_KYC_NO = jsonArr[i].NBMD_FATCA_C_KYC_NO;

                            IS_CKYC_MOB_VERIFIED = jsonArr[i].IS_CKYC_MOB_VERIFIED;

                            if ((IS_EKYC === 'Y' || IS_EKYC === 'y') ||
                                SOURCE_BANK_NAME === 'YESBANK' ||
                                ((NBM_MODE_KYC === 'C' || NBM_MODE_KYC === 'c') &&
                                    (IS_CKYC_MOB_VERIFIED == 'Y' || IS_CKYC_MOB_VERIFIED == 'y') &&
                                    NBMD_FATCA_C_KYC_NO != undefined)) {
                                document.getElementById('divMainEkyc').style.display = 'none';
                                /* document.getElementById('divVideoTitle').style.display = 'block';
                                document.getElementById('divVideoButton').style.display = 'block';
                                document.getElementById('divVideoPlayer').style.display = 'block'; */
                            } else {
                                document.getElementById('divMainEkyc').style.display = 'block';

                                /* document.getElementById('divVideoTitle').style.display = 'none';
                                document.getElementById('divVideoButton').style.display = 'none'
                                document.getElementById('divVideoPlayer').style.display = 'none'; */
                            }

                            sendOTPFlag = jsonArr[i].OTPFLG;
                            if (sendOTPFlag === 'otp') {
                                document.getElementById('divEnterOTP').style.display = 'none';
                                document.getElementById('divSendOTP').style.display = 'block';
                            } else {
                                document.getElementById('divEnterOTP').style.display = 'block';
                                document.getElementById('divSendOTP').style.display = 'none';
                            }

                            //for whatsapp consent
                            IS_ESIGN = jsonArr[i].IS_ESIGN;
                            if (IS_ESIGN === 'N' || IS_ESIGN === 'n') {
                                document.getElementById('divWhatsAppConsent').style.display = 'block';
                            } else {
                                document.getElementById('divWhatsAppConsent').style.display = 'none';
                            }

                            //for combo quote number
                            NBM_COMBO_NUMBER = jsonArr[i].NBM_COMBO_NUMBER;
                            if (!NBM_COMBO_NUMBER) {
                                NBM_COMBO_NUMBER = 'N';
                            }

                            document.getElementById('para_term_codition').innerHTML = `I/We <font color='cornflowerblue'>${CUST_NAME}</font> confirm that I/We have submitted the above referred electronic
                                    proposal to buy ${PLAN_NAME === 'Arogya Shield'? '' : 'SBI Life'} <font color='cornflowerblue'>${PLAN_NAME}</font> (name of product) on my/our own accord.<br><br><p>I/We also confirm that <font color='cornflowerblue'>${SR_NAME}</font> (Name of Life Mitra/CIF) bearing code no. 
                                    <font color='cornflowerblue'>${SR_CODE}</font> has explained the product features, benefits with documentation/information to me/us in my own language. I/We have also
                                    read and reviewed the need analysis, custom benefit illustration including health questionnaire and understood/answered the
                                    same and I/We am/are satisfied with the product features.</p>`


                            if ((is_aadhar_doc_selected == 'Y' || is_aadhar_doc_selected == 'y') ||
                                (service_is_ekyc === 'Y' || service_is_ekyc == 'y')) {
                                document.getElementById('sepEkycDeclaration').style.display = 'block';
                                document.getElementById('divEkycTitle').style.display = 'block';
                                document.getElementById('checkEkycConsent').style.display = 'block';
                                document.getElementById('para_ekyc_consent').style.display = 'block';

                                if (local_Language && local_Language != 'English') {
                                    str_para_ekyc_consent = langData.desc1;
                                } else {
                                    str_para_ekyc_consent = `I, <font color='blue'>${CUST_NAME}</font>, hereby give my voluntary consent to ${orgnisation_name} and authorise the Company to obtain necessary details like Name, DOB, Address, Mobile Number, Email, Photograph through the copy of Aadhaar card / QR code available on my Aadhaar card / XML File shared using the offline verification processof UIDAI.<br>I understand and agree that this information will be exclusively used by ${orgnisation_name_a} only for the KYC purpose and for all service aspects related to my policy/ies, wherever KYC requirements have to be complied with, right from issue of policies after acceptance of risk under my proposals for life insurance, various payments that may have to be made under the policies, various contingencies where the KYC information is mandatory, till the contract is terminated.<br>I have duly been made aware that I can also use alternative KYC documents like Passport, Voter's ID Card, Drivinglicence, NREGA job card, letter from National Population Register, in lieu of Aadhaar for the purpose of completing myKYC formalities. I understand and agree that the details so obtained shall be stored with ${orgnisation_name_a} and be shared solely forthe purpose of issuing insurance policy to me and for servicing them. I will not hold ${orgnisation_name_a} or any of its authorized officials responsible in case of any incorrect information provided by me. I further authorize ${orgnisation_name_a} that it may use my mobile number for sending SMS alerts to me regarding various servicing and other matters related to my policy/ies.`;
                                }

                                document.getElementById('para_ekyc_consent').innerHTML = str_para_ekyc_consent;

                            } else {
                                /* if (service_is_ekyc === 'Y' || service_is_ekyc == 'y') {
                                    document.getElementById('sepEkycDeclaration').style.display = 'block';
                                    document.getElementById('divEkycTitle').style.display = 'block';
                                    document.getElementById('checkEkycConsent').style.display = 'block';
                                    document.getElementById('para_ekyc_consent').style.display = 'block';
                                    document.getElementById('para_ekyc_consent').innerHTML = `I, <font color='blue'>${CUST_NAME}</font>, hereby give my voluntary consent to ${orgnisation_name} and authorise the Company to obtain necessary details like Name, DOB, Address, Mobile Number, Email, Photograph through the copy of Aadhaar card / QR code available on my Aadhaar card / XML File shared using the offline verification processof UIDAI.<br>I understand and agree that this information will be exclusively used by ${orgnisation_name_a} only for the KYC purpose and for all service aspects related to my policy/ies, wherever KYC requirements have to be complied with, right from issue of policies after acceptance of risk under my proposals for life insurance, various payments that may have to be made under the policies, various contingencies where the KYC information is mandatory, till the contract is terminated.<br>I have duly been made aware that I can also use alternative KYC documents like Passport, Voter's ID Card, Drivinglicence, NREGA job card, letter from National Population Register, in lieu of Aadhaar for the purpose of completing myKYC formalities. I understand and agree that the details so obtained shall be stored with ${orgnisation_name_a} and be shared solely forthe purpose of issuing insurance policy to me and for servicing them. I will not hold ${orgnisation_name_a} or any of its authorized officials responsible in case of any incorrect information provided by me. I further authorize ${orgnisation_name_a} that it may use my mobile number for sending SMS alerts to me regarding various servicing and other matters related to my policy/ies.`;
                                } else { */
                                document.getElementById('sepEkycDeclaration').style.display = 'none';
                                document.getElementById('divEkycTitle').style.display = 'none';
                                document.getElementById('checkEkycConsent').style.display = 'none';
                                document.getElementById('para_ekyc_consent').style.display = 'none';
                                document.getElementById('para_ekyc_consent').innerHTML = ``;
                                //}
                            }

                            selectLangID = document.getElementById('selectLangID');
                            var arrLang = getSelectedLangauge(CUST_NAME, CUST_MOBILE_NUMBER, ProposalNo);

                            for (i = 0; i < arrLang.length; i++) {
                                selectLangID.add(new Option(arrLang[i].lang, '' + i));
                            }

                            //to check pdf
                            /* document.getElementById('divMainContainer').style.display = 'none';
                            document.getElementById('divViewPDF').style.display = 'block'; */

                        }
                    } else {
                        document.getElementById('divMainContainer').style.display = 'none';
                        document.getElementById('divMainContainerError').style.display = 'block';
                        document.getElementById('divMainContainerError1').innerHTML = 'No data found';
                    }
                }
            }
        }
    }
    //specify request headers
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    //send the SOAP request
    xmlhttp.send(sr);
}

function onChangeLanguage(value) {

    if (value === '0') {
        document.getElementById('pLangTitleDiv').style.display = 'none'
        document.getElementById('pLangLabelDiv').style.display = 'none'
        document.getElementById('lebelVidConsentHinDiv').style.display = 'none'
    } else {
        document.getElementById('pLangTitleDiv').style.display = 'block'
        document.getElementById('pLangLabelDiv').style.display = 'block'
        document.getElementById('lebelVidConsentHinDiv').style.display = 'block'

        var arraLang = getSelectedLangauge(CUST_NAME, CUST_MOBILE_NUMBER, ProposalNo);

        document.getElementById('pLangTitle').innerHTML = arraLang[value].title;
        document.getElementById('pLangLabel').innerHTML = arraLang[value].label;
        document.getElementById('lebelVidConsentHin').innerHTML = arraLang[value].desc;
    }
}

function onBrowse(input) {
    //var imageFileName = ProposalNo + "_ONEPAGER_01" + ".jpg";
    if (input.files && input.files[0]) {

        var reader = new FileReader();

        isOnePageImgUploaded = false;
        strDocType = IMG_ONEPAGER;

        reader.onload = function (e) {

            getFileExtension(input.files[0].name).then(function (fileExtension) {

                //console.log("fileextension:" + fileExtension);
                if (fileExtension == 'jpeg' || fileExtension == 'png' || fileExtension == 'jpg') {
                    compressionEvent(input.files[0]).then(data => {
                        mOnePagerIMG = data;

                        document.getElementById('imgbtn_aob_auth_basic_qualification_browseImage').src = '../Assets/images/browse_check.png'

                    });
                } else {
                    mOnePagerIMG = undefined;
                    alert("Please Select Image only")
                }
            });
        };
        reader.readAsDataURL(input.files[0]);

    }
}

function upload_docs(strDocType) {

    try {

        var fin = '',
            fileName = '';

        if (strDocType === IMG_ONEPAGER) {
            fin = mOnePagerIMG;
            if (is_1w_addendum && (ProposalNo.includes("1W") || ProposalNo.includes("1w"))) {
                fileName = ProposalNo + "_CUSTDECL_ADDENDUM_01.jpg";
            } else {
                fileName = ProposalNo + "_CUSTDECL_01.jpg";
            }
        } else if (strDocType === PDF_ONEPAGER) {
            fin = getByteCode(mOnePagerPDF);

            if (is_1w_addendum && (ProposalNo.includes("1W") || ProposalNo.includes("1w"))) {
                fileName = ProposalNo + ONE_PAGER_ADDENDUM + "01" + ".pdf";
            } else {
                if ((IS_ESIGN === 'N' || IS_ESIGN === 'n') && document.getElementById('rbWhatsAppY').checked) {
                    fileName = ProposalNo + "_ONEPAGER_01.pdf|";
                } else {
                    fileName = ProposalNo + "_ONEPAGER_01.pdf";
                }
            }

        } else if (strDocType == PDF_MOB_EMAIL_VALIDATION) {
            fin = getByteCode(mOnePgrMobEmailPDF);
            if (is_1w_addendum && (ProposalNo.includes("1W") || ProposalNo.includes("1w"))) {
                fileName = ProposalNo + ONE_PAGER_ADDENDUM + "02" + ".pdf";
            } else {
                fileName = ProposalNo + "_ONEPAGER_02.pdf";
            }

        } else if (strDocType === VID_ONEPAGER) {
            fin = mOnePagerVID;
            if (is_1w_addendum && (ProposalNo.includes("1W") || ProposalNo.includes("1w"))) {
                fileName = ProposalNo + ONE_PAGER_ADDENDUM + "02" + ".mp4";
            } else {
                fileName = ProposalNo + "_custvideo_01.mp4";
            }
        }

        console.log("fin:" + fin + " FileName:" + fileName);
        if (fin === undefined || fin === '') {
            alert("Please Browse/Capture Document");
        } else {
            uploadCallService(fin, fileName);
        }

    } catch (error) {
        console.log(error);
        alert(error);
    }
}

async function uploadCallService(byteArray, fileName) {

    if (fileName == "This file Format cannot be uploaded") {
        console.log(fileName.error)

    } else {

        try {

            self.showLoader('loader');
            var xmlhttp = new XMLHttpRequest();
            var SERVICE_NAME = 'UploadFile';
            xmlhttp.open('POST', serviceURL + '?op=' + SERVICE_NAME, true);

            var sr = `<?xml version="1.0" encoding="utf-8"?>
                <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
                <soap12:Body>
                <${SERVICE_NAME} xmlns="http://tempuri.org/">
                <f>${byteArray}</f>
                <fileName>${fileName}</fileName>
                <qNo>${QUOT_NUMBER}</qNo>
                <agentCode>${SR_CODE}</agentCode>
                <strEmailId>${commonEmail}</strEmailId>
                <strMobileNo>${commonMobile}</strMobileNo>
                <strAuthKey>${strAuth}</strAuthKey>
                </${SERVICE_NAME}>
                </soap12:Body>
                </soap12:Envelope>`;
            console.log(sr);

            xmlhttp.onreadystatechange = function () {

                try {

                    self.hideLoader('loader');

                    if (xmlhttp.readyState == 4) {
                        if (xmlhttp.status == 200) {

                            data = unescapeHTML(xmlhttp.responseText);
                            //console.log(data);

                            if (window.DOMParser) {
                                parser = new DOMParser();
                                xmlDoc = parser.parseFromString(data, "text/xml");
                            } else {
                                xmlDoc = new ActiveXObject("MIcrosoft.XMLDOM");
                                xmlDoc.async = false;
                                xmlDoc.loadXML(text);
                            }

                            var response = xmlDoc.getElementsByTagName("UploadFileResult")[0].textContent;

                            //console.log("Upload:" + response + " fileName:" + fileName);

                            if (response == "1") {

                                if (strDocType == IMG_ONEPAGER) {
                                    isOnePageImgUploaded = true;

                                    document.getElementById('imgbtn_aob_auth_basic_qualification_uploadIMg').src = '../Assets/images/upload_check.png';

                                    alert('Image upload successfully.')
                                } else if (strDocType == PDF_ONEPAGER) {

                                    /* if (mOnePagerVID) {
                                        strDocType = VID_ONEPAGER;
                                        upload_docs(VID_ONEPAGER);
                                    } */
                                    if (mOnePgrMobEmailPDF) {
                                        strDocType = PDF_MOB_EMAIL_VALIDATION;
                                        upload_docs(PDF_MOB_EMAIL_VALIDATION);
                                    } else {
                                        //send email to customer and agent if email is present
                                        alert('annexure pdf sync successfully..');
                                        strDocType = '';
                                        mOnePagerIMG = undefined;
                                        mOnePagerPDF = undefined;
                                        mOnePagerVID = undefined;
                                        isOnePageImgUploaded = false;

                                        if (PIVC_LINK === undefined || PIVC_LINK === '') {
                                            //refresh the entire document
                                            document.location.reload();
                                        } else {
                                            document.getElementById('myModal').style.display = 'block';
                                        }
                                    }
                                }
                                /*  else if (strDocType == VID_ONEPAGER) {
                                                                    //send email to customer and agent if email is present
                                                                    alert('annexure video sync successfully..');
                                                                    strDocType = '';
                                                                    mOnePagerIMG = undefined;
                                                                    mOnePagerPDF = undefined;
                                                                    mOnePagerVID = undefined;
                                                                    isOnePageImgUploaded = false;

                                                                    if (PIVC_LINK === undefined || PIVC_LINK === '') {
                                                                        //refresh the entire document
                                                                        document.location.reload();
                                                                    } else {
                                                                        document.getElementById('myModal').style.display = 'block';
                                                                    }
                                                                } */
                                else if (strDocType == PDF_MOB_EMAIL_VALIDATION) {
                                    //send email to customer and agent if email is present
                                    alert(`Mobile number ${CUST_MOBILE_NUMBER} and email id - ${CUST_EMAIL} has been verified by me with the proposer.`);
                                    strDocType = '';
                                    mOnePagerIMG = undefined;
                                    mOnePagerPDF = undefined;
                                    mOnePagerVID = undefined;
                                    mUserPhoto = undefined;
                                    mOnePgrMobEmailPDF = undefined;
                                    isOnePageImgUploaded = false;
                                    isNameValidated = false;
                                    isMobileValidated = false;
                                    isEmailValidated = false;

                                    if (PIVC_LINK === undefined || PIVC_LINK === '') {
                                        //refresh the entire document
                                        document.location.reload();
                                    } else {
                                        document.getElementById('myModal').style.display = 'block';
                                    }
                                }

                            } else {
                                if (strDocType == IMG_ONEPAGER) {
                                    alert("Upload Image failed! Please try again later...");
                                } else if (strDocType == PDF_ONEPAGER) {
                                    alert("Upload PDF failed! Please try again later...");
                                } else if (strDocType == PDF_MOB_EMAIL_VALIDATION) {
                                    alert("Upload Mobile and email validation pdf failed! Please try again later...");
                                } else if (strDocType == VID_ONEPAGER) {
                                    alert("Upload Video failed! Please try again later...");
                                }
                            }
                        }
                    }

                } catch (error) {
                    console.log(error);
                    alert(error);
                }
            }
            //specify request headers
            xmlhttp.setRequestHeader('Content-Type', 'text/xml');
            //send the SOAP request
            xmlhttp.send(sr);

        } catch (error) {
            console.log(error);
            alert(error);
        }
    }
}

function startRecording() {
    this.disabled = true;
    captureCamera(function (camera) {
        video.muted = true;
        video.volume = 0;
        video.srcObject = camera;

        recorder = RecordRTC(camera, {
            type: 'video',
            timeSlice: 1000
        });


        /* BY MANISH SINGH ---------- START */
        //stop recording on basis of time
        recorder.setRecordingDuration(20 * 1000, function () {
            console.log("Inside Record Duration")

            recorder.stopRecording(stopRecordingCallback); // stop recording here
        });

        //stop recording on basis of file size
        (function looper() {
            console.log("INSIDE LOOPER")
            if (!recorder) {
                return;
            }
            var internal = recorder.getInternalRecorder();
            if (internal && internal.getArrayOfBlobs) {
                var blob = new Blob(internal.getArrayOfBlobs(), {
                    type: 'video',
                });

                if (blob.size > 2.5 * 1024 * 1024) { // if blob is greater than 2.5 MB
                    recorder.stopRecording(stopRecordingCallback); // stop recording here
                    return;
                }

            }
            setTimeout(looper, 20000);
        })();

        /* BY MANISH SINGH --------- END */

        recorder.startRecording();

        // release camera on stopRecording
        recorder.camera = camera;


        document.getElementById('btnStopRecord').disabled = false;
    });
}

function stopRecording() {
    this.disabled = true;
    recorder.stopRecording(stopRecordingCallback);
}

function captureCamera(callback) {
    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
    }).then(function (camera) {
        callback(camera);
    }).catch(function (error) {
        alert('Unable to capture your camera. Please check console logs.');
        console.error(error);
    });
}


function stopRecordingCallback() {
    video.src = video.srcObject = null;
    video.muted = false;
    video.volume = 1;

    var blob = recorder.getBlob();
    console.log('stop record blob size - ' + blob.size);

    if (blob.size > 2.5 * 1024 * 1024) { // if blob is greater than 2.5 MB
        recorder.clearRecordedData();
        alert('Video size should be less than 2.5 MB.')
    } else {
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
            mOnePagerVID = reader.result;
            mOnePagerVID = mOnePagerVID.replace(/^data:.+;base64,/, '');
            //console.log(mOnePagerVID);
        }

        video.src = URL.createObjectURL(blob);
    }

    recorder.camera.stop();
    recorder.destroy();
    recorder = null;
}

function validateFields() {

    var error = '';
    var ischecktermConditionCheckd = document.getElementById('checktermCondition').checked;
    if (!ischecktermConditionCheckd) {
        error = 'Please read and check Term and Condition';
        return error;
    }

    if (service_is_ekyc === 'y') {
        var isEkycConsentCheckd = document.getElementById('checkEkycConsent').checked;
        if (!isEkycConsentCheckd) {
            error = 'Please read and check Ekyc declaration consent';
            return error;
        }
    }

    var ischeckLebelConsent3Checked = document.getElementById('checkLebelConsent3').checked;
    if (!ischeckLebelConsent3Checked) {
        error = 'Please read and check customer declaration consent';
        return error;
    }

    if ((IS_EKYC === 'Y' || IS_EKYC === 'y') ||
        SOURCE_BANK_NAME === 'YESBANK' ||
        ((NBM_MODE_KYC === 'C' || NBM_MODE_KYC === 'c') &&
            (IS_CKYC_MOB_VERIFIED == 'Y' || IS_CKYC_MOB_VERIFIED == 'y') &&
            NBMD_FATCA_C_KYC_NO != undefined)) {

        error = '';

    } else {
        /* if (IS_EKYC === 'N' || IS_EKYC === 'n') */
        if (!isNameValidated) {
            error = 'Proposal cannot be processed further in view of mismatch in Name. Please get in touch with your sales person.';
            return error;
        }

        if (!CUST_EMAIL && !mUserPhoto) {
            error = 'Proposal cannot be processed further in view of mismatch in Name. Please get in touch with your sales person.';
            return error;
        }

        if (!isMobileValidated || !mUserMobilePhoto) {
            error = 'Proposal cannot be processed further in view of mismatch in Mobile. Please get in touch with your sales person.';
            return error;
        }

        if (CUST_EMAIL && !mUserEmailPhoto) {
            error = 'Proposal cannot be processed further in view of mismatch in Email. Please get in touch with your sales person.';
            return error;
        }
    }

    /* if (window.getComputedStyle(document.getElementById("divMainEkyc")).display === 'block') {
        if (!isOnePageImgUploaded) {
            error = 'please upload Statement by the customer.'
            return error;
        }

        if (!mOnePagerVID) {
            error = 'please read Statement in front of the camera.'
            return error;
        }
    } */

    /* if (IS_EKYC === 'N' || IS_EKYC === 'n') {
        if (!isOnePageImgUploaded) {
            error = 'please upload Statement by the customer.'
            return error;
        }

        if (!mOnePagerVID) {
            error = 'please read Statement in front of the camera.'
            return error;
        }
    } */

    var otp = document.getElementById('txtProposalOTP').value;
    if (!otp) {
        error = 'Please enter your OTP';
        return error;
    }

    return error;
}

function onClickSubmit() {

    var error = validateFields();

    if (error === '') {

        validateAnnexureOTP().then(validateOTPTrue => {

            if ((IS_EKYC === 'Y' || IS_EKYC === 'y') ||
                SOURCE_BANK_NAME === 'YESBANK' ||
                ((NBM_MODE_KYC === 'C' || NBM_MODE_KYC === 'c') &&
                    (IS_CKYC_MOB_VERIFIED == 'Y' || IS_CKYC_MOB_VERIFIED == 'y') &&
                    NBMD_FATCA_C_KYC_NO != undefined)) {

                mOnePgrMobEmailPDF = undefined;

                createAnnexurePDF().then(pdfCreatedAndServedTrue => {
                    //pdfCreatedAndServed(pdfCreatedAndServedTrue);

                    mOnePagerPDF = pdfCreatedAndServedTrue;

                    strDocType = PDF_ONEPAGER;
                    upload_docs(PDF_ONEPAGER);

                }, pdfCreatedAndServedFalse => {
                    someErrorHappenedAndRejected(pdfCreatedAndServedFalse);
                    alert('Error while creating pdf');
                });

            } else {

                createMobEmailValidationPDF().then(pdfMobEmailTrue => {

                    mOnePgrMobEmailPDF = pdfMobEmailTrue;

                    createAnnexurePDF().then(pdfCreatedAndServedTrue => {
                        //pdfCreatedAndServed(pdfCreatedAndServedTrue);

                        mOnePagerPDF = pdfCreatedAndServedTrue;

                        strDocType = PDF_ONEPAGER;
                        upload_docs(PDF_ONEPAGER);

                    }, pdfCreatedAndServedFalse => {
                        someErrorHappenedAndRejected(pdfCreatedAndServedFalse);
                        alert('Error while creating pdf');
                    });

                }, pdfMobEmailFalse => {
                    someErrorHappenedAndRejected(pdfMobEmailFalse);
                    alert('Error while creating mobile and email validation pdf');
                });
            }
        }, validateOTPTrue => {
            alert('Invalid OTP')
        });

    } else {
        alert(error);
    }

}

function onClickSendOTP() {

    try {

        self.showLoader('loader');
        var xmlhttp = new XMLHttpRequest();
        var SERVICE_NAME = 'GenerateOTP_SBIL';
        xmlhttp.open('POST', serviceURL + '?op=' + SERVICE_NAME, true);

        var sr = `<?xml version="1.0" encoding="utf-8"?>
        <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
        <soap12:Body>
        <${SERVICE_NAME} xmlns="http://tempuri.org/">
        <ADHAR_NO></ADHAR_NO>
        <QUOT_NO>${QUOT_NUMBER}</QUOT_NO>
        <KYC_TYPE>OTP</KYC_TYPE> 
        <MOBILE_NO>${CUST_MOBILE_NUMBER}</MOBILE_NO>
        <strSource>Connect Life</strSource>
        <strProductName>${PLAN_NAME}</strProductName>
        </${SERVICE_NAME}>
        </soap12:Body>
        </soap12:Envelope>`;
        console.log(sr);

        xmlhttp.onreadystatechange = function () {

            self.hideLoader('loader');

            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {

                    data = unescapeHTML(xmlhttp.responseText);
                    //console.log(data);

                    if (window.DOMParser) {
                        parser = new DOMParser();
                        xmlDoc = parser.parseFromString(data, "text/xml");
                    } else {
                        xmlDoc = new ActiveXObject("MIcrosoft.XMLDOM");
                        xmlDoc.async = false;
                        xmlDoc.loadXML(text);
                    }

                    var response = xmlDoc.getElementsByTagName("GenerateOTP_SBILResult")[0].textContent;

                    //console.log("Upload:" + response + " fileName:" + fileName);

                    if (response == "1") {
                        document.getElementById('divEnterOTP').style.display = 'block';
                        alert('OTP Send Successfully');
                    } else {
                        document.getElementById('divEnterOTP').style.display = 'none';
                        alert('Please try again leter!');
                    }
                }
            }
        }
        //specify request headers
        xmlhttp.setRequestHeader('Content-Type', 'text/xml');
        //send the SOAP request
        xmlhttp.send(sr);
    } catch (error) {
        console.log(error);
        alert(error);
    }
}

let validateAnnexureOTP = () => {
    return new Promise((resolve, reject) => {
        try {

            self.showLoader('loader');
            var xmlhttp = new XMLHttpRequest();
            var SERVICE_NAME = 'ValidateOTP_SBIL';
            xmlhttp.open('POST', serviceURL + '?op=' + SERVICE_NAME, true);

            var comboQuote = '';
            if (NBM_COMBO_NUMBER == 'N' || NBM_COMBO_NUMBER == 'N') {
                comboQuote = QUOT_NUMBER;
            } else {

                if (IS_ESIGN == "N" || IS_ESIGN == "n") {
                    comboQuote = NBM_COMBO_NUMBER;
                } else {
                    comboQuote = QUOT_NUMBER;
                }
            }

            var sr = `<?xml version="1.0" encoding="utf-8"?>
        <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
        <soap12:Body>
        <${SERVICE_NAME} xmlns="http://tempuri.org/">
        <ADHAR_NO></ADHAR_NO>
        <QUOT_NO>${comboQuote}</QUOT_NO>
        <MOBILE_NO>${CUST_MOBILE_NUMBER}</MOBILE_NO>
        <OTP>${document.getElementById('txtProposalOTP').value}</OTP>
        <strSource>Connect Life</strSource>
        </${SERVICE_NAME}>
        </soap12:Body>
        </soap12:Envelope>`;
            console.log(sr);

            xmlhttp.onreadystatechange = function () {

                self.hideLoader('loader');

                if (xmlhttp.readyState == 4) {
                    if (xmlhttp.status == 200) {

                        data = unescapeHTML(xmlhttp.responseText);
                        //console.log(data);

                        if (window.DOMParser) {
                            parser = new DOMParser();
                            xmlDoc = parser.parseFromString(data, "text/xml");
                        } else {
                            xmlDoc = new ActiveXObject("MIcrosoft.XMLDOM");
                            xmlDoc.async = false;
                            xmlDoc.loadXML(text);
                        }

                        var response = xmlDoc.getElementsByTagName("ValidateOTP_SBILResult")[0].textContent;

                        //console.log("Upload:" + response + " fileName:" + fileName);

                        if (response == "1") {
                            resolve('1');
                        } else {
                            reject('0');
                        }
                    }
                }
            }
            //specify request headers
            xmlhttp.setRequestHeader('Content-Type', 'text/xml');
            //send the SOAP request
            xmlhttp.send(sr);
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

let createMobEmailValidationPDF = () => {

    self.showLoader('loader');

    return new Promise((resolve, reject) => {
        try {

            var options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            let doc = {
                pageSize: 'A4',

                pageOrientation: 'potrait',

                pageMargins: [10, 30, 10, 30],

                content: [
                    get2TLogopdfData(),
                    {
                        canvas: [{
                            type: 'line',
                            x1: 0,
                            y1: 5,
                            x2: 575,
                            y2: 5,
                            lineWidth: 1,
                            lineCap: 'round'
                        }]
                    },
                    {
                        margin: [0, 15, 0, 0],
                        text: [{
                            text: 'Mobile Number and email validation',
                            style: 'titleFont',
                            alignment: 'center'
                        }, ]
                    }, {
                        margin: [0, 15, 0, 0],
                        text: [{
                            text: `Dear Sir/Madam,\nWe request you to see the following details carefully and validate your mobile number and email id. This is an important process which will ensure you receive all communications effectively.`,
                            style: 'smallFontSize',
                            alignment: 'justify'
                        }, ],
                    },
                    getUserPdfData(mUserPhoto, `I confirm: My Name is ${CUST_NAME}`, getYesNO(isNameValidated)),
                    /* {
                        margin: [0, 15, 0, 0],
                        style: 'tableExample',
                        table: {
                            widths: ['*', 'auto'],
                            body: [
                                [`I confirm: My Name is ${CUST_NAME}`, `${getYesNO(isNameValidated)}`],
                            ]
                        }
                    },
                    {
                        margin: [0, 15, 0, 0],
                        //image: `data:image/png;base64,` + mUserPhoto,
                        //image: `${canvasUser.toDataURL("image/png")}`,
                        image: `${mUserPhoto}`,
                        fit: [150, 150],
                        alignment: 'center'
                    }, */
                    getUserPdfData(mUserMobilePhoto, `My mobile number is ${CUST_MOBILE_NUMBER}`, getYesNO(isMobileValidated)),
                    /* {
                        margin: [0, 15, 0, 0],
                        style: 'tableExample',
                        table: {
                            widths: ['*', 'auto'],
                            body: [
                                [`My mobile number is ${CUST_MOBILE_NUMBER}`, `${getYesNO(isMobileValidated)}`],
                            ]
                        }
                    },
                    {
                        margin: [0, 15, 0, 0],
                        //image: `data:image/png;base64,` + mUserMobilePhoto,
                        //image: `${canvasMobile.toDataURL("image/png")}`,
                        image: `${mUserMobilePhoto}`,
                        fit: [150, 150],
                        alignment: 'center'
                    }, */
                    getUserPdfData(mUserEmailPhoto, `My email id is ${CUST_EMAIL}`, getYesNO(isEmailValidated)),
                    /* {
                        margin: [0, 15, 0, 0],
                        style: 'tableExample',
                        table: {
                            widths: ['*', 'auto'],
                            body: [
                                [`My email id is ${CUST_EMAIL}`, `${getYesNO(isEmailValidated)}`],
                            ]
                        }
                    },{
                        margin: [0, 15, 0, 0],
                        //image: `data:image/png;base64,` + mUserEmailPhoto,
                        //image: `${canvasEmail.toDataURL("image/png")}`,
                        image: `${mUserEmailPhoto}`,
                        fit: [150, 150],
                        alignment: 'center'
                    }, */
                ],
                images: {
                    sbiLogo: 'data:image/jpeg;base64,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',
                    sbiGeneralLogo: 'data:image/jpeg;base64,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BCYAAAAAAA4AAAAAAAAAAAAAP4AAADhCSU0EDQAAAAAABAAAAHg4QklNBBkAAAAAAAQAAAAeOEJJTQPzAAAAAAAJAAAAAAAAAAABADhCSU0ECgAAAAAAAQAAOEJJTScQAAAAAAAKAAEAAAAAAAAAAjhCSU0D9QAAAAAASAAvZmYAAQBsZmYABgAAAAAAAQAvZmYAAQChmZoABgAAAAAAAQAyAAAAAQBaAAAABgAAAAAAAQA1AAAAAQAtAAAABgAAAAAAAThCSU0D+AAAAAAAcAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAA4QklNBAAAAAAAAAIAAThCSU0EAgAAAAAABAAAAAA4QklNBDAAAAAAAAIBAThCSU0ELQAAAAAABgABAAAABzhCSU0ECAAAAAAAEAAAAAEAAAJAAAACQAAAAAA4QklNBB4AAAAAAAQAAAAAOEJJTQQaAAAAAANJAAAABgAAAAAAAAAAAAAB1gAAA2YAAAAKAFUAbgB0AGkAdABsAGUAZAAtADEAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAA2YAAAHWAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAEAAAAAAABudWxsAAAAAgAAAAZib3VuZHNPYmpjAAAAAQAAAAAAAFJjdDEAAAAEAAAAAFRvcCBsb25nAAAAAAAAAABMZWZ0bG9uZwAAAAAAAAAAQnRvbWxvbmcAAAHWAAAAAFJnaHRsb25nAAADZgAAAAZzbGljZXNWbExzAAAAAU9iamMAAAABAAAAAAAFc2xpY2UAAAASAAAAB3NsaWNlSURsb25nAAAAAAAAAAdncm91cElEbG9uZwAAAAAAAAAGb3JpZ2luZW51bQAAAAxFU2xpY2VPcmlnaW4AAAANYXV0b0dlbmVyYXRlZAAAAABUeXBlZW51bQAAAApFU2xpY2VUeXBlAAAAAEltZyAAAAAGYm91bmRzT2JqYwAAAAEAAAAAAABSY3QxAAAABAAAAABUb3AgbG9uZwAAAAAAAAAATGVmdGxvbmcAAAAAAAAA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aABvAHQAbwBzAGgAbwBwAAAAEwBBAGQAbwBiAGUAIABQAGgAbwB0AG8AcwBoAG8AcAAgAEMAUwAzAAAAAQA4QklNBAYAAAAAAAf//QAAAAEBAP/hD85odHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDQuMS1jMDM2IDQ2LjI3NjcyMCwgTW9uIEZlYiAxOSAyMDA3IDIyOjQwOjA4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eGFwTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgZGM6Zm9ybWF0PSJpbWFnZS9qcGVnIiB4YXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzMgV2luZG93cyIgeGFwOkNyZWF0ZURhdGU9IjIwMjAtMDctMDFUMTg6NTE6MzYrMDU6MzAiIHhhcDpNb2RpZnlEYXRlPSIyMDIwLTA3LTAxVDE4OjUxOjM2KzA1OjMwIiB4YXA6TWV0YWRhdGFEYXRlPSIyMDIwLTA3LTAxVDE4OjUxOjM2KzA1OjMwIiB4YXBNTTpEb2N1bWVudElEPSJ1dWlkOkI0MkFDREI0OURCQkVBMTE4MjAyODc3MEJFMUI1QzEyIiB4YXBNTTpJbnN0YW5jZUlEPSJ1dWlkOkI1MkFDREI0OURCQkVBMTE4MjAyODc3MEJFMUI1QzEyIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHBob3Rvc2hvcDpIaXN0b3J5PSIiIHRpZmY6T3JpZW50YXRpb249IjEiIHRpZmY6WFJlc29sdXRpb249IjcyMDAwMC8xMDAwMCIgdGlmZjpZUmVzb2x1dGlvbj0iNzIwMDAwLzEwMDAwIiB0aWZmOlJlc29sdXRpb25Vbml0PSIyIiB0aWZmOk5hdGl2ZURpZ2VzdD0iMjU2LDI1NywyNTgsMjU5LDI2MiwyNzQsMjc3LDI4NCw1MzAsNTMxLDI4MiwyODMsMjk2LDMwMSwzMTgsMzE5LDUyOSw1MzIsMzA2LDI3MCwyNzEsMjcyLDMwNSwzMTUsMzM0MzI7Q0FFRUY3RjEzNkQzMDRCOEMwNzUxNEU1MTFGMEZENjEiIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSI4NzAiIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSI0NzAiIGV4aWY6Q29sb3JTcGFjZT0iMSIgZXhpZjpOYXRpdmVEaWdlc3Q9IjM2ODY0LDQwOTYwLDQwOTYxLDM3MTIxLDM3MTIyLDQwOTYyLDQwOTYzLDM3NTEwLDQwOTY0LDM2ODY3LDM2ODY4LDMzNDM0LDMzNDM3LDM0ODUwLDM0ODUyLDM0ODU1LDM0ODU2LDM3Mzc3LDM3Mzc4LDM3Mzc5LDM3MzgwLDM3MzgxLDM3MzgyLDM3MzgzLDM3Mzg0LDM3Mzg1LDM3Mzg2LDM3Mzk2LDQxNDgzLDQxNDg0LDQxNDg2LDQxNDg3LDQxNDg4LDQxNDkyLDQxNDkzLDQxNDk1LDQxNzI4LDQxNzI5LDQxNzMwLDQxOTg1LDQxOTg2LDQxOTg3LDQxOTg4LDQxOTg5LDQxOTkwLDQxOTkxLDQxOTkyLDQxOTkzLDQxOTk0LDQxOTk1LDQxOTk2LDQyMDE2LDAsMiw0LDUsNiw3LDgsOSwxMCwxMSwxMiwxMywxNCwxNSwxNiwxNywxOCwyMCwyMiwyMywyNCwyNSwyNiwyNywyOCwzMDtBNzgyRTFBRTI0NDEyQ0ZCM0E2NEQ1NTBFNzIyOUI3NSI+IDx4YXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ1dWlkOjI2Njc4MEMzNzRCQkVBMTE4MjAyODc3MEJFMUI1QzEyIiBzdFJlZjpkb2N1bWVudElEPSJ1dWlkOjI2Njc4MEMzNzRCQkVBMTE4MjAyODc3MEJFMUI1QzEyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9InciPz7/4gxYSUNDX1BST0ZJTEUAAQEAAAxITGlubwIQAABtbnRyUkdCIFhZWiAHzgACAAkABgAxAABhY3NwTVNGVAAAAABJRUMgc1JHQgAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLUhQICAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABFjcHJ0AAABUAAAADNkZXNjAAABhAAAAGx3dHB0AAAB8AAAABRia3B0AAACBAAAABRyWFlaAAACGAAAABRnWFlaAAACLAAAABRiWFlaAAACQAAAABRkbW5kAAACVAAAAHBkbWRkAAACxAAAAIh2dWVkAAADTAAAAIZ2aWV3AAAD1AAAACRsdW1pAAAD+AAAABRtZWFzAAAEDAAAACR0ZWNoAAAEMAAAAAxyVFJDAAAEPAAACAxnVFJDAAAEPAAACAxiVFJDAAAEPAAACAx0ZXh0AAAAAENvcHlyaWdo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UBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQP/9H6ZVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVA//0vplVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUD//T+mVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQP/9T6ZX8zVA/TFfzNUD9MV/M1QP0xX8zVA/TFfzNUD9MV/M1QP0xX8zVA/TFfzNUD9MV/M1QP0xX8zVA/TFfzNUD9MV/M1QP0xX8zVA/TFfzNUD9MV/M1QP0xX8zVA/TFfzNUD9MV/M1QP0xX8zVA/TFfzNUD9MV/M1QP0xX8zVA/TFfzNUD9MV/M1QP0xX8zVA/TFfzNUD9MV/M1QP0xX8zVA/TFfzNUD9MV/M1QP0xX8zVA/TFfzNUD9MV/M1QP0xX8zVA/TFfzNUD9MV/M1QP0xX8zVA/TFfzNUD9MV/M1QP0xX8zVA/TFfzNUD9MV/M1QP0xX8zVA/TFfzNUD9MV/M1QP0xX8zVA/TFfzNUD9MV/M1QP0xX8zVA/TFfzNUD9MV/M1QP0xX8zVA/TFfzNUD9MV/M1QP0xX8zVA/9k='
                },
                styles: {
                    smallFontSize: {
                        fontSize: 10
                    },
                    titleFont: {
                        fontSize: 14,
                        margin: [0, 5, 0, 15]
                    },
                    titleSecondFont: {
                        fontSize: 12,
                        margin: [0, 5, 0, 15]
                    },
                    smallestFontSize: {
                        fontSize: 6
                    },
                    fontSizeEight: {
                        fontSize: 8
                    },
                    fontSizeNine: {
                        fontSize: 9
                    },
                    boldFontTen: {
                        fontSize: 10,
                        bold: true,
                    }
                }
            };

            var pdfDocument = pdfMake.createPdf(doc);

            pdfDocument.getDataUrl(function (dataUrl) {
                resolve(dataUrl);
            });

            //for view pdf
            /* saveBase64PDF(doc).then((base64pdf) => {

                document.getElementById('framePDF').src = `data:application/pdf;base64, ${encodeURI(base64pdf)}`;

                resolve(dataUrl);
            }); */


        } catch (error) {
            console.log(error)
        } finally {
            self.hideLoader('loader');
        }

    });
}

function getYesNO(boolValue) {
    if (boolValue)
        return 'Yes';
    else
        return 'No';
}

let createAnnexurePDF = () => {

    self.showLoader('loader');

    return new Promise((resolve, reject) => {
        try {

            var options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            let doc = {
                pageSize: 'A4',

                pageOrientation: 'potrait',

                pageMargins: [10, 30, 10, 30],

                content: [
                    get2TLogopdfData(),
                    {
                        canvas: [{
                            type: 'line',
                            x1: 0,
                            y1: 5,
                            x2: 575,
                            y2: 5,
                            lineWidth: 1,
                            lineCap: 'round'
                        }]
                    },
                    {
                        margin: [0, 15, 0, 0],
                        text: [{
                            text: 'Annexure to Electronic Proposal Number ' + ProposalNo,
                            style: 'titleFont',
                            alignment: 'center'
                        }, ]
                    }, {
                        margin: [0, 15, 0, 0],
                        text: [{
                            text: `Dear Customer,\nPlaced below is the link to down load your proposal form along with Benefit Illustration, Need Analysis, FATCA and other forms. You are requested to download these documents and validate them by going through the process steps as given below.`,
                            style: 'smallFontSize',
                            alignment: 'justify'
                        }, ],
                    },
                    {
                        margin: [0, 15, 0, 0],
                        text: [{
                            text: `Customer Declaration\n`,
                            style: 'titleFont',
                            alignment: 'justify'
                        }, {
                            text: `\nI/We ${CUST_NAME} confirm that I/We have submitted the above referred electronic proposal to buy ${PLAN_NAME === 'Arogya Shield'? '' : 'SBI Life'} ${PLAN_NAME} (name of product) on my/our own accord.\n\nI/We also confirm that ${SR_NAME} (Name of Life Mitra/CIF) bearing code no. ${SR_CODE} has explained the product features, benefits with documentation/information to me/us in my own language. I/We have also read and reviewed the need analysis, custom benefit illustration including health questionnaire and understood/answered the same and I/We am/are satisfied with the product features.`,
                            style: 'smallFontSize',
                            alignment: 'justify',
                        }],
                    },
                    {
                        canvas: [{
                            type: 'line',
                            x1: 0,
                            y1: 5,
                            x2: 575,
                            y2: 5,
                            lineWidth: 1,
                            lineCap: 'round'
                        }]
                    },
                    getAadharConsent(),
                    {
                        margin: [0, 15, 0, 0],
                        text: [{
                            //text: `I, ${CUST_NAME} hereby give my consent to ${orgnisation_name} to use my Mobile Number (${CUST_MOBILE_NUMBER}) for sending One Time Password [OTP] for authentication purposes and I hereby agree and consent that the authentication through OTP verification will be considered as my signature on the Proposal Form and that there is no need for my physical signatures on these documents once OTP based authentication is done.${orgnisation_name} has informed me that this OTP would be used ${PLAN_NAME === 'Arogya Shield'? `for processing my proposal for ${PLAN_NAME} policy.` : `only for processing my SBI Life application form for SBI Life-${PLAN_NAME}.`}`,
                            text: `${consent3}`,
                            style: 'smallFontSize',
                            alignment: 'justify',
                        }],
                    },
                    {
                        canvas: [{
                            type: 'line',
                            x1: 0,
                            y1: 5,
                            x2: 575,
                            y2: 5,
                            lineWidth: 1,
                            lineCap: 'round'
                        }]
                    },
                    getWhatsAppConsent(),
                    {
                        style: 'smallFontSize',
                        margin: [0, 15, 0, 0],
                        table: {
                            widths: ['*', '*', '*'],
                            body: [
                                [{
                                        layout: 'noBorders',
                                        table: {
                                            widths: ['*', '*', '*'],
                                            body: [
                                                [{
                                                    text: `   `,
                                                    bold: true,
                                                    alignment: 'left',
                                                }, {}, {}],
                                                [{
                                                    text: `Authorised via OTP - ${document.getElementById('txtProposalOTP').value}, shared for proposal number ${ProposalNo} on ${dateDDFullMonthYYYY(currentDate.toISOString().substr(0, 10))}`,
                                                    alignment: 'center',
                                                    colSpan: 3,

                                                }, {}, {}],
                                                [{
                                                    text: `Signature of Proposer`,
                                                    bold: true,
                                                    alignment: 'center',
                                                    colSpan: 3,
                                                }, {

                                                }, {

                                                }]
                                            ]
                                        }
                                    }, {
                                        border: [false, false, false, false],
                                        table: {
                                            widths: ['*', '*', '*'],
                                            body: [
                                                [{
                                                    text: ``,
                                                    border: [false, false, false, false],
                                                    colSpan: 3,
                                                }, {

                                                }, {

                                                }],
                                                [{
                                                    text: ``,
                                                    border: [false, false, false, false],
                                                    colSpan: 3,
                                                }, {}, {}],
                                                [{
                                                    text: ``,
                                                    colSpan: 3,
                                                    border: [false, false, false, false],
                                                }, {

                                                }, {

                                                }]
                                            ]
                                        }
                                    },
                                    {
                                        layout: 'noBorders',
                                        table: {
                                            widths: ['*', '*', '*'],
                                            body: [
                                                [{
                                                    text: `   `,
                                                    bold: true,
                                                    alignment: 'center',
                                                }, {}, {}],
                                                [{
                                                    text: `${dateDDFullMonthYYYY(currentDate.toISOString().substr(0, 10))}`,
                                                    alignment: 'center',
                                                    colSpan: 3,

                                                }, {}, {}],
                                                [{
                                                    text: `Date`,
                                                    bold: true,
                                                    alignment: 'center',
                                                    colSpan: 3,
                                                }, {}, {}],
                                            ]
                                        }
                                    },
                                ]
                            ]
                        }
                    },
                ],
                images: {
                    sbiLogo: 'data:image/jpeg;base64,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',
                    sbiGeneralLogo: 'data:image/jpeg;base64,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BCYAAAAAAA4AAAAAAAAAAAAAP4AAADhCSU0EDQAAAAAABAAAAHg4QklNBBkAAAAAAAQAAAAeOEJJTQPzAAAAAAAJAAAAAAAAAAABADhCSU0ECgAAAAAAAQAAOEJJTScQAAAAAAAKAAEAAAAAAAAAAjhCSU0D9QAAAAAASAAvZmYAAQBsZmYABgAAAAAAAQAvZmYAAQChmZoABgAAAAAAAQAyAAAAAQBaAAAABgAAAAAAAQA1AAAAAQAtAAAABgAAAAAAAThCSU0D+AAAAAAAcAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAA4QklNBAAAAAAAAAIAAThCSU0EAgAAAAAABAAAAAA4QklNBDAAAAAAAAIBAThCSU0ELQAAAAAABgABAAAABzhCSU0ECAAAAAAAEAAAAAEAAAJAAAACQAAAAAA4QklNBB4AAAAAAAQAAAAAOEJJTQQaAAAAAANJAAAABgAAAAAAAAAAAAAB1gAAA2YAAAAKAFUAbgB0AGkAdABsAGUAZAAtADEAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAA2YAAAHWAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAEAAAAAAABudWxsAAAAAgAAAAZib3VuZHNPYmpjAAAAAQAAAAAAAFJjdDEAAAAEAAAAAFRvcCBsb25nAAAAAAAAAABMZWZ0bG9uZwAAAAAAAAAAQnRvbWxvbmcAAAHWAAAAAFJnaHRsb25nAAADZgAAAAZzbGljZXNWbExzAAAAAU9iamMAAAABAAAAAAAFc2xpY2UAAAASAAAAB3NsaWNlSURsb25nAAAAAAAAAAdncm91cElEbG9uZwAAAAAAAAAGb3JpZ2luZW51bQAAAAxFU2xpY2VPcmlnaW4AAAANYXV0b0dlbmVyYXRlZAAAAABUeXBlZW51bQAAAApFU2xpY2VUeXBlAAAAAEltZyAAAAAGYm91bmRzT2JqYwAAAAEAAAAAAABSY3QxAAAABAAAAABUb3AgbG9uZwAAAAAAAAAATGVmdGxvbmcAAAAAAAAA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aABvAHQAbwBzAGgAbwBwAAAAEwBBAGQAbwBiAGUAIABQAGgAbwB0AG8AcwBoAG8AcAAgAEMAUwAzAAAAAQA4QklNBAYAAAAAAAf//QAAAAEBAP/hD85odHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDQuMS1jMDM2IDQ2LjI3NjcyMCwgTW9uIEZlYiAxOSAyMDA3IDIyOjQwOjA4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eGFwTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgZGM6Zm9ybWF0PSJpbWFnZS9qcGVnIiB4YXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzMgV2luZG93cyIgeGFwOkNyZWF0ZURhdGU9IjIwMjAtMDctMDFUMTg6NTE6MzYrMDU6MzAiIHhhcDpNb2RpZnlEYXRlPSIyMDIwLTA3LTAxVDE4OjUxOjM2KzA1OjMwIiB4YXA6TWV0YWRhdGFEYXRlPSIyMDIwLTA3LTAxVDE4OjUxOjM2KzA1OjMwIiB4YXBNTTpEb2N1bWVudElEPSJ1dWlkOkI0MkFDREI0OURCQkVBMTE4MjAyODc3MEJFMUI1QzEyIiB4YXBNTTpJbnN0YW5jZUlEPSJ1dWlkOkI1MkFDREI0OURCQkVBMTE4MjAyODc3MEJFMUI1QzEyIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHBob3Rvc2hvcDpIaXN0b3J5PSIiIHRpZmY6T3JpZW50YXRpb249IjEiIHRpZmY6WFJlc29sdXRpb249IjcyMDAwMC8xMDAwMCIgdGlmZjpZUmVzb2x1dGlvbj0iNzIwMDAwLzEwMDAwIiB0aWZmOlJlc29sdXRpb25Vbml0PSIyIiB0aWZmOk5hdGl2ZURpZ2VzdD0iMjU2LDI1NywyNTgsMjU5LDI2MiwyNzQsMjc3LDI4NCw1MzAsNTMxLDI4MiwyODMsMjk2LDMwMSwzMTgsMzE5LDUyOSw1MzIsMzA2LDI3MCwyNzEsMjcyLDMwNSwzMTUsMzM0MzI7Q0FFRUY3RjEzNkQzMDRCOEMwNzUxNEU1MTFGMEZENjEiIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSI4NzAiIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSI0NzAiIGV4aWY6Q29sb3JTcGFjZT0iMSIgZXhpZjpOYXRpdmVEaWdlc3Q9IjM2ODY0LDQwOTYwLDQwOTYxLDM3MTIxLDM3MTIyLDQwOTYyLDQwOTYzLDM3NTEwLDQwOTY0LDM2ODY3LDM2ODY4LDMzNDM0LDMzNDM3LDM0ODUwLDM0ODUyLDM0ODU1LDM0ODU2LDM3Mzc3LDM3Mzc4LDM3Mzc5LDM3MzgwLDM3MzgxLDM3MzgyLDM3MzgzLDM3Mzg0LDM3Mzg1LDM3Mzg2LDM3Mzk2LDQxNDgzLDQxNDg0LDQxNDg2LDQxNDg3LDQxNDg4LDQxNDkyLDQxNDkzLDQxNDk1LDQxNzI4LDQxNzI5LDQxNzMwLDQxOTg1LDQxOTg2LDQxOTg3LDQxOTg4LDQxOTg5LDQxOTkwLDQxOTkxLDQxOTkyLDQxOTkzLDQxOTk0LDQxOTk1LDQxOTk2LDQyMDE2LDAsMiw0LDUsNiw3LDgsOSwxMCwxMSwxMiwxMywxNCwxNSwxNiwxNywxOCwyMCwyMiwyMywyNCwyNSwyNiwyNywyOCwzMDtBNzgyRTFBRTI0NDEyQ0ZCM0E2NEQ1NTBFNzIyOUI3NSI+IDx4YXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ1dWlkOjI2Njc4MEMzNzRCQkVBMTE4MjAyODc3MEJFMUI1QzEyIiBzdFJlZjpkb2N1bWVudElEPSJ1dWlkOjI2Njc4MEMzNzRCQkVBMTE4MjAyODc3MEJFMUI1QzEyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9InciPz7/4gxYSUNDX1BST0ZJTEUAAQEAAAxITGlubwIQAABtbnRyUkdCIFhZWiAHzgACAAkABgAxAABhY3NwTVNGVAAAAABJRUMgc1JHQgAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLUhQICAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABFjcHJ0AAABUAAAADNkZXNjAAABhAAAAGx3dHB0AAAB8AAAABRia3B0AAACBAAAABRyWFlaAAACGAAAABRnWFlaAAACLAAAABRiWFlaAAACQAAAABRkbW5kAAACVAAAAHBkbWRkAAACxAAAAIh2dWVkAAADTAAAAIZ2aWV3AAAD1AAAACRsdW1pAAAD+AAAABRtZWFzAAAEDAAAACR0ZWNoAAAEMAAAAAxyVFJDAAAEPAAACAxnVFJDAAAEPAAACAxiVFJDAAAEPAAACAx0ZXh0AAAAAENvcHlyaWdo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UBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQP/9H6ZVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVA//0vplVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUD//T+mVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQFVVAVVUBVVQP/9T6ZX8zVA/TFfzNUD9MV/M1QP0xX8zVA/TFfzNUD9MV/M1QP0xX8zVA/TFfzNUD9MV/M1QP0xX8zVA/TFfzNUD9MV/M1QP0xX8zVA/TFfzNUD9MV/M1QP0xX8zVA/TFfzNUD9MV/M1QP0xX8zVA/TFfzNUD9MV/M1QP0xX8zVA/TFfzNUD9MV/M1QP0xX8zVA/TFfzNUD9MV/M1QP0xX8zVA/TFfzNUD9MV/M1QP0xX8zVA/TFfzNUD9MV/M1QP0xX8zVA/TFfzNUD9MV/M1QP0xX8zVA/TFfzNUD9MV/M1QP0xX8zVA/TFfzNUD9MV/M1QP0xX8zVA/TFfzNUD9MV/M1QP0xX8zVA/TFfzNUD9MV/M1QP0xX8zVA/TFfzNUD9MV/M1QP0xX8zVA/TFfzNUD9MV/M1QP0xX8zVA/9k='
                },
                styles: {
                    smallFontSize: {
                        fontSize: 10
                    },
                    titleFont: {
                        fontSize: 14,
                        margin: [0, 5, 0, 15]
                    },
                    titleSecondFont: {
                        fontSize: 12,
                        margin: [0, 5, 0, 15]
                    },
                    smallestFontSize: {
                        fontSize: 6
                    },
                    fontSizeEight: {
                        fontSize: 8
                    },
                    fontSizeNine: {
                        fontSize: 9
                    },
                    boldFontTen: {
                        fontSize: 10,
                        bold: true,
                    }
                }
            };

            var pdfDocument = pdfMake.createPdf(doc);

            pdfDocument.getDataUrl(function (dataUrl) {
                resolve(dataUrl);
            });

            //for view pdf
            /* saveBase64PDF(doc).then((base64pdf) => {

                document.getElementById('framePDF').src = `data:application/pdf;base64, ${encodeURI(base64pdf)}`;
            }); */
        } catch (error) {
            console.log(error)
        } finally {
            self.hideLoader('loader');
        }

    });
}

function getWhatsAppConsent() {

    let isWhatsAppConsent = [];

    if (IS_ESIGN == 'N' || IS_ESIGN == 'n') {

        var whatsAppConsentVal = document.getElementById('rbWhatsAppY').checked === true ? 'Yes' : 'No';

        isWhatsAppConsent.push({
            margin: [0, 15, 0, 0],
            text: [{
                text: `Do You want to receive all communication through Whatsapp? ${whatsAppConsentVal}`,
                style: 'titleFont',
                alignment: 'justify',
            }, ],
        }, {
            canvas: [{
                type: 'line',
                x1: 0,
                y1: 5,
                x2: 575,
                y2: 5,
                lineWidth: 1,
                lineCap: 'round'
            }]
        }, );
    }

    return isWhatsAppConsent;

}

function getAadharConsent() {
    let isAadhaarConsent = [];

    if (is_aadhar_doc_selected == 'Y' || is_aadhar_doc_selected == 'y') {
        isAadhaarConsent.push({
            margin: [0, 15, 0, 0],
            text: [{
                text: `Aadhaar Consent\n`,
                style: 'titleFont',
                alignment: 'justify'
            }, {
                //text: `\nI, ${CUST_NAME}, hereby give my voluntary consent to ${orgnisation_name} and authorise the Company to obtain necessary details like Name, DOB, Address, Mobile Number, Email, Photograph through the copy of Aadhaar card / QR code available on my Aadhaar card / XML File shared using the offline verification processof UIDAI.I understand and agree that this information will be exclusively used by ${orgnisation_name_a} only for the KYC purpose and for all service aspects related to my policy/ies, wherever KYC requirements have to be complied with, right from issue of policies after acceptance of risk under my proposals for life insurance, various payments that may have to be made under the policies, various contingencies where the KYC information is mandatory, till the contract is terminated.\n\nI have duly been made aware that I can also use alternative KYC documents like Passport, Voter's ID Card, Drivinglicence, NREGA job card, letter from National Population Register, in lieu of Aadhaar for the purpose of completing myKYC formalities. I understand and agree that the details so obtained shall be stored with ${orgnisation_name_a} and be shared solely forthe purpose of issuing insurance policy to me and for servicing them. I will not hold ${orgnisation_name_a} or any of its authorized officials responsible in case of any incorrect information provided by me. I further authorize ${orgnisation_name_a} that it may use my mobile number for sending SMS alerts to me regarding various servicing and other matters related to my policy/ies.`,
                text: `${str_para_ekyc_consent}`,
                style: 'smallFontSize',
                alignment: 'justify',
            }],
        }, {
            canvas: [{
                type: 'line',
                x1: 0,
                y1: 5,
                x2: 575,
                y2: 5,
                lineWidth: 1,
                lineCap: 'round'
            }]
        }, );
    } else {
        if (service_is_ekyc === 'Y' || service_is_ekyc == 'y') {
            isAadhaarConsent.push({
                margin: [0, 15, 0, 0],
                text: [{
                    text: `Aadhaar Consent\n`,
                    style: 'titleFont',
                    alignment: 'justify'
                }, {
                    text: `\nI, ${CUST_NAME}, hereby give my voluntary consent to ${orgnisation_name} and authorise the Company to obtain necessary details like Name, DOB, Address, Mobile Number, Email, Photograph through the copy of Aadhaar card / QR code available on my Aadhaar card / XML File shared using the offline verification processof UIDAI.I understand and agree that this information will be exclusively used by ${orgnisation_name_a} only for the KYC purpose and for all service aspects related to my policy/ies, wherever KYC requirements have to be complied with, right from issue of policies after acceptance of risk under my proposals for life insurance, various payments that may have to be made under the policies, various contingencies where the KYC information is mandatory, till the contract is terminated.\n\nI have duly been made aware that I can also use alternative KYC documents like Passport, Voter's ID Card, Drivinglicence, NREGA job card, letter from National Population Register, in lieu of Aadhaar for the purpose of completing myKYC formalities. I understand and agree that the details so obtained shall be stored with ${orgnisation_name_a} and be shared solely forthe purpose of issuing insurance policy to me and for servicing them. I will not hold ${orgnisation_name_a} or any of its authorized officials responsible in case of any incorrect information provided by me. I further authorize ${orgnisation_name_a} that it may use my mobile number for sending SMS alerts to me regarding various servicing and other matters related to my policy/ies.`,
                    style: 'smallFontSize',
                    alignment: 'justify',
                }],
            }, {
                canvas: [{
                    type: 'line',
                    x1: 0,
                    y1: 5,
                    x2: 575,
                    y2: 5,
                    lineWidth: 1,
                    lineCap: 'round'
                }]
            }, );
        }
    }

    return isAadhaarConsent;
}

function onClickPIVCLink(doPIVC) {

    document.getElementById('myModal').style.display = 'none';

    if (doPIVC) {
        window.open(PIVC_LINK);
        //refresh the entire document
        document.location.reload();
    }
}

function get2TLogopdfData() {
    let multipleRowArray = [];

    if (PLAN_NAME === 'Arogya Shield') {
        multipleRowArray.push({
            margin: [0, 0, 0, 0],
            layout: 'noBorders',
            table: {
                widths: ['*', '*'],
                body: [
                    [{
                            image: `sbiGeneralLogo`,
                            width: 80,
                            alignment: 'left'
                        },
                        {
                            image: `sbiLogo`,
                            width: 80,
                            alignment: 'right'
                        }
                    ],
                ]
            }
        });
    } else {
        multipleRowArray.push({
            margin: [0, 15, 0, 0],
            layout: 'noBorders',
            table: {
                widths: ['*', '*'],
                body: [
                    [{},
                        {
                            image: `sbiLogo`,
                            width: 80,
                            alignment: 'right'
                        }
                    ],
                ]
            }
        });
    }

    return multipleRowArray;
}

function getUserPdfData(imageData, textData, validateOrNot) {

    let multipleRowArray = [];

    if (imageData) {

        multipleRowArray.push({
            margin: [0, 15, 0, 0],
            style: 'tableExample',
            table: {
                widths: ['*', 'auto'],
                body: [
                    [`${textData}`, `${validateOrNot}`],
                ]
            }
        }, {
            margin: [0, 15, 0, 0],
            /* image: `data:image/png;base64,` + mUserPhoto, */
            /* image: `${canvasUser.toDataURL("image/png")}`, */
            image: `${imageData}`,
            fit: [150, 150],
            /* width: 150,
            height: 150, */
            alignment: 'center'
        });

    }

    return multipleRowArray;

}