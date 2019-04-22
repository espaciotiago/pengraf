var app = angular.module("pengrafAppAdmin", []);

/**
 * Return the date in a simple format dd/MM/yyyy HH:mm:ss
 * @param date
 * @returns {string}
 */
function formatDateSimple(date) {
    var dd = date.getDate();
    var mm = date.getMonth()+1; //January is 0!
    var yyyy = date.getFullYear();
    var hh = date.getHours();
    var MM = date.getMinutes();
    var ss = date.getSeconds();

    if(dd<10) {
        dd = '0'+dd
    }

    if(mm<10) {
        mm = '0'+mm
    }

    if(MM<10){
        MM = '0'+MM
    }

    var datefor  = dd + '-' + mm + '-' + yyyy + ' ' + hh + ':' + MM + ':' + ss;
    //var datefor  = dd + "/" + mm + "/" + yyyy;
    //var datefor  = yyyy + "-" + mm + "-" + dd;
    return datefor;
}

/**
 * Gets the actual date in format
 * @returns {string}
 */
function getToday(){
    let todayDate = new Date();
    return formatDateSimple(todayDate);
}

/**
 * Reads an uploaded image and gets the base 64
 * @param input
 */
function readURLZone(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var scope = angular.element($("#zoneForm")).scope();
            scope.safeApply(function(){
                scope.addImageToDefaultZoneCreation(e.target.result)
            });
        };
        reader.readAsDataURL(input.files[0]);
    }
}

/**
 * Reads an uploaded image and gets the base 64
 * @param input
 */
function readURLBlock(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var scope = angular.element($("#blockForm")).scope();
            scope.safeApply(function(){
                scope.addImageToDefaultBlockCreation(e.target.result)
            });
        };
        reader.readAsDataURL(input.files[0]);
    }
}

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
    $scope.zoneImageToSend = "";
    $scope.blockImageToSend = "";
    $scope.cias = [];
    $scope.selectedCia = {};
    $scope.selectedUserType = {name:"Tipo de usuario",id:0};

    /**
     * Safe apply
     * @param fn
     */
    $scope.safeApply = function( fn ) {
        var phase = this.$root.$$phase;
        if(phase == '$apply' || phase == '$digest') {
            if(fn) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

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

    /**
     * Sets the selected cia
     * @param index
     */
    $scope.setSelectedCia = function (index) {
        $scope.selectedCia = $scope.cias[index];
    };
    /**
     * Sets the selected user type
     * @param index
     */
    $scope.setSelectedUserType = function (type) {
        if(type == 1){
            $scope.selectedUserType = {name:"Administrador",id:1}
        }else{
            $scope.selectedUserType = {name:"Usuario",id:2}
        }
    };
    /**
     * Whe save buttons selected
     */
    $scope.sendCia = function () {
        if($scope.nameCia && $scope.nameCia != ""
            && $scope.addressCia && $scope.addressCia != ""
            && $scope.phoneCia && $scope.phoneCia != "") {
            createCia($scope.phoneCia,$scope.addressCia,$scope.nameCia)
        }else{
            alertify.error("Debe completar todos los campos para continuar");
        }
    };
    $scope.sendUser = function () {
        if($scope.selectedCia != {}
            && $scope.selectedUserType.id != 0
            && $scope.nameUser && $scope.nameUser != ""
            && $scope.lastnameUser && $scope.lastnameUser != ""
            && $scope.mailUser && $scope.mailUser != ""
            && $scope.usernameUser && $scope.usernameUser != ""
            && $scope.phoneUser && $scope.phoneUser != ""
            && $scope.passwordUser && $scope.passwordUser != "") {
            createUser($scope.nameUser,$scope.lastnameUser,$scope.mailUser,$scope.passwordUser,
                $scope.usernameUser,$scope.phoneUser,$scope.selectedUserType.id,$scope.selectedCia.PK_EMPRESA);
        }else{
            alertify.error("Debe completar todos los campos para continuar");
        }
    };
    $scope.sendBlock = function () {
        if($scope.nameBlock && $scope.nameBlock != ""
            && $scope.descBlock && $scope.descBlock != ""
            && $scope.blockImageToSend && $scope.blockImageToSend != "") {
            createBlock($scope.nameBlock,$scope.descBlock,$scope.blockImageToSend,$scope.user.username,getToday(),$scope.selectedCia.PK_EMPRESA)
        }else{
            alertify.error("Debe completar todos los campos para continuar");
        }
    };
    $scope.sendZone = function () {
        if($scope.nameZone && $scope.nameZone != ""
            && $scope.descZone && $scope.descZone != ""
            && $scope.typeZone && $scope.typeZone != ""
            && $scope.zoneImageToSend && $scope.zoneImageToSend != "") {
            createZone($scope.nameZone,$scope.descZone,$scope.zoneImageToSend,$scope.user.username,getToday(),$scope.selectedCia.PK_EMPRESA,$scope.typeZone)
        }else{
            alertify.error("Debe completar todos los campos para continuar");
        }
    };
    // -----------------------------------------------------------------------------------------------------------------
    // Extra functions
    // -----------------------------------------------------------------------------------------------------------------
    /**
     * Send the zone information to the server
     */
    function createZone(nombre, descripcion, imagen, nombreCreador, fechaUpdate, FK_ID_EMPRESA, tipo) {
        $scope.loading = true;
        //Prepare the request
        let data = {
            descripcion: descripcion,
            tipo: tipo,
            nombreZona: nombre,
            nombreCreador: nombreCreador,
            urlRutaImagen: imagen,
            FK_ID_EMPRESA: FK_ID_EMPRESA
        };
        let url = "/pengraf/v1/api/defaultzonas/";
        let req = {
            method: 'POST',
            url: url,
            data: data
        };
        //Send the request
        $http(req).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            let success = response.data.ans;
            console.log(response.data);
            if(success){
                let body = response.data.body;
                clearZoneForm();
            }else{
                alertify.error(response.data.error);
            }
            $scope.loading = false;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log("Error",response);
            alertify.error(response.data);
        });

    }
    /**
     * Send the block information to the server
     */
    function createBlock(nombre, descripcion, imagen, nombreCreador, fechaUpdate, FK_ID_EMPRESA) {
        $scope.loading = true;
        //Prepare the request
        let data = {
            nombre: nombre,
            descripcion: descripcion,
            rutaImage: imagen,
            nombreCreador: nombreCreador,
            fechaUpdate: fechaUpdate,
            FK_ID_EMPRESA: FK_ID_EMPRESA
        };
        let url = "/pengraf/v1/api/defaultbloques/";
        let req = {
            method: 'POST',
            url: url,
            data: data
        };
        //Send the request
        $http(req).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            let success = response.data.ans;
            console.log(response.data);
            if(success){
                let body = response.data.body;
                clearBlockForm();
            }else{
                //alertify.error(response.data.error);
            }
            $scope.loading = false;
            clearBlockForm();
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log("Error",response);
            alertify.error(response.data);
        });

    }
    /**
     * Send the user information to the server
     */
    function createUser(nombre,apellido,correo,password,username,telefono,profile,FK_ID_EMPRESA) {
        $scope.loading = true;
        let data = {
            nombre: nombre,
            apellido: apellido,
            correo: correo,
            password: password,
            username: username,
            telefono: telefono,
            profile: profile,
            FK_ID_EMPRESA: FK_ID_EMPRESA
        };
        let url = "/pengraf/v1/api/usuarios/";
        let req = {
            method: 'POST',
            url: url,
            //headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            data: data
        };

        $http(req).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            let success = response.data.ans;
            if(success){
                let body = response.data.body;
                clearUserForm();
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
     * Send and create
     */
    function createCia(telefono,direccion,nombre) {
        $scope.loading = true;
        //Get the initial areas data
        let url = "/pengraf/v1/api/empresas/";
        let req = {
            method: 'POST',
            url: url,
            //headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            data: {
                telefono: telefono,
                direccion: direccion,
                nombre: nombre
            }
        };

        $http(req).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            let success = response.data.ans;
            if(success){
                let body = response.data.body;
                //TODO Create the default blocks quemados
                clearCiaForm();
                getCias()
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
     *
     */
    function getCias() {
        $scope.loading = true;
        //Parameters of the request
        let url = "/pengraf/v1/api/empresas/all";
        let req = {
            method: 'POST',
            url: url,
        };
        $scope.cias = [];
        $http(req).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            let success = response.data.ans;
            if(success){
                let body = response.data.body;
                body.forEach(function (cia) {
                   let ciaToCreate = {
                       PK_EMPRESA: cia.PK_EMPRESA,
                       fechaCreacion: cia.fechaCreacion,
                       telefono: cia.telefono,
                       direccion: cia.direccion,
                       nombre: cia.nombre
                   }
                   $scope.cias.push(ciaToCreate);
                });
                if($scope.cias.length > 0){
                    $scope.selectedCia = $scope.cias[0];
                }
            }else{
                alertify.error(response.data.ans);
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
                getCias()
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

    /**
     * Adds an image to the array of images for creation of a new pending
     * @param image
     */
    $scope.addImageToDefaultZoneCreation = function (image) {
        if($scope.zoneImageToSend == "") {
            $scope.zoneImageToSend = image;
        }else{
            alertify.warning("Solo se puede adjuntar 1 archivo");
        }
    };

    /**
     * Adds an image to the array of images for creation of a new pending
     * @param image
     */
    $scope.addImageToDefaultBlockCreation = function (image) {
        if($scope.blockImageToSend == "") {
            $scope.blockImageToSend = image;
        }else{
            alertify.warning("Solo se puede adjuntar 1 archivo");
        }
    };

    /**
     * Clear forms
     */
    function clearCiaForm() {
        $scope.nameCia = "";
        $scope.addressCia = "";
        $scope.phoneCia = "";
    }
    function clearUserForm() {
        $scope.selectedUserType = {name:"Tipo de usuario",id:0};
        $scope.nameUser = "";
        $scope.lastnameUser = "";
        $scope.mailUser = "";
        $scope.usernameUser = "";
        $scope.phoneUser = "";
        $scope.passwordUser = "";
    }
    function clearBlockForm() {
        $scope.blockImageToSend = "";
        $scope.nameBlock = "";
        $scope.descBlock = "";
    }
    function clearZoneForm() {
        $scope.zoneImageToSend = "";
        $scope.nameZone = "";
        $scope.descZone = "";
        $scope.typeZone = "";
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