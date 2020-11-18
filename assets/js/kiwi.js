
const API_URL = "https://api.kiwijoinerydevon.co.uk"

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
            var message = e.responseJSON ? e.responseJSON.code : undefined;
            alert.addClass("alert-danger")
            alert.html("Sorry an error has occurred (" + message +
                ").<br/>Please try emailing or phoning instead ");
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
            var message = e.responseJSON ? e.responseJSON.code : undefined;
            alert.text("An error occurred loading the portfolio. (" + message + ")");
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
    var merged = [];
    var first_indexes = [];
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
        first_indexes[g.code] = merged.length;
        merged = merged.concat(gallery[g.code]);
    }
    $(".kiwi-gallery").click(function(e){
        let gallery = e.currentTarget.getAttribute("data-gallery");
        let index = first_indexes[gallery];
        launch_photoswipe(merged, index);
    });
}

function launch_photoswipe(images, index) {
    var pswpElement = document.querySelectorAll('.pswp')[0];
    var options = {
        index: index,
        closeOnScroll: false,
        closeOnVerticalDrag: false,
        pinchToClose: false,
        tapToClose: false,
        closeOnOutsideClick: false,
        history: false,
        preload: [1, 10],
    };
    var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, images, options);
    var realViewportWidth;
    var realViewportHeight;
    gallery.listen('beforeResize', function() {
        realViewportWidth = gallery.viewportSize.x * window.devicePixelRatio;
        realViewportHeight = gallery.viewportSize.y * window.devicePixelRatio;
        gallery.invalidateCurrItems();
    });
    gallery.listen('gettingData', function(index, item) {
        let file = closest_matching(item.files, realViewportWidth, realViewportHeight);
        item.src = file.url;
        item.w = file.width;
        item.h = file.height;
        item.title = item.description;
    });
    gallery.init();
}

function closest_matching(files, width, height) {
    let sorted_asc_width = files.sort(function (a, b) {
        return a.width > b.width;
    });
    let biggest_width_file = sorted_asc_width[sorted_asc_width.length - 1];
    let portrait = (biggest_width_file.height > biggest_width_file.width);

    if (portrait) {
        let sorted_asc_height = files.sort(function (a, b) {
            return a.height > b.height;
        });
        let bigger = sorted_asc_height.filter(function (x) {
            return x.height >= height;
        })[0];
        if (bigger !== undefined) {
            return bigger;
        } else {
            return sorted_asc_height[sorted_asc_height.length - 1];
        }
    } else {
        let bigger = sorted_asc_width.filter(function (x) {
            return x.width >= width;
        })[0];
        if (bigger !== undefined) {
            return bigger;
        } else {
            return sorted_asc_width[sorted_asc_width.length - 1];
        }
    }
}
