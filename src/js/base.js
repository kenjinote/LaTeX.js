function getVariable(el, propertyName) {
    return String(getComputedStyle(el).getPropertyValue('--' + propertyName)).trim();
};

function processTheElements() {
    var thes = document.querySelectorAll('.the');
    for (var i = 0; i < thes.length; i++) {
        var v = thes[i].getAttribute('display-var');
        thes[i].textContent = getVariable(thes[i], v);
    }
}

function offsetTop(el) {
    var doc, docEl, rect, win;

    // return zero for disconnected and hidden (display: none) elements, IE <= 11 only
    // running getBoundingClientRect() on a disconnected node in IE throws an error
    if ( !el.getClientRects().length ) {
        return 0;
    }

    rect = el.getBoundingClientRect();

    doc = el.ownerDocument;
    docEl = doc.documentElement;
    win = doc.defaultView;

    return rect.top + win.pageYOffset - docEl.clientTop;
}


function positionMarginpars() {
    var mpars = document.querySelectorAll('.marginpar > div');
    var prevBottom = 0;

    mpars.forEach(function(mpar) {
        var mpref = document.querySelector('.body #marginref-' + mpar.id);
        var top = offsetTop(mpref);
        mpar.style.marginTop = top - prevBottom;
        prevBottom = top - prevBottom + mpar.offsetHeight
    });
}



// don't call resize event handlers too often
var optimizedResize = (function() {
    var callbacks = [],
        running = false;

    // fired on resize event
    function resize() {
        if (!running) {
            running = true;

            if (window.requestAnimationFrame) {
                window.requestAnimationFrame(runCallbacks);
            } else {
                setTimeout(runCallbacks, 66);
            }
        }
    }

    // run the actual callbacks
    function runCallbacks() {
        callbacks.forEach(function(callback) { callback(); });
        running = false;
    }

    // adds callback to loop
    function addCallback(callback) {
        if (callback) {
            callbacks.push(callback);
        }
    }

    return {
        // public method to add additional callback
        add: function(callback) {
            if (!callbacks.length) {
                window.addEventListener('resize', resize);
            }
            addCallback(callback);
        }
    }
}());


// setup event listeners

function completed() {
	document.removeEventListener("DOMContentLoaded", completed);
	window.removeEventListener("load", positionMarginpars);

    var observer = new MutationObserver(function() {
        processTheElements();
        positionMarginpars();
    });

    observer.observe(document, { attributes: true, childList: true, characterData: true, subtree: true });

    // add resize event listener
    optimizedResize.add(positionMarginpars);

    processTheElements();
    positionMarginpars();
}

document.addEventListener("DOMContentLoaded", completed);
window.addEventListener("load", completed);
