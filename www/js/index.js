var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        
        app.receivedEvent('deviceready');        
        /*
        window.FirebasePlugin.getToken(function(token) {
			   // save this server-side and use it to push notifications to this device
			   alert(token);
			   saveRegId(token);
			}, function(error) {
			    console.error(error);
			});
			*/
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

    }
};

var THIS_DOMAIN = "https://jokojo.com/matrimonyApp/";
//var THIS_DOMAIN = "http://localhost/mobileApp/matrimonyApp/includes/";
//alert(localStorage.getItem('userId'))

checkLoginUser();
/*PullToRefresh.init({
    mainElement: 'body',
    onRefresh: function(){
        // What do you want to do when the user does the pull-to-refresh gesture
        window.location.reload(); 
    }
});*/

document.addEventListener("backbutton", backKeyDown, true); 

$( document ).ready(function() {
    
    if(localStorage.getItem('userId') > 0){        
        $.mobile.changePage( $("#homePage"),{ transition: "fade"});
    }
    $(document).on("click",".serchIcon",function(){            
        $('.card').addClass('flipped');
    });
    $(document).on("click",".serClose",function(){        
        $('.card').removeClass('flipped');
    });

    //register
    $(document).on("click","#userRegister",function(){        
        $('#rgMsg').html('');
        $("#ajxLoading" ).show();
        var firstName = $('#first-name').val();
		var dateofbirth = $('#dateofbirth').val();
		var email = $('#email').val();
		var password = $('#password').val();		
		var mobileNo = $('#mobileNo').val();
		var gender = $("input[name='gender']:checked").val();
		
        $.ajax({
            url : THIS_DOMAIN+'includes/ajax-registration.php',
			type : 'POST',
			data : {
				firstName : firstName,
				dateofbirth : dateofbirth,
				email : email,
				password : password,				
				mobileNo : mobileNo,
				gender : gender				
			},
            success: function(succ)
            {	  
                console.log(succ)
                $("#ajxLoading" ).hide();
                if(succ.stat == 'error'){
                    $('#rgMsg').html('<div class="alert alert-danger">'+succ.msg+'</div>');
                }
                if(succ.stat == 'success'){
                    $('#rgMsg').html('<div class="alert alert-success">'+succ.msg+'</div>');
                    localStorage.setItem('email',succ.emailId);
                    localStorage.setItem('fullName',succ.name);
                    localStorage.setItem('userId',succ.userId);
                    localStorage.setItem('mobileNo',succ.mobileNo);
                    localStorage.setItem('payStatus',succ.payStatus);
                    localStorage.setItem('isPhoneVerify',succ.isPhoneVerify);
                    localStorage.setItem('profileId',succ.profileId);
                    localStorage.setItem('userAvtar',succ.userAvtar);
                    localStorage.setItem('addedDate',succ.addedDate);
                    localStorage.setItem('expireDate',succ.expireDate);
                    localStorage.setItem('gender',succ.gender);
                    
                    checkLoginUser();           
                    //$.mobile.changePage( $("#homePage"),{ transition: "slide"});
                    //$.mobile.changePage( $("#verifyPhone"),{ transition: "fade"});
                }
            },
            dataType: 'json'
        });
    })//end register
    
    //verify phone
    $(document).on("click","#verifyPhoneCode",function(){    
		var phoneCode = $('#phoneCode').val(),
        userId = localStorage.getItem('userId');
		$("#ajxLoading" ).show();
        $.ajax({
            url : THIS_DOMAIN+'includes/verifyPhone.php',
			type : 'POST',
			data : {userId:userId, phoneCode:phoneCode},
            success: function(resp)
            {	  
                $("#ajxLoading" ).hide();
                if(resp.stat == 'error'){
                    $('#vrfEmailMsg').html('<div class="alert alert-danger">'+resp.msg+'</div>');
                }
                if(resp.stat == 'success'){
                    localStorage.setItem('isPhoneVerify','1');
                    $('#vrfEmailMsg').html('<div class="alert alert-success">'+resp.msg+'</div>');
                    $.mobile.changePage( $("#editPage"),{ transition: "slide"});
                }

            },
            dataType: 'json'
        });
    });//end verify phone

    //login
    $(document).on("click","#userLogin",function(){
		$('#lgMsg').html('');	
		$("#ajxLoading" ).show();
		var lemail = $('#emailLg').val();
		var lpass = $('#passwordLg').val();
		var flg = true;
		if (lemail == "" || lpass == "") {
			$('#lgMsg').html('<div style="color:red;margin-bottom:10px;">Please provide valid login detail</div>');
			$("#ajxLoading" ).hide();
			flg = false;
		}	
		if (flg === true) {
			$.ajax({
				type: "POST",
				url: THIS_DOMAIN+"includes/userLogin.php",
				data: {email:lemail,pass:lpass},
				success: function(succ)
				{	
					
					if (succ.stat == "success") {
						localStorage.setItem('email',succ.emailId);
						localStorage.setItem('fullName',succ.name);
                        localStorage.setItem('userId',succ.userId);
                        localStorage.setItem('mobileNo',succ.mobileNo);
                        localStorage.setItem('payStatus',succ.payStatus);
                        localStorage.setItem('isPhoneVerify',succ.isPhoneVerify);
                        localStorage.setItem('profileId',succ.profileId);
                        localStorage.setItem('userAvtar',succ.userAvtar);
                        localStorage.setItem('addedDate',succ.addedDate);
                        localStorage.setItem('expireDate',succ.expireDate);
                        localStorage.setItem('gender',succ.gender);
                        
						checkLoginUser();			
						$.mobile.changePage( $("#homePage"),{ transition: "slide"});
					}else {
						$('#lgMsg').html('<div style="color:red;margin-bottom:10px;">Invalid login detail</div>');
					}
					$("#ajxLoading" ).hide();	
				},
				dataType: 'json'
			});
		}
    });//end login

    
    
    $(document).on("pageshow","#logoutPage",function(){
				
        $('#ajxLoading').show();
        localStorage.removeItem('email');
        localStorage.removeItem('fullName');
        localStorage.removeItem('userId');
        localStorage.removeItem('mobileNo');
        localStorage.removeItem('payStatus');
        localStorage.removeItem('isPhoneVerify');
        localStorage.removeItem('profileId');
        localStorage.removeItem('userAvtar');
        localStorage.removeItem('addedDate');
        localStorage.removeItem('expireDate');
        localStorage.removeItem('gender');
        
        var louT = '<h4>You have successfully logged out!</h4>If you want to login <a href="#loginPage" data-transition="fade">click here</a>';	
        $('#logoutTxt').html(louT);
        $('#ajxLoading').hide();
        checkLoginUser();
    });

    $(document).on('click', function (e) {
        if ($(e.target).closest("#mySidenav").length === 0) {            
            if($('#mySidenav').css("opacity") == '1'){                
                closeNav();
            }            
        }  
        if ($(e.target).closest(".sreachSlide").length === 0) {
            var p = $('.sreachSlide').position();            
            if(p.left <= '200'){
                $('.sreachSlide').removeClass('animSer');
                $('.opSerbg').hide();                  
            }
        }
        if ($(e.target).closest(".opnPhotoOpst").length === 0) {
            var op = $('.opnPhotoOpst').css("opacity");
            //console.log($(".opnPhotoOpst").css("bottom"))
            if(op == '1'){
                closePhotoOpt();
            }
        }    
    });

    $(document).on("pageshow","#editPage",function(){
        checkLoginUser();
        $("#ajxLoading" ).show();
        $.ajax({
            type: "POST",
            url: THIS_DOMAIN+"includes/editProfile.php",
            data: {userId:localStorage.getItem('userId'), callFor:'get'},
            success: function(res)
            {   
                
                $('#aboutSelfInfo').html(res.aboutBio)
                var prImg = THIS_DOMAIN+'userImages/'+res.folder+'/'+res.image;
                var  editImg;
                if(res.image != ""){
                    editImg = '<img src="'+prImg+'" id="myImage">';
                }else{
                    editImg = '<img src="img/'+res.gender+'.webp" id="myImage">';
                }  
                editImg += '<div class="addPhotosBox"><a href="#addPhotosPage" data-transition="slide">Add Photos</a></div>';

                // editImg += '<div><div class="btn btn-success postImgBtn orgBtn" id="uploadPic">Upload Photo</div><div class="btn btn-success postImgBtn orgBtn" id="capturePic">Capture Photo</div></div>';
                $('.editAvtar').html(editImg);

                var bsInf = '<div class="row"><div class="col-5">Name</div><div class="col-7 profCol">'+res.name+'</div><div class="col-5">Age</div><div class="col-7 profCol">'+res.age+' Yrs</div><div class="col-5">Gender</div><div class="col-7 profCol">'+res.gender+'</div><div class="col-5">Height</div><div class="col-7 profCol">'+res.height+'</div><div class="col-5">Marital Status</div><div class="col-7 profCol">'+res.maritalStats+'</div><div class="col-5">Physical Status</div><div class="col-7 profCol">'+res.physicalStatus+'</div></div>';
                $('#bsInfo').html(bsInf);
                if(res.prof !== undefined){
                    var prfnInfo = '<div class="row"><div class="col-5">Education</div><div class="col-7 profCol">'+res.prof.education+'</div><div class="col-5">Employed in</div><div class="col-7 profCol">'+res.prof.employedIn+'</div><div class="col-5">Occupaion</div><div class="col-7 profCol">'+res.prof.occupation+'</div><div class="col-5">Annual Income</div><div class="col-7 profCol">Rs.'+res.prof.annual_income+'</div></div>';
                    $('#prfnInfo').html(prfnInfo);
                }

                var locInfo = '<div class="row"><div class="col-5">Country</div><div class="col-7 profCol">India</div><div class="col-5">State</div><div class="col-7 profCol">'+res.state+'</div><div class="col-5">City</div><div class="col-7 profCol">'+res.city+'</div></div>';
                $('#locInfo').html(locInfo);

                if(res.fam !== undefined){
                    var familyInfo = '<div class="row"><div class="col-5">Family Type</div><div class="col-7 profCol">'+res.fam.familyType+'</div><div class="col-5">Family Status</div><div class="col-7 profCol">'+res.fam.familyStatus+'</div><div class="col-5">Father\'s Occupation</div><div class="col-7 profCol">'+res.fam.fatherOccup+'</div><div class="col-5">Mother\'s Occupation</div><div class="col-7 profCol">'+res.fam.motherOccup+'</div><div class="col-5">Family Origin</div><div class="col-7 profCol">'+res.fam.familyOrigin+'</div><div class="col-5">No. of Brothers</div><div class="col-7 profCol">'+res.fam.brothers+'</div><div class="col-5">No. of Sister</div><div class="col-7 profCol">'+res.fam.sisters+'</div></div>';
                    $('#familyInfo').html(familyInfo);
                }

                $("#ajxLoading" ).hide();   
            },
            dataType: 'json'
        });
    });

    $(document).on("pageshow","#editBio",function(){  
        checkLoginUser();      
        $("#ajxLoading" ).show();

        $.ajax({
            type: "POST",
            url: THIS_DOMAIN+"includes/editBio.php",
            data: {userId:localStorage.getItem('userId'), callFor:'get'},
            success: function(succ)
            {   
                //console.log(succ)
                var txtAre = '<textarea name="aboutSelf" id="aboutSelf">'+succ.aboutBio+'</textarea>';
                $('#aboTextarea').html(txtAre);
                
                $("#ajxLoading" ).hide();   
            },
            dataType: 'json'
        });
    });

    $(document).on("pageshow","#editBasic",function(){    
        checkLoginUser();    
        $("#ajxLoading" ).show();
        $.ajax({
            type: "POST",
            url: THIS_DOMAIN+"includes/editBasic.php",
            data: {userId:localStorage.getItem('userId'), callFor:'get'},
            success: function(succ)
            {   
                //console.log(succ)
                $('#basicMsg').html('');
                var heightStr, weightArr, maritalArr, bodyTypeArr, complexionArr, physicalArr; 
                var mariSel,heightSel,weightStr, bodyTypeStr, complexStr, physicalStr;

                $('#fullName').val(succ.name);
                $('#bsDob').val(succ.dateofbirth);

                $('#height-text').html(succ.heightStr);
                $('#height-inpt').val(succ.height);

                $('#weight-text').html(succ.weightStr);
                $('#weight-inpt').val(succ.weight);

                $('#maritStatus-text').html(succ.maritalStats);
                $('#maritStatus-inpt').val(succ.maritalStats);

                $('#bodyType-text').html(succ.bodyType);
                $('#bodyType-inpt').val(succ.bodyType);

                $('#complexion-text').html(succ.complexion);
                $('#complexion-inpt').val(succ.complexion);

                $('#complexion-text').html(succ.complexion);
                $('#complexion-inpt').val(succ.complexion);

                $('#physicalStatus-text').html(succ.physicalStatus);
                $('#physicalStatus-inpt').val(succ.physicalStatus);
                
                $("#ajxLoading" ).hide();   
            },
            dataType: 'json'
        });
    });

    $(document).on("click","#saveAboutBio",function(){
        $("#ajxLoading" ).show();
        var aboutBio = $('#aboutSelf').val();
        $.ajax({
            type: "POST",
            url: THIS_DOMAIN+"includes/editBio.php",
            data: {userId:localStorage.getItem('userId'), callFor:'set', aboutBio:aboutBio},
            success: function(succ)
            {   
                //console.log(succ)
                $('#aboutSelf').val(succ.aboutBio);
                $("#ajxLoading" ).hide();
            },
            dataType: 'json'
        });

    });
    
    $(document).on("click","#saveBasic",function(){
        $("#ajxLoading" ).show();
        var fromData = $("form#basicDetailFrm").serialize();
        fromData += '&callFor=set&userId='+localStorage.getItem('userId');
        $.ajax({
            type: "POST",
            url: THIS_DOMAIN+"includes/editBasic.php",
            data: fromData,
            success: function(res)
            {   
                //console.log(res)
                $('#basicMsg').html('<div class="alert alert-success">Basic Details Updated successfully</div>')

                $("#ajxLoading" ).hide();
            },
            dataType: 'json'
        });

    });

    $(document).on("click","#saveProf",function(){
        //$("#ajxLoading" ).show();
        var fromData = $("form#profDetailFrm").serialize();
        fromData += '&callFor=set&userId='+localStorage.getItem('userId');
        $.ajax({
            type: "POST",
            url: THIS_DOMAIN+"includes/editProfession.php",
            data: fromData,
            success: function(res)
            {   
                //console.log(res);
                if(res.stat == "success"){
                    $('#profMsg').html('<div class="alert alert-success">Professional Details Updated successfully</div>')
                }
                $("#ajxLoading" ).hide();
            },
            dataType: 'json'
        });

    });

    $(document).on("click","#saveLoc",function(){
        $("#ajxLoading" ).show();
        var fromData = $("form#locDetailFrm").serialize();
        fromData += '&callFor=set&userId='+localStorage.getItem('userId');
        //console.log(fromData);
        $.ajax({
            type: "POST",
            url: THIS_DOMAIN+"includes/editLocation.php",
            data: fromData,
            success: function(res)
            {   
                //console.log(res)
                //if(res.stat == "success"){
                    $('#LocMsg').html('<div class="alert alert-success">Location Updated successfully</div>')
                //}
                $("#ajxLoading" ).hide();
            },
            dataType: 'json'
        });

    });

    $(document).on("click","#saveFamily",function(){
        $("#ajxLoading" ).show();
        var fromData = $("form#familyDetailFrm").serialize();
        fromData += '&callFor=set&userId='+localStorage.getItem('userId');
        //console.log(fromData);
        $.ajax({
            type: "POST",
            url: THIS_DOMAIN+"includes/editFamilyDetails.php",
            data: fromData,
            success: function(res)
            {   
                //console.log(res)
                $('#successMsg').html('<div class="alert alert-success">Family Details Updated successfully</div>')

                $("#ajxLoading" ).hide();
            },
            dataType: 'json'
        });

    });

    $("#state").change(function(){
        var stateVal = $("#state").val();
           //alert(stateVal); 
        $.ajax({

            type: "POST",
            url: THIS_DOMAIN+"includes/getStateCityInfo.php",

            data: {userId:localStorage.getItem('userId'),stateVal:stateVal},
            success: function(succ)
            {
                //console.log(succ);
                var cityArr,citySel,cityStr;

                $.each( succ.cityArr, function( key, val ) {
                    citySel = "";
                    if(val === succ.city){
                        citySel = 'selected="selected"';
                        $('#city-button span').html(succ.city)
                    }
                    cityStr += '<option value="'+val+'" '+citySel+'>'+val+'</option>';
                });
                $('#city').html(cityStr);
            },
            dataType: 'json'
        });
    });

    $(document).on("click",".backToEdit",function(){
        $.mobile.changePage( $("#editPage"),{ transition: "slide", reverse: true});
    });

    $(document).on("click","#capturePic",function(){
        navigator.camera.getPicture(onSuccess, onFail, { quality: 70,
            destinationType: Camera.DestinationType.FILE_URI,
            encodingType: Camera.EncodingType.JPEG,
            sourceType : Camera.PictureSourceType.CAMERA
            
        });     

    }); 
    
    $(document).on("click","#uploadPic",function(){
        navigator.camera.getPicture(onSuccess, onFail, { quality: 70,
            destinationType: Camera.DestinationType.FILE_URI,
            encodingType: Camera.EncodingType.JPEG,
            sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
            
        });
        /*
        var imgArr = [];        
        window.imagePicker.getPictures(
            function(results) {
                var mtIm = "";
                for (var i = 0; i < results.length; i++) {
                    plugins.crop(function success (newPath) {    
                        var imgPath = newPath.substr(0,newPath.lastIndexOf('?'));                        
                        var image = document.getElementById('myImage');
                        image.src = imgPath;
                        uploadImage(imgPath);
                    }, function fail () {

                    }, results[i], { quality: 100, targetWidth: 500, targetHeight: 500 })


                }
                //$('#mltImg').html(mtIm);
                //localStorage.setItem("imgStor", JSON.stringify(imgArr));
            }, function (error) {
                console.log('Error: ' + error);
            }, {
                maximumImagesCount: 1,
                width: 500
            }
        );*/
        
    });

    $(document).on("click","#uploadMorePic",function(){
        
        
        navigator.camera.getPicture(onMSuccess, onFail, { quality: 70,
            destinationType: Camera.DestinationType.FILE_URI,
            encodingType: Camera.EncodingType.JPEG,
            sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM,            
            allowEdit: 1
        });

        /*var imgArr = [];        
        window.imagePicker.getPictures(
            function(results) {
                var mtIm = "";
                for (var i = 0; i < results.length; i++) {
        
                    uploadImage(results[i], 'moreImg');

                }        
            }, function (error) {
                console.log('Error: ' + error);
            }, {
                maximumImagesCount: 5,
                width: 500
            }
        );*/
        
    });
    $(document).on("click","#captureMorePic",function(){
        navigator.camera.getPicture(onMSuccess, onFail, { quality: 70,
            destinationType: Camera.DestinationType.FILE_URI,
            encodingType: Camera.EncodingType.JPEG,
            sourceType : Camera.PictureSourceType.CAMERA,            
            allowEdit: 1
        });
    });

    $(document).on("click",".viewProfile",function(){
        var profId = $(this).attr('data-id');
        $('#profId').val(profId);
        $.mobile.changePage( $("#profilePage"),{ transition: "slide"});
    });

    $(document).on("click","#searchBtn",function(){
        var sq = $.trim($('#sq').val());
        $('form#advSearchFrm').trigger("reset");
        getSearchByName('');
        $.mobile.changePage( $("#searchPage"),{ transition: "slide"});
        
    });
    $(document).on("click","#serAge",function(){
        showSearch();
        let i;
        
        $('.sreachSlide').html('');
        var hidAgFrm = $('#hidAgFrm').val();
        var hidAgTo = $('#hidAgTo').val();

        var ageStr = '<div class="heading">Age</div>';
        ageStr += '<div class="row"><div class="col-3 form-group">From</div><div class="col-9 form-group"><select name="ageFrm" id="ageFrm" class="adsSelBox">';
        for(i=18;i<=50;i++){
            var ageSelStr = "";
            if(hidAgFrm == i){
                ageSelStr = 'selected="selected"';
            }
            ageStr += '<option value="'+i+'" '+ageSelStr+'>'+i+'</option>';
        }
        ageStr += '</select></div>';

        ageStr += '<div class="col-3 form-group">To</div><div class="col-9 form-group"><select name="ageTo" id="ageTo" class="adsSelBox">'
        for(i=18;i<=50;i++){
            ageSelStr = "";
            if(hidAgTo == i){
                ageSelStr = 'selected="selected"';
            }
            ageStr += '<option value="'+i+'" '+ageSelStr+'>'+i+'</option>';
        }
        ageStr += '</select></div>';
        ageStr += '<div class="col-12"><button type="button" class="ui-btn ui-btn-inline orgBtn submitBtn" id="searchAgeBtn">Submit</button></div>';
        ageStr += '</div>';
        $('.sreachSlide').html(ageStr);
    });

    $(document).on("click","#searchAgeBtn",function(){
        let ageFrm = $('#ageFrm').val();
        let ageTo = $('#ageTo').val();
        $('#serAge span').html(ageFrm+' yrs to '+ ageTo+ ' yrs');
        $('#hidAgFrm').val(ageFrm);
        $('#hidAgTo').val(ageTo);

        hideSearch()

        //console.log(ageFrm)
    })

    
    $(document).on("click","#searchHeight",function(){
        showSearch();
        $('.sreachSlide').html('');
        
        let i,j;
        var hidHtFrm = $('#hidHtFrm').val();
        var hidHtTo = $('#hidHtTo').val();

        var heightStr = '<div class="heading">Height</div>';
        heightStr += '<div class="row"><div class="col-3 form-group">From</div><div class="col-9 form-group"><select name="heightFrm" id="heightFrm" class="adsSelBox">';

        heightStr += '<option value="">Any</option>';
        for(i=4;i<=6;i++){            
            for(j=0;j<=11;j++){                
                var htVal, htStr;
                htVal = i+'.'+j;
                htStr = i+'ft ' +j+ 'in';                
                if(j==0){
                    htVal = i;
                    htStr = i+'ft ';
                }
                var htSelStr = "";
                if(hidHtFrm == htVal){
                    htSelStr = 'selected="selected"';
                }
                heightStr += '<option value="'+htVal+'" '+htSelStr+'>'+htStr+'</option>';
            }
        }
        heightStr += '</select></div>';

        
        heightStr += '<div class="col-3 form-group">To</div><div class="col-9 form-group"><select name="heightTo" id="heightTo" class="adsSelBox">';
        heightStr += '<option value="">Any</option>';
        for(i=4;i<=6;i++){            
            for(j=0;j<=11;j++){
                
                var htVal, htStr;
                htVal = i+'.'+j;
                htStr = i+'ft ' +j+ 'in';                
                if(j==0){
                    htVal = i;
                    htStr = i+'ft ';
                }
                var htSelStr = "";
                if(hidHtTo == htVal){
                    htSelStr = 'selected="selected"';
                }

                heightStr += '<option value="'+htVal+'" '+htSelStr+'>'+htStr+'</option>';
            }         
        }      
        heightStr += '</select></div>';

        heightStr += '<div class="col-12"><button type="button" class="ui-btn ui-btn-inline orgBtn submitBtn" id="searchHeightBtn">Submit</button></div>';
        heightStr += '</div>';
        $('.sreachSlide').html(heightStr);         
    });

    $(document).on("click","#searchHeightBtn",function(){
        
        //$( "#myselect option:selected" ).text();
        let heightFrm = $('#heightFrm').val();
        let heightTo = $('#heightTo').val();
        let htfText = $('#heightFrm option:selected').text();
        let httText = $('#heightTo option:selected').text();
        
        $('#searchHeight span').html(htfText+' to '+ httText);

        $('#hidHtFrm').val(heightFrm);
        $('#hidHtTo').val(heightTo);        
        
        hideSearch()
        //console.log(heightTo)
    })

    $(document).on("click","#searchMarried",function(){

        let maritalArr = ['Unmarried', 'Widower', 'Divorced', 'Separated','Any'];
        var str, mariSel;
        showSearch();
        $('.sreachSlide').html('');
        var serMdSts = $('#hidMarital').val();
        var marritalStr = '<div class="heading">Marrital Status</div>';
        marritalStr += '<div class="row"><div class="col-4 form-group">Select :</div><div class="col-8 form-group"><select name="maritalFrm" id="maritalFrm" class="adsSelBox">';
        $.each(maritalArr, function( key, val ) {            
            mariSel = "";
            if(serMdSts == val){
                mariSel = 'selected="selected"';
            }                       
            marritalStr += '<option value="'+val+'" '+mariSel+'>'+val+'</option>';
        });
        marritalStr += '</select></div>';
        marritalStr += '<div class="col-12"><button type="button" class="ui-btn ui-btn-inline orgBtn submitBtn" id="searchMaritalBtn">Submit</button></div>';
        marritalStr += '</div>';

        $('.sreachSlide').html(marritalStr);
    });

    $(document).on("click","#searchMaritalBtn",function(){
        let maritalFrm = $('#maritalFrm').val();       
        $('#searchMarried span').html(maritalFrm);
        $('#hidMarital').val(maritalFrm);        
        hideSearch()
        //console.log(heightTo)
    }) 

    $(document).on("click","#searchLoc",function(){
        showSearch();
        $('.sreachSlide').html('<i class="fa fa-spinner fa-spin fa-pulse fa-2x"></i>');
        var stateStr;
        
        $.ajax({
            type: "POST",
            url: THIS_DOMAIN+"includes/getDropdownValue.php",
            data: {callFor:'cityDist'},
            dataType: 'json',
            success: function(res)
            {           
                //console.log(res)
                stateStr = '<div class="heading">Location</div>';
                stateStr += '<div class="row"><div class="col-4 form-group">Country:</div><div class="col-8 form-group">India</div><div class="col-4 form-group">State:</div><div class="col-8 form-group">Maharashtra</div>';
                stateStr += '<div class="col-4 form-group">City :</div><div class="col-8 form-group"><select name="cityFrm" id="cityFrm" class="adsSelBox">';
                stateStr += '<option value="">Any</option>';
                var lctSel;
                var hidCity = $('#hidCity').val();
                $.each(res.result, function( key, val ) {            
                    lctSel = "";
                    if(hidCity == val){
                        lctSel = 'selected="selected"';
                    }
                    stateStr += '<option value="'+val+'" '+lctSel+'>'+val+'</option>';
                });
                stateStr += '</select></div>';
                stateStr += '<div class="col-12"><button type="button" class="ui-btn ui-btn-inline orgBtn submitBtn" id="searchLocBtn">Submit</button></div>';
                stateStr += '</div>';

                $('.sreachSlide').html(stateStr); 
                
            }
        });
    });

    $(document).on("click","#searchLocBtn",function(){
        let cityFrm = $('#cityFrm').val();
        //alert(cityFrm);
        $('#searchLoc span').html(cityFrm);
        $('#hidCity').val(cityFrm);
        hideSearch()
    })


    $(document).on("click","#advSearchBtn",function(){        
        getSearchByName();
        $.mobile.changePage( $("#searchPage"),{ transition: "slide"});
    })
    
    $(document).on("click",".closeSlide",function(){
        $('.bsSlide').removeClass('animSer');
        //$('html body').css({'overflow-y':'auto'});
    })
    $(document).on("click",".htOption",function(){
        var opt = $(this).attr('data-id');
        var elem = $(this).attr('data-elem');
        $('#'+elem+'-text').html($(this).html());
        $('#'+elem+'-inpt').val(opt);
        $('.bsSlide').removeClass('animSer');
    })

    $(document).on("click",".remLink",function(){
        var imgId = $(this).attr('data-id');
        //alert(imgId)
        //confirm('are you');
        $('.picBg').show();
        $('.opnPhotoOpst').addClass('sldOpt')
        var optStr = '<p>Are you sure? You want to remove.<span onclick="closePhotoOpt()"><i class="fa fa-times" aria-hidden="true"></i></span></p><div><button type="button" class="ui-btn ui-btn-inline orgBtn submitBtn" onclick="removeImage('+imgId+')">Remove</button><button type="button" class="ui-btn ui-btn-inline orgBtn cancelBg" onclick="closePhotoOpt()">Cancel</button></div>';
        $('.opnPhotoOpst').html(optStr);
    })    
    

    var swiper = new Swiper('.swiper-container', {
        pagination: {
          el: '.swiper-pagination',
        },
        
    });

    

    

})//end of ready

function showEditSlideOption(elemt, elTitle){
    $('.slideBody').html('<div class="editLoad"><i class="fa fa-spinner fa-spin fa-pulse fa-2x"></i></div>');
    showEditSlid('bsSlide');
    $('.slideTitle').html(elTitle);
    
    $.ajax({
        type: "POST",
        url: THIS_DOMAIN+"includes/getDropdownValue.php",
        data: {callFor:elemt},
        dataType: 'json',
        success: function(res)
        {           
            console.log(res)
            var result = "";
            $.each( res.result, function( key, val ) {                    
                result += '<div data-id="'+key+'" class="htOption optStyl" data-elem="'+elemt+'">'+val+'</div>';
            });
            $('.slideBody').html(result);
        }
    });
}

function showSearch(){
    $('.sreachSlide').addClass('animSer');
    $('.opSerbg').show();
}

function showEditSlid(elcls){
    $('.'+elcls).addClass('animSer');
    //$('html body').css({'overflow-y':'hidden'});
}


function hideSearch(){
    $('.sreachSlide').removeClass('animSer');
    $('.opSerbg').hide();
}

function returnHeightStr(strHt){    
    let htSlp = strHt.split(".");
    //alert(htSlp.length)
    let rtHtStr = "";
    rtHtStr = htSlp[0]+'ft';
    if(htSlp.length > 1) {
        rtHtStr = rtHtStr+ ' '+htSlp[1]+'in';
    }
    return rtHtStr;
}

$(document).on("pageshow","#searchPage",function(){
    $(document).scroll(function(){      
        if ($(window).scrollTop() + $(window).height() > $(document).height() - 200) {            
            if($('#isSerBusy').val() == 'no' ){                
                getSearchByName('loadmore');
            }
        }
    });
})

$(document).on("pageshow","#verifyPhone",function(){
    var verifMsg = 'We sent verification code to your register number +91-'+localStorage.getItem('mobileNo');
    $('#verifMsg').html(verifMsg);
});

$(document).on("pageshow","#advanceSearch",function(){
    //serAge
    var agef = $('#hidAgFrm').val(), aget = $('#hidAgTo').val();
    if(agef <= 0 || aget <= 0){
        $('#serAge span').html('Any');
    }    
    if(agef > 0 && aget > 0){
        $('#serAge span').html(agef+ ' yrs to '+aget+' yrs');
    }

    var hitf = $('#hidHtFrm').val(), hitt = $('#hidHtTo').val();
    
    if(hitf <= 0 || hitt <= 0){
        $('#searchHeight span').html('Any');
    }    
    if(hitf > 0 && hitt > 0){
        $('#searchHeight span').html(returnHeightStr(hitf)+ ' to '+returnHeightStr(hitt));
    }
    var adsMtSts = $('#hidMarital').val();
    if(adsMtSts == ""){
        $('#searchMarried span').html('Any');
    }else{        
        $('#searchMarried span').html(adsMtSts);
    }

    var adshidCity = $('#hidCity').val();
    if(adshidCity == ""){
        $('#searchLoc span').html('Any');
    }else{        
        $('#searchLoc span').html(adshidCity);
    }
});

$(document).on("pageshow","#profilePage",function(){
    checkLoginUser();
    $("#ajxLoading" ).show();
    $('#profileInfo, #profAvtar').html('');
    var profId = $('#profId').val();
    $.ajax({
        type: "POST",
        url: THIS_DOMAIN+"includes/getProfileDetails.php",
        data: {userId:profId, senderId:localStorage.getItem('userId')},
        dataType: 'json',
        success: function(res)
        {  
            //console.log(res);
            var prNm = res.name;
            prNm = prNm.substr(0,prNm.indexOf(' '));
            if(prNm == '')
                prNm = res.name;

            $('#hdPrfName').html(prNm+'\'s profile');
            var prImg = THIS_DOMAIN+'userImages/'+res.folder+'/'+res.image;
            if(res.image == ""){
                prImg = 'img/'+res.gender+'.webp';
            }
            //console.log(res.moreImg.length);
            if(res.moreImg.length > 0){
                var avtarInfo = '<div class="swiper-container"><div class="swiper-wrapper"><div class="swiper-slide editAvtar profAvtarBg" style="background-image: url('+prImg+')"></div>';
                var mrImg;
                $.each(res.moreImg, function( key, val ) {
                    mrImg = "";
                    mrImg = THIS_DOMAIN+'userImages/'+val.folder+'/'+val.imageName;                
                    avtarInfo += '<div class="swiper-slide editAvtar profAvtarBg actHt"><img src="'+mrImg+'"></div>';
                })
                avtarInfo += '</div><div class="swiper-pagination"></div></div>';
            }else{
                var avtarInfo = '<div class="swiper-slide editAvtar profAvtarBg" style="background-image: url('+prImg+')"></div>';
            }
            $('#profAvtar').html(avtarInfo);

            var brifFix = '<div class="fixImg"><img src="'+prImg+'"></div><div class="fixText">'+res.profileId+'<div>'+res.name+'</div></div>';
            $('.profBrifFix').html(brifFix);


            var prsInfo = '<div class="row"><div class="col-12 profBrif">';
            prsInfo += '<div>'+res.profileId+'</div><div class="brifName">'+res.name+'</div>';
            prsInfo += '<div>'+res.age+' Yrs, '+res.height+', '+res.city+', Maharashtra</div>';
            prsInfo += '</div></div>';            
            prsInfo += '<div class="cart"><div class="cartHead">A Few lines about myself.</div><div class="cartBody">'+res.aboutBio+'</div></div>';

            prsInfo += '<div class="cart"><div class="cartHead">Basic Details</div><div class="cartBody">';
            prsInfo += '<div class="row"><div class="col-5">Name</div><div class="col-7 profCol">'+res.name+'</div><div class="col-5">Profile Id</div><div class="col-7 profCol">'+res.profileId+'</div><div class="col-5">Age</div><div class="col-7 profCol">'+res.age+' Yrs</div><div class="col-5">Gender</div><div class="col-7 profCol">'+res.gender+'</div><div class="col-5">Height</div><div class="col-7 profCol">'+res.height+'</div><div class="col-5">Marital Status</div><div class="col-7 profCol">'+res.maritalStats+'</div><div class="col-5">Physical Status</div><div class="col-7 profCol">'+res.physicalStatus+'</div></div>';
            prsInfo += '</div></div>';

            if(res.prof !== undefined){
                prsInfo += '<div class="cart"><div class="cartHead">Professional Information</div><div class="cartBody">';
                
                prsInfo += '<div class="row"><div class="col-5">Education</div><div class="col-7 profCol">'+res.prof.education+'</div><div class="col-5">Education Detail</div><div class="col-7 profCol">'+res.prof.educationDetail+'</div><div class="col-5">Employed in</div><div class="col-7 profCol">'+res.prof.employedIn+'</div><div class="col-5">Occupation</div><div class="col-7 profCol">'+res.prof.occupation+'</div><div class="col-5">Occupation Detail</div><div class="col-7 profCol">'+res.prof.occuDetails+'</div><div class="col-5">Annual Income</div><div class="col-7 profCol">Rs.'+res.prof.annual_income+'</div></div>';
                prsInfo += '</div></div>'
            }

            prsInfo += '<div class="cart"><div class="cartHead">Location Information</div><div class="cartBody">';
            prsInfo += '<div class="row"><div class="col-5">Country</div><div class="col-7 profCol">'+res.country+'</div><div class="col-5">State</div><div class="col-7 profCol">'+res.state+'</div><div class="col-5">City</div><div class="col-7 profCol">'+res.city+'</div></div>';
            prsInfo += '</div></div>';

            if(res.fam !== undefined){
                prsInfo += '<div class="cart"><div class="cartHead">Family Information</div><div class="cartBody">';
                prsInfo += '<div class="row"><div class="col-5">Family Type</div><div class="col-7 profCol">'+res.fam.familyType+'</div><div class="col-5">Family Status</div><div class="col-7 profCol">'+res.fam.familyStatus+'</div><div class="col-5">Father\'s Occupation</div><div class="col-7 profCol">'+res.fam.fatherOccup+'</div><div class="col-5">Mother\'s Occupation</div><div class="col-7 profCol">'+res.fam.motherOccup+'</div><div class="col-5">Family Origin</div><div class="col-7 profCol">'+res.fam.familyOrigin+'</div><div class="col-5">No. of Brothers</div><div class="col-7 profCol">'+res.fam.brothers+'</div><div class="col-5">No. of Sisters</div><div class="col-7 profCol">'+res.fam.sisters+'</div></div>';
                prsInfo += '</div></div>'

            }   
            var userAct = '';
            
            userAct += '<a class="text-grey" href="javascript:void(0)" id="shortlist-'+res.userId+'" onclick="shortlist('+res.userId+')"><u><i class="fa fa-heart"></i></u> <span>'+res.sl+'</span></a>';

            userAct += '<a class="text-grey" href="javascript:void(0)" id="sendIntr-'+res.userId+'" onclick="sendInterest('+res.userId+')"><i class="fa fa-paper-plane"></i> Send Interest</a>';

            $('.userActBox').html(userAct);
            $('#profileInfo').html(prsInfo);  
            $("#ajxLoading" ).hide();
            
            if(res.moreImg.length > 0){
                var swiper = new Swiper('.swiper-container', {
                    loop: true,
                    pagination: {
                      el: '.swiper-pagination',
                      type: 'fraction',
                    },
                    
                });
            }
        }
    })
})

$(document).on("pageshow","#homePage",function(){
    checkLoginUser();
    $("#ajxLoading" ).show();
    getHomePageMatches();
    $(document).scroll(function(){      
        if ($(window).scrollTop() + $(window).height() > $(document).height() - 200) {            
            if($('#isHombusy').val() == 'no' ){                                   
                getHomePageMatches('loadmore');
            }
        }
    });
    /*PullToRefresh.init({
        mainElement: '#homePage',
        onRefresh: function(){
            // What do you want to do when the user does the pull-to-refresh gesture
            window.location.reload(); 
        }
    })*/
});

$(document).on("pageshow","#profInfo",function(){        
    $('#profMsg').html('');
    $.ajax({
        type: "POST",
        url: THIS_DOMAIN+"includes/editProfession.php",
        data: {userId:localStorage.getItem('userId'), callFor:'get'},
            
        success: function(succ)
        {   
            
            $('#collegeName').val(succ.collegeName);

            $('#education-text').html(succ.education);
            $('#education-inpt').val(succ.education);

            $('#employedIn-text').html(succ.employedIn);
            $('#employedIn-inpt').val(succ.employedIn);

            $('#occupation-text').html(succ.occupation);
            $('#occupation-inpt').val(succ.occupation);

            $('#annualIncome-text').html('Rs.'+succ.annual_incomeStr);
            $('#annualIncome-inpt').val(succ.annual_income);

            $('#eduDetail').val(succ.educationDetail);
            $('#occDetail').val(succ.occuDetails);
            $('#empIn').val(succ.employedIn);
            
            $("#ajxLoading").hide();
             
        },

        dataType: 'json',

    });
     
});   

$(document).on("pageshow","#editLoc",function(){        
    $("#ajxLoading" ).show();
    $.ajax({
        type: "POST",
        url: THIS_DOMAIN+"includes/editLocation.php",
        data: {userId:localStorage.getItem('userId'), callFor:'get'},
        success: function(succ)
        {   
            
            $('#cityDist-text').html(succ.city);
            $('#cityDist-inpt').val(succ.city);
            $('#village').val(succ.village);
            $("#ajxLoading" ).hide(); 
        },
        dataType: 'json'
    });
});

$(document).on("pageshow","#editFamily",function(){        
    $("#ajxLoading" ).show();
    
    $.ajax({
        type: "POST",
        url: THIS_DOMAIN+"includes/editFamilyDetails.php",
        data: {userId:localStorage.getItem('userId'), callFor:'get'},
        success: function(succ)
        {   

            console.log(succ)
            $('#familyType-text').html(succ.familyType);
            $('#familyType-inpt').val(succ.familyType);

            $('#familyStatus-text').html(succ.familyStatus);
            $('#familyStatus-inpt').val(succ.familyStatus);

            $('#noOfBrothers-text').html(succ.brothers);
            $('#noOfBrothers-inpt').val(succ.brothers);

            $('#broMarried-text').html(succ.broMarried);
            $('#broMarried-inpt').val(succ.broMarried);

            $('#noOfSisters-text').html(succ.sisters);
            $('#noOfSisters-inpt').val(succ.sisters);

            $('#sisMarried-text').html(succ.sisMarried);
            $('#sisMarried-inpt').val(succ.sisMarried);

            $('#fatherOccup').val(succ.fatherOccup);
            $('#motherOccup').val(succ.motherOccup);
            $('#familyOrigin').val(succ.familyOrigin);

            $("#ajxLoading" ).hide();   
        },
        dataType: 'json'
    });
});

$(document).on("pageshow","#addPhotosPage",function(){
    $('#moreImages, #avtarStr').html("");
    closeNav();
    getMoreImgForEdit();  

});

function getMoreImgForEdit(){
    $('#ajxLoading').show();    
    $.ajax({
        type: "POST",
        url: THIS_DOMAIN+"includes/getProfilePhotos.php",
        data: {userId:localStorage.getItem('userId')},
        dataType: 'json',
        success: function(res)
        { 
            //console.log(res.prof);
            var avtarStr = '';
            avtarStr = '<div>Profile Photo</div><div class="profileImgAv"><div class="avtarBox">';
            if(res.prof.image != ''){
                avtarStr += '<img src="'+THIS_DOMAIN+'userImages/'+res.prof.folder+'/'+res.prof.image+'" id="profAvtarImg">'
            }else{
                avtarStr += '<img src="img/'+res.prof.gender+'.webp" id="profAvtarImg">';
            }
            avtarStr += '</div><div><a href="#" onclick="openUpload(\'uplProfile\')">+ Update profile Photo</a></div></div><div class="divider"></div><div><a href="#" onclick="openUpload(\'uplMorePic\')">+ Add more photo</a> ';
            if(res.prof.totalImg > 0){
                avtarStr += '<span>('+res.prof.totalImg+')</span>';
            }
            
            avtarStr += '</div>';
            $('#avtarStr').html(avtarStr);

            var moreImg='<div class="row">';
            $.each(res.moreImg, function( key, val ) {
                //alert(key)
                var brdTp = "";
                if(key <=2)
                    brdTp = " brdTp";

                moreImg += '<div class="col-4'+brdTp+'"><div class="imgBox"><img src="'+THIS_DOMAIN+'userImages/'+val.folder+'/'+val.imageName+'" ></div><a href="#" class="remLink" data-id="'+val.imgId+'">Remove</a></div>';
            })
            moreImg += '</div>';

            $('#moreImages').html(moreImg);
            $('#ajxLoading').hide();

        }
    }) 
}

function openUpload(picEle){
    $('.picBg').show();
    $('.opnPhotoOpst').addClass('sldOpt')
    //alert(picEle)
    if(picEle == 'uplProfile'){
        var optStr = '<p>Update Profile Photo<span onclick="closePhotoOpt()"><i class="fa fa-times" aria-hidden="true"></i></span></p><div id="uploadPic"><i class="fa fa-picture-o" aria-hidden="true"></i> Upload from gallery</div><div id="capturePic"><i class="fa fa-camera-retro" aria-hidden="true"></i> Take a Photo</div>';
        $('.opnPhotoOpst').html(optStr);
    }else{
        var optStr = '<p>Add More Photos</p><div id="uploadMorePic"><i class="fa fa-picture-o" aria-hidden="true"></i> Upload from gallery</div><div id="captureMorePic"><i class="fa fa-camera-retro" aria-hidden="true"></i> Take a Photo</div>';
        $('.opnPhotoOpst').html(optStr);
    }
}

function closePhotoOpt(){
    $('.picBg').hide();
    $('.opnPhotoOpst').removeClass('sldOpt')
}

function onSuccess(imageURI) {    
    closePhotoOpt();
    var imgArrC = [];

    plugins.crop(function success (newPath) {    
        var imgPath = newPath.substr(0,newPath.lastIndexOf('?'));        
        var image = document.getElementById('profAvtarImg');
        image.src = imgPath;
        uploadImage(imgPath,'profile');
    }, function fail () {

    }, imageURI, { quality: 100, targetWidth: 500, targetHeight: 500 })

}

function onFail(message) {    
    alert('Failed because: ' + message);
    closePhotoOpt();
}

function onMSuccess(img){
    //alert(img)
    uploadImage(img, 'moreImg');
}

function uploadImage(imageURI, callFor) {
    $('#ajxLoading').show();
    closePhotoOpt();
    var options = new FileUploadOptions();
     options.fileKey = "file";
     options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
     //options.fileName = 'myImg.jpg';
     options.mimeType = "image/jpeg";
     
     var params = new Object();
     params.userId = localStorage.getItem('userId');
     params.callFor = callFor;
     options.params = params;
     options.chunkedMode = false;
     
     var ft = new FileTransfer();
     ft.upload(imageURI, THIS_DOMAIN+"includes/file-upload.php", function(result){        
        $('#ajxLoading').hide();
        var imgRes = JSON.parse(result.response);
        
        if(imgRes.stat == 'profile'){
            localStorage.setItem('userAvtar', result.response);
        }else{
            getMoreImgForEdit();    
        }        
        checkLoginUser();

     }, function(error){
        alert(JSON.stringify(error));
     }, options);
}

function removeImage(imgId){
    closePhotoOpt();
    $('#ajxLoading').show();
    $.ajax({
        type: "POST",
        url: THIS_DOMAIN+"includes/removeImage.php",
        data: {userId:localStorage.getItem('userId'), imgId:imgId},
        success: function(res)
        {
            console.log(res)
            getMoreImgForEdit();
            $('#ajxLoading').hide();
            
        },
        dataType: 'html',       
    });
}

function openNav() {
    //document.getElementById("mySidenav").style.width = "300px";
    $('#mySidenav').addClass('opnSidenv');
    $('.opabg').show();
}

function closeNav() {
    $('.opabg').hide();
    //document.getElementById("mySidenav").style.width = "0";
    $('#mySidenav').removeClass('opnSidenv');
}

function gotoAddPhoto(){
    closeNav();
    $.mobile.changePage( $("#addPhotosPage"),{ transition: "slide"});
}

function checkLoginUser() {
	var lguser;
    //localStorage.setItem('isPhoneVerify',succ.isPhoneVerify);
    //alert(localStorage.getItem('isPhoneVerify'))
	if (localStorage.getItem('userId') > 0) {		
        if(localStorage.getItem('isPhoneVerify') == "0"){
            //alert(localStorage.getItem('isPhoneVerify'))
            $( document ).ready(function() {
                $.mobile.changePage( $("#verifyPhone"),{ transition: "fade"});
            })
        }
		var lgUM = localStorage.getItem('fullName');        
        lgUM = lgUM.split(' ')[0];

		//alert(lgUM)
        lguser = '<div class="barLeft"><a href="#" onclick="gotoAddPhoto()">';
        if(localStorage.getItem('userAvtar') != ""){
            lguser += '<img src="'+THIS_DOMAIN+'userImages/'+localStorage.getItem('userAvtar')+'">';
        }else{
            lguser += '<img src="img/'+localStorage.getItem('gender')+'.webp">';
        }
        lguser +='</a></div>';
        lguser +='<div class="barRight"><div class="welMem">Hi, '+lgUM+'</div><div class="welPhon">'+localStorage.getItem('profileId')+'</div><div class="welPhon">Membership - '+localStorage.getItem('payStatus')+'</div></div><div class="clearfix"></div>';
        $('.menuTop').html(lguser);
		
        $('.beforeLogin').css('display','none');
        $('.afterLogin, #showEdit').css('display','block');
	}else {	
        lguser = '<div class="barLeft"><img src="img/logo.png"></div><div class="barRight"><div class="welMem">Hi, Member</div><div class="welPhon">XXXXXXXXXX</div><div class="welPhon">Membership - Free</div></div><div class="clearfix"></div>';	

        $('.menuTop').html(lguser);
		$('.beforeLogin').css('display','block');
        $('.afterLogin,#showEdit').css('display','none');
	}
}

function getHomePageMatches(clfr){
    $('#isHombusy').val('yes');
    var homPgNm;
    if (clfr != "loadmore") {
        $('#matchList').html('');
        $('#homPgNm').val(1);
        homPgNm = $('#homPgNm').val();
    }else {
        homPgNm = Number($('#homPgNm').val()) + 1;
        $('#homPgNm').val(homPgNm);    
    }
    var userId = localStorage.getItem('userId');        
    var urGender = localStorage.getItem('gender');
    var postStr = "";
    
    $.ajax({
        type: "POST",
        url: THIS_DOMAIN+"includes/getHomePageMatches.php",
        data: {pg:homPgNm, userId:userId, gender:urGender, callFor:'get'},
        success: function(res)
        {
            //console.log(res)
            var matchStr = '';
            matchStr = getListString(res);


            $('#ajxLoading').hide();
            $('.lmLoding').hide();
            if (clfr != "loadmore") {           
                $('#matchList').html(matchStr);                
            }else {             
                $('#matchList').append(matchStr);                
            }
            $('#isHombusy').val('no');
        },
        dataType: 'json',       
    });
}//

function getSearchByName(clfr)
{
    $('.card').removeClass('flipped');
    $('#isSerBusy').val('yes');    
    var serPgNm;
    

    if (clfr != "loadmore") {
        $('#ajxLoading').show();
        $('#userSearch').html('');
        $('#serPgNm').val(1);
        serPgNm = $('#serPgNm').val();
    }else {
        serPgNm = Number($('#serPgNm').val()) + 1;
        $('#serPgNm').val(serPgNm);    
    }

    var name = $.trim($('#sq').val());
    var serhData = $('form#advSearchFrm').serialize();
    var urGender = localStorage.getItem('gender');
    var userId = localStorage.getItem('userId');  
    serhData += '&sername='+name+'&gender='+urGender+'&pg='+serPgNm+'&userId='+userId;
    console.log(serhData);

    $.ajax({
        type: "POST",
        url: THIS_DOMAIN+"includes/getSearchResult.php",
        data: serhData,
        dataType: 'json',
        success: function(res)
        {
            //console.log(res);
            var serSrt = getListString(res);
            
            if (clfr != "loadmore") {           
                $('#userSearch').html(serSrt);                
            }else {             
                $('#userSearch').append(serSrt);                
            }

            $('#isSerBusy').val('no');
            $('#ajxLoading').hide();
        }
    });        
}

function getListString(res){

    var matchStr = '';
    $.each( res, function( key, val ) {
        matchStr += '<div class="card listCard"><div class="row cartPadd viewProfile" data-id="'+val.userId+'"><div class="col-4 listAvtar">';
        if(val.image == ''){
            matchStr += '<img src="img/'+val.gender+'.webp">';
        }else{
            matchStr += '<img src="'+THIS_DOMAIN+'userImages/'+val.folder+'/'+val.image+'">'
        }
        matchStr += '</div><div class="col-7 listBio">';
        matchStr += '<div>'+val.profileId+'</div><div><strong>'+val.name+'</strong></div><div>'+val.age+' yrs, '+val.height+', '+val.maritalStats+', ';
        if(val.city != ""){
            matchStr += val.city+', ';
        }
        if(val.state != ""){
            matchStr += val.state+', ';
        }

        matchStr += 'India</div>';
        matchStr += '</div></div>';
        var shrttxt = 'Shortlist';
        if(val.shrt == '1')
            shrttxt = 'Shortlisted';
        matchStr += '<div class="cartListOpt"><div class="row"><div class="col-4" id="shortlist-'+val.userId+'" onclick="shortlist('+val.userId+')"><u><i class="fa fa-heart" aria-hidden="true"></i></u> <span>'+shrttxt+'</span></div><div class="col-3"><i class="fa fa-eye" aria-hidden="true"></i> 5 hrs ago</div><div class="col-5 text-right"><i class="fa fa-paper-plane" aria-hidden="true"></i> Send Interest</div></div></div>';
        matchStr += '</div>';
    })

    return matchStr;
}

function resendVerifyCode(){
    var userId = localStorage.getItem('userId');
    $('#respVeriMsg').html('<i class="fa fa-spinner fa-spin fa-pulse"></i>');    
    $.ajax({
        type: "POST",
        url: THIS_DOMAIN+"includes/resendVerifyCode.php",
        data: {userId:userId},
        success: function(res)
        {
            console.log(res)
            if(res.return){
                $('#respVeriMsg').html(res.message[0]);
            }else{
                $('#respVeriMsg').html('Erro in message sent');
            }
            
        },
        dataType: 'json',       
    });    
}

function shortlist(recvId){    
    var userId = localStorage.getItem('userId');
    $('#shortlist-'+recvId+' u').html('<i class="fa fa-spinner fa-pulse"></i>');
    $.ajax({
        type: "POST",
        url: THIS_DOMAIN+"includes/shortlist.php",
        data: {userId:userId, recvId:recvId},
        success: function(res)
        {
            //console.log(res)
            $('#shortlist-'+recvId+' u').html('<i class="fa fa-heart"></i>');
            $('#shortlist-'+recvId+' span').html(res.msg);
        },
        dataType: 'json',       
    });    
}

function sendInterest(recvId){    
    //alert(uId);
}

function backKeyDown(){    
    if($.mobile.activePage.is('#homePage')){
        /* 
         Event preventDefault/stopPropagation not required as adding backbutton
          listener itself override the default behaviour. Refer below PhoneGap link.
        */
        //e.preventDefault();
        navigator.app.exitApp();
    }
    else {
        navigator.app.backHistory()
    }
}

(function(){

      var parallax = document.querySelector(".profAvtarBg"),
          speed = 0.5;

      window.onscroll = function(){
        var windowYOffset = window.pageYOffset;
        var elBackgrounPos = "50% " + (windowYOffset * speed) + "px";
        $('.profAvtarBg').css({'background-position':elBackgrounPos});

        var scroll = $(window).scrollTop();        
        if(scroll > 350){
            $('.profBrifFix').css({'opacity':'1'});
        }else{
            $('.profBrifFix').css({'opacity':'0'});
        }
            
      };

})();
