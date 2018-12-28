/**
 * Created by Tiago on 19/11/18.
 */
hideLoader();


function hideLoader() {
    setTimeout(function () {
        document.getElementById("loader").setAttribute("class","loader loader-not-show");
    }, 1000);
}
function showLoader() {
    document.getElementById("loader").setAttribute("class","loader loader-show");
}