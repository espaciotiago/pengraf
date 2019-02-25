var app = angular.module("pengrafAppAdmin", []);

//----------------------------------------------------------------------------------------------------------------------
// Login Controller
//----------------------------------------------------------------------------------------------------------------------
app.controller("LoginControlelr",function ($scope,$http) {
    $scope.loading = false;

    $scope.initLogin = function(){
        getSession();
    };

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
    // Actions
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

//----------------------------------------------------------------------------------------------------------------------
// User Controller
//----------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------
// Defaul block Controller
//----------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------
// Default zone Controller
//----------------------------------------------------------------------------------------------------------------------