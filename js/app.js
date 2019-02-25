/**
 * Created by Tiago on 20/11/18.
 */

//Constants
let SECURITY = "fas fa-star";
let PROCESS = "fas fa-project-diagram";
let QUALITY = "fas fa-check-circle";
let GENERALS = "fas fa-circle";
let URL_PENDING_IMAGES = "fas fa-circle";
let IMAGE_FORMAT_JPG = "fas fa-circle";

/**
 * App module
 */
var app = angular.module("pengrafApp", []);

/**
 * Get the query string from url
 * @param query
 */
function parse_query_string(query) {
    var vars = query.split("&");
    var query_string = {};
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        var key = decodeURIComponent(pair[0]);
        var value = decodeURIComponent(pair[1]);
        // If first entry with this name
        if (typeof query_string[key] === "undefined") {
            query_string[key] = decodeURIComponent(value);
            // If second entry with this name
        } else if (typeof query_string[key] === "string") {
            var arr = [query_string[key], decodeURIComponent(value)];
            query_string[key] = arr;
            // If third or later entry with this name
        } else {
            query_string[key].push(decodeURIComponent(value));
        }
    }
    return query_string;
}

/**
 * Reads an uploaded image and gets the base 64
 * @param input
 */
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var scope = angular.element($("#newPendingModal")).scope();
            scope.safeApply(function(){
                scope.addImageToUploadForPending(e.target.result)
            });
        };
        reader.readAsDataURL(input.files[0]);
    }
}

/**
 * Reads an uploaded image and gets the base 64
 * @param input
 */
function readURLComplete(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var scope = angular.element($("#completePendingModal")).scope();
            scope.safeApply(function(){
                scope.addImageToUploadForComplete(e.target.result)
            });
        };
        reader.readAsDataURL(input.files[0]);
    }
}

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
 * Controller for the Login screen
 */
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
                $(location).attr('href', './areas.html');
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
                $(location).attr('href', './areas.html');
            }
            $scope.loading = false;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log("ERROR",response);
            alertify.error("Lo sentimos, ha ocurrido un error en el servidor");
        });
    }
});
/**
 * Controller for the Forget password screen
 */
//----------------------------------------------------------------------------------------------------------------------
// Forget password Controller
//----------------------------------------------------------------------------------------------------------------------

/**
 * Controller for the Area selection
 */
//----------------------------------------------------------------------------------------------------------------------
// Areas selection Controller
//----------------------------------------------------------------------------------------------------------------------
app.controller("AreasController",function ($scope,$http) {
    $scope.user = {};
    $scope.cia = {};
    $scope.loading = true;
    $scope.areas = [];
    $scope.nameNewArea= "";
    $scope.descriptionNewArea = "";

    /**
     * Initialization of the Areas section
     */
    $scope.initAreas = function () {
        //Get the session of the user
        getSession();
        //closeSession();
    };

    // -----------------------------------------------------------------------------------------------------------------
    // Actions
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Creates the new area
     */
    $scope.onCreateArea = function () {
        if($scope.nameNewArea != null && $scope.nameNewArea != "") {
            createArea($scope.user.username, $scope.user.id, $scope.nameNewArea, $scope.cia.id, $scope.descriptionNewArea);
        }else{
            alertify.error("Por favor llene todos los campos para continuar");
        }
    };

    /**
     * Click on cancel in the modal
     */
    $scope.onCancel = function(){
        resetFields();
    }

    /**
     * When an area is selected
     * @param area
     */
    $scope.clockOnArea = function (area) {
        $(location).attr('href', './dashboard.html?areaId='+area.id);
    };

    /**
     * Close the session
     */
    $scope.onCloseSession = function () {
        closeSession();
    };

    // -----------------------------------------------------------------------------------------------------------------
    // Functions
    // -----------------------------------------------------------------------------------------------------------------
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
                //Get the areas
                getAreas($scope.user.id_cia);
            }else{
                alertify.error(response.data.error);
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
     * Creates a new Area in BD
     * @param ownerName
     * @param ownerId
     * @param phone
     * @param address
     * @param name
     */
    function createArea(ownerName,ownerId,name, idCia, description) {
        $scope.loading = true;
        //Parameters of the request
        let data = {
            FK_ID_CREADOR: ownerId,
            FK_ID_EMPRESA: idCia,
            descripcion: description,
            nombre: name,
            nombreCreador: ownerName,
        };
        let url = "/pengraf/v1/api/areas/";
        let req = {
            method: 'POST',
            url: url,
            data: data
        };
        $http(req).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            let success = response.data.ans;
            if(success){
                let body = response.data.body;
            }else{
                alertify.error(response.data.error);
            }
            $scope.loading = false;
            $(location).attr('href', './areas.html');
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log("ERROR",response);
            alertify.error("Lo sentimos, ha ocurrido un error en el servidor");
        });
    }

    /**
     * reset and reload the intial data
     */
    function resetData() {
        resetFields();
        getAreas($scope.user.id_cia);
    }

    function resetFields() {
        $scope.nameNewArea= "";
        $scope.descriptionNewArea = "";
    }

    /**
     * Get the areas of the CIA
     * @param idCia
     */
    function getAreas(idCia) {
        //Get the initial areas data
        let url = "/pengraf/v1/api/areas/by_empresa";
        let req = {
            method: 'POST',
            url: url,
            //headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            data: { FK_ID_EMPRESA: $scope.user.id_cia}
        };

        $http(req).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            let success = response.data.ans;
            if(success){
                let body = response.data.body;
                body.forEach(function (area) {
                    let newArea = {
                        id: area.PK_AREA,
                        name: area.nombre,
                        description: area.descripcion
                    };
                    $scope.areas.push(newArea)
                });
                getCiaByid($scope.user.id_cia);
            }else{
                alertify.error(response.data.error);
            }
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            alertify.error(response.data);
        });
    }

    /**
     * Get the cia data
     * @param idCia
     */
    function getCiaByid(idCia){
        let url = "/pengraf/v1/api/empresas/"+idCia;
        let req = {
            method: 'GET',
            url: url,
            //headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        };
        $http(req).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            let success = response.data.ans;
            if(success){
                let body = response.data.body;
                $scope.cia = {
                    id: body.PK_EMPRESA,
                    phone: body.telefono,
                    address: body.direccion,
                    name: body.nombre
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
});

/**
 * Controller for the Dashboard screen
 */
//----------------------------------------------------------------------------------------------------------------------
// Dashboard Controller
//----------------------------------------------------------------------------------------------------------------------
app.controller("DashboardController",function ($scope,$http) {
    /**
     *  Variables definition / initialization
     */
    $scope.today = getToday();
    $scope.loading = true;
    $scope.minloader = false;
    $scope.pendingLoader = false;
    $scope.user = {};
    $scope.usersList = [];
    $scope.responsableSelectedText = "Asignado a...";
    $scope.responsableSelected = {};
    $scope.defaultBlocks = [];
    $scope.defaultZones = [];
    $scope.zones = [];
    $scope.selectedZone = {};
    $scope.blocks = [];
    $scope.selectedBlock = {name:"No hay bloque seleccionado"};
    $scope.pendings = [];
    $scope.zoneForCreation = {};
    $scope.blockForCreation = {};
    $scope.pendingForCreationTypeText = "Tipo de pendiente";
    $scope.pendingForCreationType = 0;
    $scope.pendingForCreationTypeImg = "";
    $scope.pendingForCreationImages = [];
    $scope.areaId;

    /**
     * Reset the prevalues for the creations of new objects
     */
    function resetPendingForCreation(){
        $scope.pendingForCreationTypeText = "Tipo de pendiente"
        $scope.pendingForCreationType = 0;
        $scope.pendingForCreationTypeImg = "";
        $scope.pendingForCreationImages = [];
    }
    function resetBlockForCreation(){
        $scope.blockForCreation = {};
    }
    function resetZoneForCreation(){
        $scope.blockForCreation = {};
    }

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

    /**
     * Initialization of the dashboard
     */
    $scope.initDashboard = function () {
        //Get the area id
        var query = window.location.search.substring(1);
        var qs = parse_query_string(query);
        $scope.areaId  = qs.areaId;

        if($scope.areaId) {
            //Get the session of the user
            getSession();
        }else{
            // Area needed
            $(location).attr('href', './index.html');
        }
    };
    // -----------------------------------------------------------------------------------------------------------------
    // Actions
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * When click on new modal buttons
     */
    $scope.onModalPendingClick = function(){
        $scope.today = getToday();
    };

    /**
     * When click on a zone
     * @param index
     */
    $scope.setSelectedZone = function(index){
        $scope.loading = true;
        if($scope.zones.length > 0) {
            removeBlocksFromZone($scope.selectedZone);
            $scope.selectedZone = $scope.zones[index];
            $scope.selectedZone.blocks.forEach(function (block) {
                addItemAlready(block.posx, block.posy, block, block.total_pendings);
            });
            if ($scope.selectedZone.blocks.length > 0) {
                $scope.selectedBlock = $scope.selectedZone.blocks[0];
                $scope.getPendingsOfBlock($scope.selectedBlock.id);
            }else {
                $scope.selectedBlock = {};
                $scope.pendings = [];
            }
        }
        $scope.loading = false;

    };

    /**
     * Whren clcik on Guardar nueva zona
     */
    $scope.createZone = function(){

        if(!$scope.zoneCreationName ||
            $scope.zoneCreationName == "" ||
            !$scope.zoneCreationDescription ||
            $scope.zoneCreationDescription == "" ||
            !$scope.zoneForCreation.id || $scope.zoneForCreation.id == "" ||
            !$scope.zoneForCreation.image || $scope.zoneForCreation.image == ""){
            alertify.error("Debe completar todos los campos para continuar")
        }else {
            createZone($scope.user.id,
                $scope.user.id_cia,
                $scope.zoneCreationDescription,
                $scope.zoneForCreation.id,
                $scope.zoneCreationName,
                $scope.user.username,
                $scope.zoneForCreation.image,
                $scope.areaId);
        }
    };

    /**
     * When a block is selected, it bring all the pendings data from the server and place it on the screen
     * @param block
     */
    $scope.getPendingsOfBlock = function(blockId){
        $scope.pendings = [];
        $scope.pendingLoader = true;
        var pos = searchBlockById(blockId);
        if(pos > -1){
            $scope.selectedBlock = $scope.selectedZone.blocks[pos];
            // Traer del API
            //Parameters of the request
            let data = {
                FK_ID_BLOQUE: $scope.selectedBlock.id,
                idusuario: $scope.user.id

            };

            let url = "http://pengraf.com.co/pengraf/v1/api/pendientes/by_bloque";
            let req = {
                method: 'POST',
                url: url,
                data:data
            };
            $http(req).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.pendings = [];
                let success = response.data.ans;
                if(success){
                    let body = response.data.body;
                    body.forEach(function (pen) {
                        var state_class = "";
                        var type_class = "";
                        switch (pen.estado) {
                            case "1":
                                state_class = "completed";
                                break;
                            case "2":
                                state_class = "caducated";
                                break;
                            case "3":
                                state_class = "onprocess";
                                break;
                        }

                        switch (pen.categoria) {
                            case "1":
                                type_class = SECURITY;
                                break;
                            case "2":
                                type_class = PROCESS;
                                break;
                            case "3":
                                type_class = QUALITY;
                                break;
                            case "4":
                                type_class = GENERALS;
                                break;
                        }
                        let pending = {
                            id: pen.PK_PENDIENTE,
                            state: pen.estado,
                            state_class: state_class,
                            responsable_id: pen.responsableID,
                            responsable_username: pen.responsableUserName,
                            owner_id: body.FK_ID_CREADOR,
                            owner_username: "",
                            name: pen.titulo,
                            description: pen.descripcion,
                            type: pen.categoria,
                            type_class: type_class,
                            end_date: pen.fechaLimite,
                            showing_pics: false,
                            photos:[]
                        };
                        let photos = pen.fotos;
                        photos.forEach(function (photo) {
                            let ph = {
                                image:photo.urlFoto
                            }
                            pending.photos.push(ph);
                        });
                        $scope.pendings.push(pending);
                    });
                }else{
                    console.log(response.data.error);
                    //alertify.error(response.data.error);
                }
                $scope.pendingLoader = false;
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log("ERROR",response);
                alertify.error("Lo sentimos, ha ocurrido un error en el servidor");
                $scope.pendingLoader = false;
            });


        }else{
            // Ha ocurrido un error, comuniquese con soporte
            console.log("Ha ocurrido un error: no se ha podido obtener el bloque seleccionado. Por favor comuniquese con soporte técnico");
        }
    };

    /**
     * When a item is moved, this method send the new position to the server for being updated
     * @param target
     * @param posX
     * @param posY
     */
    $scope.onMoveItem = function (target,posX,posY) {
        $scope.minloader = true;
        let blockPos = searchBlockById(target.id.split("_")[1]);
        let block = $scope.selectedZone.blocks[blockPos];
        if(block){
            let newX = Number(block.posx) + Number(posX);
            let newY = Number(block.posy) + Number(posY);
            let FK_ID_ZONA = $scope.selectedZone.id;
            let FK_ID_EMPRESA = $scope.user.id_cia;
            let FK_ID_CREADOR = $scope.user.id;
            let nombre = block.name;
            let descripcion = block.description;
            let rutaImage = block.image;
            let nombreCreador = $scope.user.name;
            let fechaUpdate = getToday();
            let FK_ID_AREA = $scope.areaId;
            let PK_BLOQUE = block.id;
            // Enviar el objeto al servidor para actualizar la info
            updateItem(FK_ID_ZONA,FK_ID_AREA,FK_ID_EMPRESA,FK_ID_CREADOR,nombre,descripcion,rutaImage,newX,newY,nombreCreador,fechaUpdate,PK_BLOQUE);
        }else{
            // Notificar que un error extraño ocurrio, favor comunicarse con soporte
            alertify.error("Ha ocurrido un error, el bloque seleccionado no puede ser actualizado." +
                "Por favor comuniquese con soporte tecnico para dar solución al error.")
        }
    };

    /**
     * When the pending type is selected
     */
    $scope.pendingTypeSelected = function (type) {
        switch (type) {
            case 1:
                $scope.pendingForCreationTypeText = "Seguridad"
                $scope.pendingForCreationType = 1
                $scope.pendingForCreationTypeImg = "fas fa-star"
                break
            case 2:
                $scope.pendingForCreationTypeText = "Procesos"
                $scope.pendingForCreationType = 2
                $scope.pendingForCreationTypeImg = "fas fa-project-diagram"
                break
            case 3:
                $scope.pendingForCreationTypeText = "Calidad"
                $scope.pendingForCreationType = 3
                $scope.pendingForCreationTypeImg = "fas fa-check-circle"
                break
            case 4:
                $scope.pendingForCreationTypeText = "Generales"
                $scope.pendingForCreationType = 4
                $scope.pendingForCreationTypeImg = "fas fa-circle"
                break
        }
    }

    /**
     * Adds an image to the array of images for creation of a new pending
     * @param image
     */
    $scope.addImageToUploadForPending = function (image) {
        if($scope.pendingForCreationImages.length<4) {
            $scope.pendingForCreationImages.push(image);
        }else{
            alertify.warning("Solo se pueden adjuntar 4 archivos");
        }
    };

    /**
     *
     * @param index
     */
    $scope.selectZoneType = function (index) {
        //Set the selected zone type
        $scope.zoneForCreation = $scope.defaultZones[index];
        //Unmark all the zonetypes
        $scope.defaultZones.forEach(function (zone) {
            document.getElementById(zone.id).setAttribute("class", "zone-type");
        });
        //Mark just the selected one
        document.getElementById($scope.zoneForCreation.id).setAttribute("class", "zone-type zone-type-selected");
    };

    /**
     *
     * @param index
     */
    $scope.selectBlockToAdd = function (index) {
        $scope.blockForCreation = $scope.defaultBlocks[index];
    };

    /**
     * When click on Guardar item o bloque
     */
    $scope.createItem = function () {
        let FK_ID_ZONA = $scope.selectedZone.id;
        let FK_ID_EMPRESA = $scope.user.id_cia;
        let FK_ID_CREADOR = $scope.user.id;
        let nombre = $scope.itemForCreationName;
        let descripcion = $scope.itemForCreationDescription;
        let rutaImage = $scope.blockForCreation.image;
        let nombreCreador = $scope.user.name;
        let fechaUpdate = getToday();
        let FK_ID_AREA = $scope.areaId;

        if(nombre && nombre != "" && descripcion && descripcion != "") {
            createItem(FK_ID_ZONA, FK_ID_AREA, FK_ID_EMPRESA, FK_ID_CREADOR, nombre, descripcion, rutaImage, nombreCreador, fechaUpdate);
        }else{
            alertify.error("Debe completar los campos para continuar");
        }
    };

    /**
     * When a responsable is selected when creating a new pending
     * @param index
     */
    $scope.onResponsableSelected = function (index) {
        if($scope.usersList.length > 0) {
            $scope.responsableSelected = $scope.usersList[index];
            $scope.responsableSelectedText = $scope.responsableSelected.name + " " + $scope.responsableSelected.lastname;
        }
    };

    /**
     * When the modal of new pending is closed
     */
    $scope.onModalPendingClose = function () {
        //TODO Reiniciar todos los campos y hacer lo mismo con todos los modales
        $scope.responsableSelected = {};
        $scope.responsableSelectedText = "Asignado a...";
        $scope.pendingTitleForCreation = "";
        $scope.pendingDescriptionForCreation = "";
        $scope.pendingEndDateForCreation = "";
        $scope.pendingForCreationType = 0;
        $scope.pendingForCreationImages = [];
        $scope.pendingForCreationTypeText = "Tipo de pendiente";
        $scope.pendingForCreationTypeImg = ""
    };

    /**
     * When click on save a new item
     */
    $scope.onCreatePending = function () {
        $scope.today = getToday();
        if ($scope.pendingTitleForCreation && $scope.pendingTitleForCreation != ""
            && $scope.pendingDescriptionForCreation && $scope.pendingDescriptionForCreation != ""
            && $scope.pendingEndDateForCreation && $scope.pendingEndDateForCreation != "" && $scope.pendingEndDateForCreation != "dd/mm/yyyy"
            && $scope.responsableSelected && $scope.responsableSelected.id && $scope.responsableSelected.id != ""
            && $scope.pendingForCreationType && $scope.pendingForCreationType != 0 && $scope.pendingForCreationType != ""){
            //Send the data to the server
            let fotos = [];
            $scope.pendingForCreationImages.forEach(function (image) {
               let pic = {
                   image: image
               };
               fotos.push(pic);
            });
            if($scope.areaId) {
                createPending($scope.selectedBlock.id, $scope.selectedZone.id, $scope.user.id,
                    $scope.today, $scope.pendingTitleForCreation, $scope.pendingDescriptionForCreation,
                    $scope.responsableSelected.username, $scope.responsableSelected.id, $scope.pendingForCreationType,
                    $scope.pendingEndDateForCreation, "", $scope.user.username, $scope.areaId, $scope.user.id_cia, fotos);
            }else{
                //Is from dashboard-pendings-mobile.html
                createPending($scope.selectedBlock.id, $scope.selectedBlock.id_zone, $scope.user.id,
                    $scope.today, $scope.pendingTitleForCreation, $scope.pendingDescriptionForCreation,
                    $scope.responsableSelected.username, $scope.responsableSelected.id, $scope.pendingForCreationType,
                    $scope.pendingEndDateForCreation, "", $scope.user.username, $scope.selectedBlock.id_area, $scope.user.id_cia, fotos);
            }
        }else{
            alertify.error("Debe completar todos los campos para continuar");
        }
    };

    /**
     * For mobile only
     * When a item is clicked on the list
     * @param index
     */
    $scope.onItemClicked = function (block) {
        $(location).attr('href', './dashboard-pendings-mobile.html?blockId='+block.id);
    };

    /**
     *
     */
    $scope.initPendingsMobile = function () {
        //Get the block id
        var query = window.location.search.substring(1);
        var qs = parse_query_string(query);
        //Get the selected block info of the block
        if(qs){
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
                    //Get the initial data
                    getBlockByIdFromServer(qs.blockId);
                    getUsersFromCia($scope.user.id_cia);
                }else{
                    alertify.error(response.data.error);
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
    };
    // -----------------------------------------------------------------------------------------------------------------
    // Extra functions
    // -----------------------------------------------------------------------------------------------------------------
    /**
     *
     * @param idBlock
     */
    function getPendingsOfBlock(idBlock) {
        $scope.loading = true;
        let data = {
            FK_ID_BLOQUE: idBlock,
            idusuario: $scope.user.id

        };

        let url = "http://pengraf.com.co/pengraf/v1/api/pendientes/by_bloque";
        let req = {
            method: 'POST',
            url: url,
            data:data
        };
        $http(req).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.pendings = [];
            let success = response.data.ans;
            if(success){
                let body = response.data.body;
                body.forEach(function (pen) {
                    var state_class = "";
                    var type_class = "";
                    switch (pen.estado) {
                        case "1":
                            state_class = "completed";
                            break;
                        case "2":
                            state_class = "caducated";
                            break;
                        case "3":
                            state_class = "onprocess";
                            break;
                    }

                    switch (pen.categoria) {
                        case "1":
                            type_class = SECURITY;
                            break;
                        case "2":
                            type_class = PROCESS;
                            break;
                        case "3":
                            type_class = QUALITY;
                            break;
                        case "4":
                            type_class = GENERALS;
                            break;
                    }
                    let pending = {
                        id: pen.PK_PENDIENTE,
                        state: pen.estado,
                        state_class: state_class,
                        responsable_id: pen.responsableID,
                        responsable_username: pen.responsableUserName,
                        owner_id: body.FK_ID_CREADOR,
                        owner_username: "",
                        name: pen.titulo,
                        description: pen.descripcion,
                        type: pen.categoria,
                        type_class: type_class,
                        end_date: pen.fechaLimite,
                        showing_pics: false,
                        photos:[]
                    };
                    let photos = pen.fotos;
                    photos.forEach(function (photo) {
                        let ph = {
                            image:photo.urlFoto
                        }
                        pending.photos.push(ph);
                    });
                    $scope.pendings.push(pending);
                });
            }else{
                console.log(response.data.error);
                //alertify.error(response.data.error);
            }
            $scope.loading = false;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log("ERROR",response);
            alertify.error("Lo sentimos, ha ocurrido un error en el servidor");
            $scope.loading = false;
        });
    }

    /**
     *
     * @param idBlock
     */
    function getBlockByIdFromServer(idBlock) {
        $scope.loading = true;
        //Parameters of the request
        let url = "http://pengraf.com.co/pengraf/v1/api/bloques/"+idBlock;
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
                //Get the pendings of the block
                $scope.selectedBlock = {
                    id: body.PK_BLOQUE,
                    id_area: body.FK_ID_AREA,
                    id_zone: body.FK_ID_ZONA,
                    type: 0,
                    posx: body.posx,
                    posy: body.posy,
                    name: body.nombre,
                    description: body.descripcion,
                    image: body.rutaImage,
                };
                getPendingsOfBlock($scope.selectedBlock.id);
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
     * Send the request for creation of a new pending
     * @param FK_ID_BLOQUE
     * @param FK_ID_ZONA
     * @param FK_ID_CREADOR
     * @param fechaUpdate
     * @param titulo
     * @param descripcion
     * @param responsableUserName
     * @param responsableID
     * @param categoria
     * @param fechaLimite
     * @param fechaCompletado
     * @param creadorUserName
     * @param FK_ID_AREA
     * @param FK_ID_EMPRESA
     * @param fotos
     */
    function createPending(FK_ID_BLOQUE,FK_ID_ZONA,FK_ID_CREADOR,fechaUpdate,titulo,descripcion,responsableUserName,
                           responsableID,categoria,fechaLimite,fechaCompletado,creadorUserName,FK_ID_AREA,FK_ID_EMPRESA,fotos) {
        if($scope.areaId) {
            $scope.pendingLoader = true;
        }else{
            $scope.loading = true;
        }
        //Parameters of the request
        let data = {
            FK_ID_BLOQUE: FK_ID_BLOQUE,
            FK_ID_ZONA: FK_ID_ZONA,
            FK_ID_CREADOR: FK_ID_CREADOR,
            fechaUpdate: fechaUpdate,
            titulo: titulo,
            descripcion: descripcion,
            responsableUserName: responsableUserName,
            responsableID: responsableID,
            categoria: categoria,
            fechaLimite: fechaLimite,
            fechaCompletado: fechaCompletado,
            creadorUserName: creadorUserName,
            FK_ID_AREA: FK_ID_AREA,
            FK_ID_EMPRESA: FK_ID_EMPRESA,
            fotos: fotos
        };
        let url = "http://pengraf.com.co/pengraf/v1/api/pendientes/";
        let req = {
            method: 'POST',
            url: url,
            data:data
        };
        $http(req).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            let success = response.data.ans;
            if(success){
                let body = response.data.body;
                //TODO Actualizar bloque por notificación
                $scope.onModalPendingClose();
                if($scope.areaId) {
                    $scope.getPendingsOfBlock($scope.selectedBlock.id);
                }else{
                    //Is from dashboard-pendings-mobile-.html
                    getPendingsOfBlock($scope.selectedBlock.id);
                }

            }else{
                alertify.error(response.data.error);
            }
            if($scope.areaId) {
                $scope.pendingLoader = false;
            }else{
                $scope.loading = false;
            }
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log("ERROR",response);
            alertify.error("Lo sentimos, ha ocurrido un error en el servidor");
        });
    }
    
    /**
     * Gets the users from the cia
     * @param idCia
     */
    function getUsersFromCia(idCia){
        $scope.loading = true;
        //Parameters of the request
        let data = {
            FK_ID_EMPRESA:idCia,
        };
        let url = "http://pengraf.com.co/pengraf/v1/api/usuarios/by_empresa";
        let req = {
            method: 'POST',
            url: url,
            data:data
        };
        $http(req).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            let success = response.data.ans;
            if(success){
                let body = response.data.body;
                body.forEach(function (user) {
                    let userForPush = {
                        id: user.PK_USUARIO,
                        lastname: user.apellido,
                        mail: user.correo,
                        name: user.nombre,
                        profile: user.profile,
                        phone: user.telefono,
                        username: user.username
                    };
                    $scope.usersList.push(userForPush);
                })
            }else{
                alertify.error(response.data.error);
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
     * Get session
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
                //Get the initial data
                getZonesByDefault($scope.user.id_cia);
                getBlockByDefault($scope.user.id_cia);
                getZonesByArea($scope.areaId);
                getUsersFromCia($scope.user.id_cia);
            }else{
                alertify.error(response.data.error);
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
     * Creates a new zone in DB
     * @param FK_ID_CREADOR
     * @param FK_ID_EMPRESA
     * @param descripcion
     * @param tipo
     * @param nombreZona
     * @param nombreCreador
     * @param urlRutaImagen
     * @param FK_ID_AREA
     */
    function createZone(FK_ID_CREADOR,FK_ID_EMPRESA,descripcion,tipo,nombreZona,nombreCreador,urlRutaImagen,FK_ID_AREA) {
        $scope.loading = true;
        //Parameters of the request
        let data = {
            FK_ID_CREADOR:FK_ID_CREADOR,
            FK_ID_EMPRESA:FK_ID_EMPRESA,
            descripcion:descripcion,
            tipo:tipo,
            nombreZona:nombreZona,
            nombreCreador:nombreCreador,
            urlRutaImagen:urlRutaImagen,
            FK_ID_AREA:FK_ID_AREA,
            posx:"20",
            posy:"20"
        };
        let url = "http://pengraf.com.co/pengraf/v1/api/zonas/";
        let req = {
            method: 'POST',
            url: url,
            data:data
        };

        $http(req).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            let success = response.data.ans;
            if(success){
                $(location).attr('href', './dashboard.html?areaId='+$scope.areaId);
            }else{
                alertify.error(response.data.error);
            }
            $scope.loading = true;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log("ERROR",response);
            alertify.error("Lo sentimos, ha ocurrido un error en el servidor");
        });
    }

    /**
     * Creates a new item in DB
     * @param FK_ID_ZONA
     * @param FK_ID_AREA
     * @param FK_ID_EMPRESA
     * @param FK_ID_CREADOR
     * @param nombre
     * @param descripcion
     * @param rutaImage
     * @param nombreCreador
     * @param fechaUpdate
     */
    function createItem(FK_ID_ZONA,FK_ID_AREA,FK_ID_EMPRESA,FK_ID_CREADOR,nombre,descripcion,rutaImage,nombreCreador,fechaUpdate) {
        $scope.loading = true;
        //Parameters of the request
        let data = {
            FK_ID_AREA:FK_ID_AREA,
            FK_ID_CREADOR:FK_ID_CREADOR,
            FK_ID_EMPRESA:FK_ID_EMPRESA,
            FK_ID_ZONA:FK_ID_ZONA,
            descripcion:descripcion,
            fechaUpdate:fechaUpdate,
            nombre:nombre,
            nombreCreador:nombreCreador,
            posx:"20",
            posy:"20",
            rutaImage:rutaImage,
        };

        let url = "http://pengraf.com.co/pengraf/v1/api/bloques/";
        let req = {
            method: 'POST',
            url: url,
            data:data
        };
        console.log("DATA",data);
        $http(req).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            console.log("Response",response);
            let success = response.data.ans;
            if(success){
                //TODO
            }else{
                alertify.error(response.data.error);
            }
            $scope.loading = true;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log("ERROR",response);
            alertify.error("Lo sentimos, ha ocurrido un error en el servidor");
        });
    }

    /**
     *
     * @param FK_ID_ZONA
     * @param FK_ID_AREA
     * @param FK_ID_EMPRESA
     * @param FK_ID_CREADOR
     * @param nombre
     * @param descripcion
     * @param rutaImage
     * @param posx
     * @param posy
     * @param nombreCreador
     * @param fechaUpdate
     * @param PK_BLOQUE
     */
    function updateItem(FK_ID_ZONA,FK_ID_AREA,FK_ID_EMPRESA,FK_ID_CREADOR,nombre,descripcion,rutaImage,posx,posy,nombreCreador,fechaUpdate,PK_BLOQUE){
        //Parameters of the request
        let data = {
            FK_ID_AREA:FK_ID_AREA,
            FK_ID_CREADOR:FK_ID_CREADOR,
            FK_ID_EMPRESA:FK_ID_EMPRESA,
            FK_ID_ZONA:FK_ID_ZONA,
            activo:1,
            descripcion:descripcion,
            fechaUpdate:fechaUpdate,
            nombre:nombre,
            nombreCreador:nombreCreador,
            posx:posx,
            posy:posy,
            rutaImage:rutaImage,
            PK_BLOQUE:PK_BLOQUE
        };

        let url = "http://pengraf.com.co/pengraf/v1/api/bloques/";
        let req = {
            method: 'PUT',
            url: url,
            data:data
        };
        $http(req).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            let success = response.data.ans;
            if(success){
                //TODO Update the blocks of zone in front
            }else{
                alertify.error(response.data.error);
            }
            $scope.minloader = false;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log("ERROR",response);
            alertify.error("Lo sentimos, ha ocurrido un error en el servidor");
            $scope.minloader = false;
        });
    }

    /**
     * Get zones bye area
     * @param idArea
     */
    function getZonesByArea(idArea) {
        $scope.loading = true;
        //Parameters of the request
        let data = {
            FK_ID_AREA:idArea
        };
        let url = "http://pengraf.com.co/pengraf/v1/api/zonas/by_area";
        let req = {
            method: 'POST',
            url: url,
            data:data
        };
        $http(req).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            let success = response.data.ans;
            if(success){
                let body = response.data.body;
                body.forEach(function (zone) {
                    let zoneForCreation = {
                        id: zone.PK_ZONA,
                        type: zone.tipo,
                        name: zone.nombreZona,
                        description: zone.descripcion,
                        image: zone.urlRutaImagen,
                        blocks: []
                    };
                    getBlockByZone(zoneForCreation.id, $scope.user.id, zoneForCreation);
                });
            }else{
                alertify.error(response.data.error);
            }
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log("ERROR",response);
            alertify.error("Lo sentimos, ha ocurrido un error en el servidor");
        });
    };

    /**
     * Get the blocks of a zone
     * @param idZone
     * @param idUser
     * @param zoneForCreation
     */
    function getBlockByZone(idZone, idUser, zoneForCreation) {
        //Parameters of the request
        let data = {
            FK_ID_ZONA: idZone,
            idusuario: idUser
        };
        let url = "http://pengraf.com.co/pengraf/v1/api/bloques/by_zona";
        let req = {
            method: 'POST',
            url: url,
            data:data
        };
        $http(req).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            let success = response.data.ans;
            if(success){
                let body = response.data.body;
                body.forEach(function (block) {
                    let blockResponse = {
                        id: block.PK_BLOQUE,
                        type: 0,
                        posx: block.posx,
                        posy: block.posy,
                        name: block.nombre,
                        description: block.descripcion,
                        image: block.rutaImage,
                        total_pendings: block.num_pendientes,
                    };
                    zoneForCreation.blocks.push(blockResponse);
                });
            }else{
                //alertify.error(response.data.error);
            }
            $scope.zones.push(zoneForCreation);
            if($scope.zones.length > 0) {
                $scope.selectedZone = $scope.zones[0];
                $scope.setSelectedZone(0);
            }
            $scope.loading = false;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log("ERROR",response);
            alertify.error("Lo sentimos, ha ocurrido un error en el servidor, tratando de obtener los bloques de esta zona");
        });
    }
    /**
     * Get the default zones from DB
     * @param idCia
     */
    function getZonesByDefault(idCia) {
        $scope.loading = true;
        //Parameters of the request
        let url = "/pengraf/v1/api/defaultzonas/by_empresa/"+idCia;
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
                body.forEach(function (zone) {
                    let zoneForCreation = {
                        id: zone.PK_DEFAULTZONA,
                        name: zone.nombreZona,
                        description: zone.descripcion,
                        image: zone.urlRutaImagen
                    };
                    $scope.defaultZones.push(zoneForCreation);
                });
            }else{
                alertify.error(response.data.error);
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
     * Get the defualt block from DB
     * @param idCia
     */
    function getBlockByDefault(idCia){
        $scope.loading = true;
        //Parameters of the request
        let url = "/pengraf/v1/api/defaultbloques/by_empresa/"+idCia;
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
                body.forEach(function (block) {
                    let blockForCreation = {
                        id: block.PK_DEFAULTBLOQUE,
                        type: 0,
                        name: block.nombre,
                        description: block.descripcion,
                        image: block.rutaImage
                    };
                    $scope.defaultBlocks.push(blockForCreation);
                });
            }else{
                alertify.error(response.data.error);
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
     * Search a block given its id and return the position of the block in the array of blocks of the selected zone
     * @param blockId
     */
    function searchBlockById(blockId){
        var pos = -1;
        var i = 0;
        $scope.selectedZone.blocks.forEach(function (block) {
            if (block.id == blockId){
                pos = i;
                return pos;
            }
            i++;
        });
        return pos;
    }


    /**
     * Adds an item to the zone
     */
    $scope.addItem = function(posX,posY) {
        //TODO Deberia llamar nuevamente la lista de blockes y agregarla - Refrescar todo, setSelectedZone nuevamente
    };

    /**
     *
     * @param posX
     * @param posY
     * @param id
     */
    function addItemAlready(posX,posY,block,totalPen){
        showLoader();
        items++;
        var con = $('#dropzone');
        var pos = con.position();
        var idItem = block.id;
        var itemMyStr = "item_"+idItem;
        var html;
        var imgSrc = '<img src=' + block.image + ' alt="" class="col-12" style="margin-top: -25px">';
        if (block.type == 1){
            imgSrc = '<img src=' + block.image + ' alt="" class="col-12" style="margin-top: -25px" height="40" width="40">';
        }else if (block.id == 50 || block.id == '50'){
            imgSrc = '<img src=' + block.image + ' alt=""    style="margin-top: -25px; width: 300px">';
        }
        if(totalPen>0) {
            html = '<span class="draggable drag-1 col-2" id="' + itemMyStr + '"' +
                'style="top: ' + posY + 'px;left:' + posX + 'px;" onclick="clickOnItem(' + itemMyStr + ')"> ' +
                '<div class="row">' +
                '<ul class="dots">' +
                '<li> <a href="#">' +
                '<mark class="wobble">' + totalPen + '</mark>' +
                '</a>' +
                '</li>' +
                '</ul>' +
                //'<span class="fas fa-eye offset-5 col-2" style="color: gray" onclick="clickOnItem(' + itemMyStr + ')"></span>' +
                //'<span class="fas fa-eye col-2" style="color: gray" ng-click="hole()"></span>' +
                //'<span class="fas fa-times col-2" style="color: gray" onclick="removeItem(' + itemMyStr + ')"></span>' +
                '</div>' +
                '<br>' +
                imgSrc +
                '</span>'
        }else{
            html = '<span class="draggable drag-1 col-2" id="' + itemMyStr + '"' +
                'style="top: ' + posY + 'px;left:' + posX + 'px;" onclick="clickOnItem(' + itemMyStr + ')"> ' +
                '<div class="row">' +
                '<ul class="dots">' +
                '<li> <a href="#">' +
                '</a>' +
                '</li>' +
                '</ul>' +
                //'<span class="fas fa-eye offset-5 col-2" style="color: gray" onclick="clickOnItem(' + itemMyStr + ')"></span>' +
                //'<span class="fas fa-eye col-2" style="color: gray" ng-click="hole()"></span>' +
                //'<span class="fas fa-times col-2" style="color: gray" onclick="removeItem(' + itemMyStr + ')"></span>' +
                '</div>' +
                '<br>' +
                imgSrc +
                '</span>'
        }
        angular.element(con).append($(html));
        hideLoader();
    }

    /**
     * Removes all the items from the screen, given a zone
     */
    function removeBlocksFromZone(zone){

        if(zone) {
            zone.blocks.forEach(function (block) {
                var itemMy = items;
                var itemMyStr = "item" + "_" + block.id;
                var itemToRemove = document.getElementById(itemMyStr);
                if(itemToRemove){
                    itemToRemove.remove();
                }
            });
        }
    }

    /**
     * Shows or hide the pictures panel of a pending
     * @param index
     */
    $scope.showPicsOfPending = function(index){
        //Get the photos
        $scope.pendings[index].showing_pics = !$scope.pendings[index].showing_pics;
    };

    /**
     * Shows/Hide the loader
     * @param showing
     */
    $scope.showLoader = function (showing) {
        if(showing){
            $scope.loading = true;
        }else{
            $scope.loading = false;
        }
    }

},"DashboardController");

/**
 * Controler for the Reports screen
 */
//----------------------------------------------------------------------------------------------------------------------
// Reports Controller
//----------------------------------------------------------------------------------------------------------------------
app.controller("ReportsController",function ($scope,$http) {

    $scope.loading = true;
    $scope.isSelected = false;
    $scope.areas = [];
    $scope.selectedArea = {
        id: -1,
        name: "Todas las areas",
        description: ""
    };
    $scope.pendings = [];
    $scope.selectedPending = {};
    $scope.datasetCat = [];
    $scope.datasetSta = [];
    $scope.today = getToday();
    $scope.completedPendingImages = [];

    /**
     * Init
     */
    $scope.initRports = function () {
        $scope.areas.push({
            id: -1,
            name: "Todas las areas",
            description: ""
        });
        getSession();
    };

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
    // -----------------------------------------------------------------------------------------------------------------
    // Actions
    // -----------------------------------------------------------------------------------------------------------------
    $scope.onAreaSelected = function (index) {
        if ($scope.areas.length > 0) {
            $scope.loading = true;
            $scope.selectedArea = $scope.areas[index];
            if($scope.selectedArea) {

                if ($scope.selectedArea.id == -1) {
                    //Get the pendings of the cia
                    getsPendingsByCia($scope.user.id_cia);
                } else {
                    //Get the pendings of the selected area
                    getPendingsByArea($scope.selectedArea.id);
                }
            }
            $scope.loading = false;
        }else{
            alertify.error("Ha ocurrido un error inesperado, por favor comuniquese con soporte técnico");
        }
    };

    /**
     * When click on a pending item
     * @param index
     */
    $scope.onPendingSelected = function (index) {
        if($scope.pendings.length > 0) {
            $scope.selectedPending = $scope.pendings[index];
            $scope.isSelected = true;
        }
    };

    /**
     * When click on complete
     */
    $scope.onCompleteModal = function () {
        $scope.today = getToday();
    };

    /**
     * When click on cancel modal
     */
    $scope.onResetCompleteishon = function () {
        resetComments();
    };

    // -----------------------------------------------------------------------------------------------------------------
    // Functions
    // -----------------------------------------------------------------------------------------------------------------
    function resetComments(){
        $scope.completePendingComment = "";
        $scope.completedPendingImages = [];
    }

    /**
     * Adds an image to the array of images for complete of the pending
     * @param image
     */
    $scope.addImageToUploadForComplete = function (image) {
        if($scope.completedPendingImages.length<1) {
            $scope.completedPendingImages.push(image);
        }else{
            alertify.warning("Solo se puede adjuntar 1 archivo");
        }
    };

    /**
     * Get the stats of a cia
     * @param idCia
     */
    function getStats(idCia) {
        let url = "http://pengraf.com.co/pengraf/v1/api/pendientes/stats_by_empresa/"+idCia;
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
                console.log(body);
                let statsCat = body.stats_categoria;
                let statsSta = body.stats_estado;

                statsCat.forEach(function (stat) {
                   let num = stat.num;
                   $scope.datasetCat.push(Number(num));
                });
                statsSta.forEach(function (stat) {
                    let num = stat.num;
                    $scope.datasetSta.push(Number(num));
                });
                initializeStatsForTest();
            }else{
                alertify.error(response.data.error);
            }
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log("ERROR",response);
            alertify.error("Lo sentimos, ha ocurrido un error en el servidor");
        });
    }

    /**
     * Gets all the pendings of the cia, form the api
     * @param idCia
     */
    function getsPendingsByCia(idCia) {
        $scope.selectedPending = {};
        $scope.isSelected = false;
        $scope.pendings = [];
        // Traer del API
        //Parameters of the request
        let data = {
            FK_ID_EMPRESA: idCia,
            idusuario: $scope.user.id

        };

        let url = "http://pengraf.com.co/pengraf/v1/api/pendientes/by_empresa";
        let req = {
            method: 'POST',
            url: url,
            data:data
        };
        $http(req).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.pendings = [];
            let success = response.data.ans;
            if(success){
                let body = response.data.body;
                body.forEach(function (pen) {
                    var state_class = "";
                    var type_class = "";
                    switch (pen.estado) {
                        case "1":
                            state_class = "completed";
                            break;
                        case "2":
                            state_class = "caducated";
                            break;
                        case "3":
                            state_class = "onprocess";
                            break;
                    }

                    switch (pen.categoria) {
                        case "1":
                            type_class = SECURITY;
                            break;
                        case "2":
                            type_class = PROCESS;
                            break;
                        case "3":
                            type_class = QUALITY;
                            break;
                        case "4":
                            type_class = GENERALS;
                            break;
                    }
                    let pending = {
                        id: pen.PK_PENDIENTE,
                        state: pen.estado,
                        state_class: state_class,
                        responsable_id: pen.responsableID,
                        responsable_username: pen.responsableUserName,
                        owner_id: body.FK_ID_CREADOR,
                        owner_username: "",
                        name: pen.titulo,
                        description: pen.descripcion,
                        type: pen.categoria,
                        type_class: type_class,
                        end_date: pen.fechaLimite,
                        showing_pics: false,
                        photos:[]
                    };
                    let photos = pen.fotos;
                    photos.forEach(function (photo) {
                        let ph = {
                            image:photo.urlFoto
                        };
                        pending.photos.push(ph);
                    });
                    $scope.pendings.push(pending);
                });
                $scope.onPendingSelected(0);
            }else{
                alertify.error(response.data.error);
            }
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log("ERROR",response);
            alertify.error("Lo sentimos, ha ocurrido un error en el servidor");
        });
    }
    /**
     * Gets the pendings by area from the API
     * @param idArea
     */
    function getPendingsByArea(idArea) {
        $scope.pendings = [];
        $scope.isSelected = false;
        $scope.selectedPending = {};
        // Traer del API
        //Parameters of the request
        let data = {
            FK_ID_AREA: idArea,
            idusuario: $scope.user.id

        };

        let url = "http://pengraf.com.co/pengraf/v1/api/pendientes/by_area";
        let req = {
            method: 'POST',
            url: url,
            data:data
        };
        $http(req).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.pendings = [];
            let success = response.data.ans;
            if(success){
                let body = response.data.body;
                body.forEach(function (pen) {
                    var state_class = "";
                    var type_class = "";
                    switch (pen.estado) {
                        case "1":
                            state_class = "completed";
                            break;
                        case "2":
                            state_class = "caducated";
                            break;
                        case "3":
                            state_class = "onprocess";
                            break;
                    }

                    switch (pen.categoria) {
                        case "1":
                            type_class = SECURITY;
                            break;
                        case "2":
                            type_class = PROCESS;
                            break;
                        case "3":
                            type_class = QUALITY;
                            break;
                        case "4":
                            type_class = GENERALS;
                            break;
                    }
                    let pending = {
                        id: pen.PK_PENDIENTE,
                        state: pen.estado,
                        state_class: state_class,
                        responsable_id: pen.responsableID,
                        responsable_username: pen.responsableUserName,
                        owner_id: body.FK_ID_CREADOR,
                        owner_username: "",
                        name: pen.titulo,
                        description: pen.descripcion,
                        type: pen.categoria,
                        type_class: type_class,
                        end_date: pen.fechaLimite,
                        showing_pics: false,
                        photos:[]
                    };
                    let photos = pen.fotos;
                    photos.forEach(function (photo) {
                        let ph = {
                            image:photo.urlFoto
                        };
                        pending.photos.push(ph);
                    });
                    $scope.pendings.push(pending);
                });
                $scope.onPendingSelected(0);
            }else{
                alertify.error(response.data.error);
            }
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log("ERROR",response);
            alertify.error("Lo sentimos, ha ocurrido un error en el servidor");
        });
    }

    /**
     * Get the session of the current user
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
                //Get the areas
                getAreas($scope.user.id_cia);
                //Get the stats
                getStats($scope.user.id_cia);
            }else{
                alertify.error(response.data.error);
                $(location).attr('href', './index.html');
            }
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log("ERROR",response);
            alertify.error("Lo sentimos, ha ocurrido un error en el servidor");
        });
    }

    /**
     * Get the areas of the CIA
     * @param idCia
     */
    function getAreas(idCia) {
        //Get the initial areas data
        let url = "/pengraf/v1/api/areas/by_empresa";
        let req = {
            method: 'POST',
            url: url,
            //headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            data: { FK_ID_EMPRESA: $scope.user.id_cia}
        };

        $http(req).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            let success = response.data.ans;
            if(success){
                let body = response.data.body;
                body.forEach(function (area) {
                    let newArea = {
                        id: area.PK_AREA,
                        name: area.nombre,
                        description: area.descripcion
                    };
                    $scope.areas.push(newArea)
                });
                $scope.onAreaSelected(0);
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
     * Init the charts
     */
    function initializeStatsForTest() {
        var ctx = document.getElementById("pendingStats").getContext('2d');
        var ctx2 = document.getElementById("timelineStats").getContext('2d');
        data = {
            datasets: [{
                data: $scope.datasetSta,
                backgroundColor: ["#4E7220","#ba332b","#F2D633"],
            }],

            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: [
                'Completados',
                'Caducados',
                'En proceso'
            ]
        };
        data2 = {
            datasets: [{
                data: $scope.datasetCat,
                backgroundColor: ['rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',],
            }],

            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: [
                'Seguridad',
                'Procesos',
                'Calidad',
                "General"
            ]
        };
        // For a pie chart
        var myPieChart = new Chart(ctx,{
            type: 'pie',
            data: data,
            options: {}
        });
        // For a pie chart
        var myChart2 = new Chart(ctx2,{
            type: 'doughnut',
            data: data2,
            options: {}
        });
    }

});