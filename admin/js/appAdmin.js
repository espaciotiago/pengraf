var app = angular.module("pengrafAppAdmin", []);

//----------------------------------------------------------------------------------------------------------------------
// Login Controller
//----------------------------------------------------------------------------------------------------------------------
app.controller("LoginControlelr",function ($scope,$http) {
    $scope.loading = false;

    $scope.initLogin = function(){
        getSession();
    };

    // -----------------------------------------------------------------------------------------------------------------
    // Actions
    // -----------------------------------------------------------------------------------------------------------------
    /**
     *
     */
    $scope.login = function () {
        //Validate fields
        if(!$scope.username || !$scope.password || $scope.username == "" || $scope.password == ""){
            alertify.error("Por favor llene todos los campos para continuar");
        }else{
            //Do the login request
            login($scope.username,$scope.password);
        }
    };

    // -----------------------------------------------------------------------------------------------------------------
    // Extra functions
    // -----------------------------------------------------------------------------------------------------------------
    /**
     * Do the login request
     * @param username
     * @param password
     */
    function login(username,password) {
        $scope.loading = true;
        //Get the initial areas data
        let url = "/pengraf/v1/api/login";
        let req = {
            method: 'POST',
            url: url,
            //headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            data: {
                userid: username,
                password: password
            }
        };

        $http(req).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            let success = response.data.ans;
            if(success){
                let body = response.data.body;
                console.log(body);
                if(body.profile == 3){
                    $(location).attr('href', './admin.html');
                }else{
                    alertify.error("Este usuario no tiene permisos de superadministrador");
                    closeSession();
                }
            }else{
                alertify.error(response.data.error);
            }
            $scope.loading = false;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            alertify.error(response.data);
        });
    }

    /**
     * Get the session
     */
    function getSession(){
        $scope.loading = true;
        //Parameters of the request
        let url = "/pengraf/v1/api/session/";
        let req = {
            method: 'GET',
            url: url,
        };
        $http(req).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            let success = response.data.ans;
            if(success){
                let body = response.data.body;
                $scope.user = {
                    id: body.PK_USUARIO,
                    id_cia: body.FK_ID_EMPRESA,
                    profile: body.PROFILE,
                    username: body.USERNAME,
                    name: body.NOMBRE,
                    lastname: body.APELLIDO,
                    mail: body.CORREO,
                    phone: body.TELEFONO,
                    token: "thejsontokengenerated1234567890"
                };
                $(location).attr('href', './admin.html');
            }
            $scope.loading = false;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log("ERROR",response);
            alertify.error("Lo sentimos, ha ocurrido un error en el servidor");
        });
    }

    /**
     * Close the session
     */
    function closeSession(){
        $scope.loading = true;
        //Parameters of the request
        let url = "/pengraf/v1/api/session/close";
        let req = {
            method: 'GET',
            url: url,
        };
        $http(req).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.loading = false;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log("ERROR",response);
            alertify.error("Lo sentimos, ha ocurrido un error en el servidor");
        });
    }
});
//----------------------------------------------------------------------------------------------------------------------
// Cia Controller
//----------------------------------------------------------------------------------------------------------------------
app.controller("DashboardControlelr",function ($scope,$http) {
    $scope.loading = false;

    $scope.initDashboard = function () {
        getSession();
    };


    // -----------------------------------------------------------------------------------------------------------------
    // Actions
    // -----------------------------------------------------------------------------------------------------------------
    /**
     * Form selection
     */
    $scope.showCiaForm = function(){
        $scope.loading = true;
        let ciaForm = document.getElementById("ciaForm");
        let ciaButton = document.getElementById("ciaBtn");
        let userForm = document.getElementById("userForm");
        let userButton = document.getElementById("userBtn");
        let blockForm = document.getElementById("blockForm");
        let blockButton = document.getElementById("blockBtn");
        let zoneForm = document.getElementById("zoneForm");
        let zoneButton = document.getElementById("zoneBtn");

        ciaForm.setAttribute("class","col-6 showing");
        userForm.setAttribute("class","col-6 notshowing");
        blockForm.setAttribute("class","col-6 notshowing");
        zoneForm.setAttribute("class","col-6 notshowing");

        ciaButton.setAttribute("class","btn btn-primary active col-12");
        userButton.setAttribute("class","btn btn-primary col-12");
        blockButton.setAttribute("class","btn btn-primary col-12");
        zoneButton.setAttribute("class","btn btn-primary col-12");
        $scope.loading = false;
    };
    $scope.showUserForm = function(){
        $scope.loading = true;
        let ciaForm = document.getElementById("ciaForm");
        let ciaButton = document.getElementById("ciaBtn");
        let userForm = document.getElementById("userForm");
        let userButton = document.getElementById("userBtn");
        let blockForm = document.getElementById("blockForm");
        let blockButton = document.getElementById("blockBtn");
        let zoneForm = document.getElementById("zoneForm");
        let zoneButton = document.getElementById("zoneBtn");

        ciaForm.setAttribute("class","col-6 notshowing");
        userForm.setAttribute("class","col-6 showing");
        blockForm.setAttribute("class","col-6 notshowing");
        zoneForm.setAttribute("class","col-6 notshowing");

        ciaButton.setAttribute("class","btn btn-primary col-12");
        userButton.setAttribute("class","btn btn-primary active col-12");
        blockButton.setAttribute("class","btn btn-primary col-12");
        zoneButton.setAttribute("class","btn btn-primary col-12");
        $scope.loading = false;
    };
    $scope.showBlockForm = function(){
        $scope.loading = true;
        let ciaForm = document.getElementById("ciaForm");
        let ciaButton = document.getElementById("ciaBtn");
        let userForm = document.getElementById("userForm");
        let userButton = document.getElementById("userBtn");
        let blockForm = document.getElementById("blockForm");
        let blockButton = document.getElementById("blockBtn");
        let zoneForm = document.getElementById("zoneForm");
        let zoneButton = document.getElementById("zoneBtn");

        ciaForm.setAttribute("class","col-6 notshowing");
        userForm.setAttribute("class","col-6 notshowing");
        blockForm.setAttribute("class","col-6 showing");
        zoneForm.setAttribute("class","col-6 notshowing");

        ciaButton.setAttribute("class","btn btn-primary col-12");
        userButton.setAttribute("class","btn btn-primary col-12");
        blockButton.setAttribute("class","btn btn-primary active col-12");
        zoneButton.setAttribute("class","btn btn-primary col-12");
        $scope.loading = false;
    };
    $scope.showZoneForm = function(){
        $scope.loading = true;
        let ciaForm = document.getElementById("ciaForm");
        let ciaButton = document.getElementById("ciaBtn");
        let userForm = document.getElementById("userForm");
        let userButton = document.getElementById("userBtn");
        let blockForm = document.getElementById("blockForm");
        let blockButton = document.getElementById("blockBtn");
        let zoneForm = document.getElementById("zoneForm");
        let zoneButton = document.getElementById("zoneBtn");

        ciaForm.setAttribute("class","col-6 notshowing");
        userForm.setAttribute("class","col-6 notshowing");
        blockForm.setAttribute("class","col-6 notshowing");
        zoneForm.setAttribute("class","col-6 showing");

        ciaButton.setAttribute("class","btn btn-primary col-12");
        userButton.setAttribute("class","btn btn-primary col-12");
        blockButton.setAttribute("class","btn btn-primary col-12");
        zoneButton.setAttribute("class","btn btn-primary active col-12");
        $scope.loading = false;
    };
    /**
     * Close the session
     */
    $scope.onCloseSession = function () {
        closeSession();
    };
    // -----------------------------------------------------------------------------------------------------------------
    // Extra functions
    // -----------------------------------------------------------------------------------------------------------------
    /**
     * Get the session
     */
    function getSession(){
        $scope.loading = true;
        //Parameters of the request
        let url = "/pengraf/v1/api/session/";
        let req = {
            method: 'GET',
            url: url,
        };
        $http(req).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            let success = response.data.ans;
            if(success){
                let body = response.data.body;
                $scope.user = {
                    id: body.PK_USUARIO,
                    id_cia: body.FK_ID_EMPRESA,
                    profile: body.PROFILE,
                    username: body.USERNAME,
                    name: body.NOMBRE,
                    lastname: body.APELLIDO,
                    mail: body.CORREO,
                    phone: body.TELEFONO,
                    token: "thejsontokengenerated1234567890"
                };
                //TODO Traer todas las compañias
            }else{
                $(location).attr('href', './index.html');
            }
            $scope.loading = false;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log("ERROR",response);
            alertify.error("Lo sentimos, ha ocurrido un error en el servidor");
        });
    }

    /**
     * Close the session
     */
    function closeSession(){
        $scope.loading = true;
        //Parameters of the request
        let url = "/pengraf/v1/api/session/close";
        let req = {
            method: 'GET',
            url: url,
        };
        $http(req).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.loading = false;
            $(location).attr('href', './index.html');
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log("ERROR",response);
            alertify.error("Lo sentimos, ha ocurrido un error en el servidor");
        });
    }
});
//----------------------------------------------------------------------------------------------------------------------
// User Controller
//----------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------
// Defaul block Controller
//----------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------
// Default zone Controller
//----------------------------------------------------------------------------------------------------------------------