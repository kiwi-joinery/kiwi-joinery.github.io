
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

$( document ).ready(function() {
    $.get( API_URL + "/gallery/list")
        .done(function(r) {
            displayGallery(r);
        })
        .fail(function(e) {
            const alert = $("#portfolio .alert");
            alert.text("An error occurred loading the portfolio. (" + e.responseJSON.code + ")");
            alert.attr("hidden", false);
        })
        .always(function() {
            $("#portfolio .spinner-border").attr("hidden", true);
        });
});

const GALLERIES = [
    {
        code: "STAIRCASES",
        name: "Staircases"
    },
    {
        code: "WINDOWS",
        name: "Windows"
    },
    {
        code: "DOORS",
        name: "Doors"
    },
    {
        code: "OTHER",
        name: "Other"
    }
]

function srcset(files_list) {
    var s = "";
    for (f of files_list) {
        s = s + f.url + " " + f.width + "w" + ",\n";
    }
    return s;
}

function displayGallery(gallery) {
    for (g of GALLERIES) {
        const first_match = gallery[g.code][0];
        $("#kiwi-galleries").append(
            '<div class="col-md-6">\n' +
            '    <div data-gallery="'+ g.code +'" class="kiwi-gallery">\n' +
            '        <img alt="'+ g.name + " Gallery" +'" ' + 'class=""' +
            '           srcset="' + srcset(first_match.files) + '"' +
            '           src="'+ first_match.files[first_match.files.length - 1].url + '">\n' +
            '        <div class="kiwi-gallery-cover">\n' +
            '            <div class="content">\n' +
            '                <h4>' + g.name + '</h4>\n' +
            '                <p>Click for more...</p>\n' +
            '            </div>\n' +
            '        </div>\n' +
            '    </div>\n' +
            '</div>'
        )
    }
    $(".kiwi-gallery").click(function(e){
        console.log(e.currentTarget.getAttribute("data-gallery"))
    });
}


