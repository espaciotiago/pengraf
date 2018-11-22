/**
 * Created by Tiago on 1/11/18.
 */
/**--------------------------------------------------------------------------------------------------------------------
 * Actions of the elements on the dragin and dropping zone
 --------------------------------------------------------------------------------------------------------------------*/
var items = 0;
var showing = false;
var testBlockSelected = 0;


/**
 * TODO To test only - Set the selction block
 */
function clicTestItem1() {
    testBlockSelected = 1;
}
function clicTestItem2() {
    testBlockSelected = 2;
}

/**
 * Removes an item given its element id
 */
function removeItem(id) {
    console.log("Removing ...", id.id);
    id.remove();
}
/**
 * When click on a item and show the details
 */
function clickOnItem() {
    console.log("OnCLick");
}

/**--------------------------------------------------------------------------------------------------------------------
 * For Dragging and dropping
 --------------------------------------------------------------------------------------------------------------------*/
// target elements with the "draggable" class
interact('.draggable')
    .draggable({
        // enable inertial throwing
        inertia: true,
        // keep the element within the area of it's parent
        restrict: {
            restriction: "parent",
            endOnly: true,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        // enable autoScroll
        autoScroll: true,

        // call this function on every dragmove event
        onmove: dragMoveListener,
        // call this function on every dragend event
        onend: function (event) {
            var target = event.target,
                // keep the dragged position in the data-x/data-y attributes
                x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            //X and y are the displacement pixels so, the new position are: oldX + x and oldY + y
            //console.log("PosX",x);
            //console.log("PosY",x);
            //addItem(140+x,100+y);
            //Get the target DOM id
            console.log("Target",target.id);
            showLoader();
            hideLoader();
        }
    });

function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
        target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

// this is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;

/**--------------------------------------------------------------------------------------------------------------------
 * For removing items from the DOM
 --------------------------------------------------------------------------------------------------------------------*/
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

function showPics(id) {
    if(showing){
        document.getElementById(id).setAttribute("class","row inactive");
        //document.getElementById(id+"_eye").setAttribute("class","row fas fa-eye fa-sm");
    }else{
        document.getElementById(id).setAttribute("class","row active");
        //document.getElementById(id+"_eye").setAttribute("class","row fas fa-eye-slash fa-sm");
    }
    showing = !showing;
}
