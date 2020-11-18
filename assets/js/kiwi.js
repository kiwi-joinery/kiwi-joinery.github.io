
// Fade the "Kiwi Joinery" Header when scrolled down
$(window).scroll(function(){
    $("#kiwi-header .content").css("opacity", 1 - $(window).scrollTop() / 300);
});

// Change the navbar colour when scrolling
$(window).scroll(function(){
    const scroll = $(window).scrollTop();
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    const sel = $(".navbar");
    if (scroll > (0.5 * vh)) {
        sel.removeClass("navbar-dark");
        sel.addClass("navbar-light");
    } else {
        sel.removeClass("navbar-light");
        sel.addClass("navbar-dark");
    }
});

function fullscreenSpinner(enabled) {
    const sel = $("#kiwi-fullscreen-spinner");
    if (enabled) {
        sel.attr("hidden", false);
    } else {
        sel.attr("hidden", true);
    }
}

// Handle the contact form
$("#kiwi-contact-form").submit(function (e) {
    e.preventDefault();
    fullscreenSpinner(true);
    const alert = $("#kiwi-contact-form .alert");
    alert.attr("hidden", true);
    alert.removeClass("alert-success")
    alert.removeClass("alert-danger")
    $.post( API_URL + "/contact",  $("#kiwi-contact-form").serialize())
        .done(function() {
            alert.addClass("alert-success");
            alert.text("Thanks for contacting us!");
            $("#kiwi-contact-form").trigger("reset");
        })
        .fail(function(e) {
            alert.addClass("alert-danger")
            alert.html("Sorry an error has occurred (" + e.responseJSON.code + ").<br/>Please try emailing or phoning instead ");
        })
        .always(function() {
            alert.attr("hidden", false);
            fullscreenSpinner(false);
        });
});
