/**
 * Created by Tiago on 20/11/18.
 */

/**
 * App module
 */
var app = angular.module("pengrafApp", []);

/**
 * Controller for the Login screen
 */
//----------------------------------------------------------------------------------------------------------------------
// Login Controller
//----------------------------------------------------------------------------------------------------------------------

/**
 * Controller for the Forget password screen
 */
//----------------------------------------------------------------------------------------------------------------------
// Forget password Controller
//----------------------------------------------------------------------------------------------------------------------

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
    $scope.loading = true;
    $scope.user = {};
    $scope.defaultBlocks = [];
    $scope.defaultZones = [];
    $scope.zones = [];
    $scope.selectedZone = {};
    $scope.blocks = [];
    $scope.selectedBlock = {};
    $scope.pendings = [];
    $scope.zoneForCreation = {};
    $scope.blockForCreation = {};

    /**
     * Initialization of the dashboard
     */
    $scope.initDashboard = function () {
        //Get the session of the user todo
        $scope.user = {
            id:"1234",
            id_cia:"0001",
            profile:0,
            username:"tmoreno",
            password:"pengraf2019",
            name:"Tiago",
            lastname:"Moreno",
            mail:"msantim@hotmail.com",
            phone:"3016929622",
            token:"thejsontokengenerated1234567890"
        };
        //Get the initial data todo
        $scope.defaultZones = [
            {
                id:"001Z",
                name:"Zona industrial",
                description:"Zona de producción industrial",
                image:"img/zone-1.png"
            },
            {
                id:"002Z",
                name:"Zona de Almacen",
                description:"Zona tipo bodega",
                image:"img/zone-2.png"
            },
            {
                id:"003Z",
                name:"Zona de oficinas",
                description:"Zona de oficinas y area administrativa",
                image:"img/zone-3.png"
            },
        ];
        $scope.defaultBlocks = [
            {
                id:"001B",
                name:"Mesa de verificación de producto",
                description:"Mesa de verificación de calidad del producto",
                image:"img/item-block-1.png"
            },
            {
                id:"002B",
                name:"Camion de emablaje",
                description:"Camion de embalaje de producto",
                image:"img/item-block-2.png"
            },
        ];
        $scope.loading = false;
    };


    /**
     * Adds an item to the zone
     */
     $scope.addItem = function(posX,posY) {
        showLoader();
        items++;
        var con = $('#dropzone');
        var pos = con.position();
        var itemMy = items;
        var idItem = $scope.blockForCreation.id; //TODO Deberia ser el id devuelto por e server al crearlo
        var itemMyStr = "item"+itemMy+"_"+idItem;
        con.append($('<div class="draggable drag-1 col-2" id="item' + items + '_' + idItem + '" ' +
            'style="top: ' + posY + 'px;left:' + posX + 'px;"> ' +
            '<div class="row">' +
            '<span class="fas fa-plus offset-3 col-2" style="color: gray" onclick="clickOnItem()"></span>' +
            '<span class="fas fa-eye col-2" style="color: gray" onclick="clickOnItem()"></span>' +
            '<span class="fas fa-times col-2" style="color: gray" onclick="removeItem(' + itemMyStr + ')"></span>' +
            '</div>' +
            '<br>' +
            '<img src='+$scope.blockForCreation.image+' alt="" width="100">' +
            '</div>'));
        hideLoader();
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

    $scope.selectBlockToAdd = function (index) {
        $scope.blockForCreation = $scope.defaultBlocks[index];
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
});

/**
 * Controler for the Reports screen
 */
//----------------------------------------------------------------------------------------------------------------------
// Reports Controller
//----------------------------------------------------------------------------------------------------------------------