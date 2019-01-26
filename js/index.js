/**
 * Created by Tiago on 1/11/18.
 */
/**--------------------------------------------------------------------------------------------------------------------
 * Auxiliar methods
 --------------------------------------------------------------------------------------------------------------------*/
var fullScreen = false;
function setFullScreen() {
    let right = document.getElementById("right");
    let center = document.getElementById("center");
    let left = document.getElementById("left");

    if(fullScreen){
        left.setAttribute("class","col-2 sidebar not-fullscreen");
        right.setAttribute("class","col-2 sidebar");
    }else{
        left.setAttribute("class","fullscreen sidebar");
        right.setAttribute("class","col-4 sidebar");
    }
    fullScreen = !fullScreen;
}


/**--------------------------------------------------------------------------------------------------------------------
 * Actions of the elements on the draging and dropping zone
 --------------------------------------------------------------------------------------------------------------------*/
var items = 0;

/**
 * Removes an item given its element id
 */
function removeItem(id) {
    id.remove();
}
/**
 * When click on a item and show the details
 */
function clickOnItem(blockId) {
    var scope = angular.element($("#dropzone")).scope();
    scope.safeApply(function(){
        scope.getPendingsOfBlock(blockId.id.split("_")[1]);
    })
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
            var scope = angular.element($("#dropzone")).scope();
            scope.safeApply(function(){
                scope.onMoveItem(target,x,y);
            });
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
};
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
};
