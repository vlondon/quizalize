function submitForm() {
    $.ajax({
        url: "/quizHelp",
        method: "post",
        success: function(data, textstatus, jqXHR){
            $('#helpForm').slideUp();
            $("#helpSent").slideDown();
        },
        error: function(){
            console.log("Error Posting Form details");
            },
            data: {
                name: $('#ename').val(),
                email: $('#email').val(),
                message: $('#message').val()
            }
            }
        );
    return false;
}
function ask2(type) {
    $('html, body').animate({
        scrollTop: $(type).offset().top
        }, 2000);
}


function ask(type) {
    if (type === "demo") {
        $("#message").val("I want a demo at my school");
    }
    else if (type === "question") {
        $("#message").val("");
    }
    else if (type === "order") {
        $("#message").val("I would like an information pack sent to my school");
    }
    else if (type === "wholeschool") {
        $("#message").val("I would like to sign up to the whole school package");
    }
    else if (type === "quiz-day") {
        $("#message").val("I would like to ask about a Quizalize day at my school");
    }
    else if (type === "cpd") {
        $("#message").val("I would like to ask about CPD training at my school");
    }
    else if (type === "referral") {
        $("#message").val("I would like to join the Quizalize referral program");
    }
    ask2("#sendForm");
}
