/**
 * Created by Tiago on 20/11/18.
 */

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
            console.log("IMAGE SELCTED",e.target.result);
            var scope = angular.element($("#newPendingModal")).scope();
            scope.safeApply(function(){
                scope.addImageToUploadForPending(e.target.result)
            });
        };
        reader.readAsDataURL(input.files[0]);
    }
}


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
 * Controller for the Area selection
 */
//----------------------------------------------------------------------------------------------------------------------
// Areas selection Controller
//----------------------------------------------------------------------------------------------------------------------
app.controller("AreasController",function ($scope,$http) {
    $scope.user = {};
    $scope.loading = true;
    $scope.areas = [];

    /**
     * Initialization of the Areas section
     */
    $scope.initAreas = function () {
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
        $scope.areas = [
            {
                id:"1111",
                name: "Area externa de la empresa",
                description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium consequatur debitis deserunt laborum sapiente. Ad deserunt dolores ea eum iste sunt totam? Libero molestias non perferendis quisquam sed temporibus voluptate."
            },
            {
                id:"2222",
                name: "Area administrativa interna",
                description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium consequatur debitis deserunt laborum sapiente. Ad deserunt dolores ea eum iste sunt totam? Libero molestias non perferendis quisquam sed temporibus voluptate."
            },
            {
                id:"3333",
                name: "Area de producción",
                description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium consequatur debitis deserunt laborum sapiente. Ad deserunt dolores ea eum iste sunt totam? Libero molestias non perferendis quisquam sed temporibus voluptate."
            },
        ]
        $scope.loading = false;
    }

    /**
     * When an area is selected
     * @param area
     */
    $scope.clockOnArea = function (area) {
        $(location).attr('href', './dashboard.html?areaId='+area.id);
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
    $scope.loading = true;
    $scope.minloader = false;
    $scope.pendingLoader = false;
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
    $scope.pendingForCreationTypeText = "Tipo de pendiente"
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

        if($scope.areaId){
            //TODO Do something with the area
            console.log("Area id",$scope.areaId);
        }
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
                image:"img/item-block-1.jpeg"
            },
            {
                id:"002B",
                name:"Camion de emablaje",
                description:"Camion de embalaje de producto",
                image:"img/item-block-2.jpeg"
            },
            {
                id:"002B",
                name:"Camion de emablaje",
                description:"Camion de embalaje de producto",
                image:"img/item-block-3.jpeg"
            },
            {
                id:"002B",
                name:"Camion de emablaje",
                description:"Camion de embalaje de producto",
                image:"img/item-block-4.jpeg"
            },
            {
                id:"002B",
                name:"Camion de emablaje",
                description:"Camion de embalaje de producto",
                image:"img/item-block-5.jpeg"
            },
            {
                id:"002B",
                name:"Camion de emablaje",
                description:"Camion de embalaje de producto",
                image:"img/item-block-6.jpeg"
            },
            {
                id:"002B",
                name:"Camion de emablaje",
                description:"Camion de embalaje de producto",
                image:"img/item-block-7.jpeg"
            },
            {
                id:"002B",
                name:"Camion de emablaje",
                description:"Camion de embalaje de producto",
                image:"img/item-block-8.jpeg"
            },
            {
                id:"002B",
                name:"Camion de emablaje",
                description:"Camion de embalaje de producto",
                image:"img/item-block-2.jpeg"
            },
            {
                id:"002B",
                name:"Camion de emablaje",
                description:"Camion de embalaje de producto",
                image:"img/item-block-9.jpeg"
            },
            {
                id:"002B",
                name:"Camion de emablaje",
                description:"Camion de embalaje de producto",
                image:"img/item-block-10.jpeg"
            },
            {
                id:"002B",
                name:"Camion de emablaje",
                description:"Camion de embalaje de producto",
                image:"img/item-block-11.jpeg"
            },
            {
                id:"002B",
                name:"Camion de emablaje",
                description:"Camion de embalaje de producto",
                image:"img/item-block-12.jpeg"
            },
            {
                id:"002B",
                name:"Camion de emablaje",
                description:"Camion de embalaje de producto",
                image:"img/item-block-13.jpeg"
            },
            {
                id:"002B",
                name:"Camion de emablaje",
                description:"Camion de embalaje de producto",
                image:"img/item-block-14.jpeg"
            },
            {
                id:"002B",
                name:"Camion de emablaje",
                description:"Camion de embalaje de producto",
                image:"img/item-block-15.jpeg"
            },
            {
                id:"002B",
                name:"Camion de emablaje",
                description:"Camion de embalaje de producto",
                image:"img/item-block-16.jpeg"
            },
            {
                id:"002B",
                name:"Camion de emablaje",
                description:"Camion de embalaje de producto",
                image:"img/item-block-17.jpeg"
            },
            {
                id:"002B",
                name:"Camion de emablaje",
                description:"Camion de embalaje de producto",
                image:"img/item-block-18.jpeg"
            },
            {
                id:"002B",
                name:"Camion de emablaje",
                description:"Camion de embalaje de producto",
                image:"img/item-block-19.jpeg"
            },
        ];
        $scope.zones = [
            {
                id:"Z001Z",
                type:"001Z",
                name:"Zona industrial",
                description:"Zona de producción industrial",
                image:"img/zone-1.png",
                blocks:[
                    {
                        id:"B001B",
                        type:"001B",
                        posx:20,
                        posy:40,
                        name:"Mesa de verificación de producto 1",
                        description:"Mesa de verificación de calidad del producto",
                        image:"img/item-block-2.jpeg",
                        total_pendings:0,
                    },
                    {
                        id:"B002B",
                        type:"002B",
                        posx:200,
                        posy:100,
                        name:"Mesa de verificación de producto 2",
                        description:"Mesa de verificación de calidad del producto",
                        image:"img/item-block-1.jpeg",
                        total_pendings:1,
                    },
                ]
            },
            {
                id:"Z002Z",
                type:"002Z",
                name:"Zona de Almacen",
                description:"Zona tipo bodega",
                image:"img/zone-2.png",
                blocks:[
                    {
                        id:"B003B",
                        type:"001B",
                        posx:29,
                        posy:49,
                        name:"Mesa de verificación de producto 3",
                        description:"Mesa de verificación de calidad del producto",
                        image:"img/item-block-1.jpeg",
                        total_pendings:14,
                    },
                    {
                        id:"B004B",
                        type:"002B",
                        posx:300,
                        posy:150,
                        name:"Mesa de verificación de producto 4",
                        description:"Mesa de verificación de calidad del producto",
                        image:"img/item-block-2.jpeg",
                        total_pendings:0,
                    },
                ]
            },
            {
                id:"003Z",
                type:"001Z",
                name:"Zona de oficinas",
                description:"Zona de oficinas y area administrativa",
                image:"img/zone-3.png",
                blocks:[
                    {
                        id:"B005B",
                        type:"001B",
                        posx:40,
                        posy:80,
                        name:"Mesa de verificación de producto 5",
                        description:"Mesa de verificación de calidad del producto",
                        image:"img/item-block-1.jpeg",
                        total_pendings:10,
                    },
                    {
                        id:"B006B",
                        type:"002B",
                        posx:220,
                        posy:120,
                        name:"Mesa de verificación de producto 6",
                        description:"Mesa de verificación de calidad del producto",
                        image:"img/item-block-2.jpeg",
                        total_pendings:1,
                    },
                ]
            },
        ];
        $scope.loading = false;
        $scope.selectedZone = $scope.zones[0];
        $scope.setSelectedZone(0);
    };

    /**
     * When click on a zone
     * @param index
     */
    $scope.setSelectedZone = function(index){
        $scope.loading = true;
        removeBlocksFromZone($scope.selectedZone);
        $scope.selectedZone = $scope.zones[index];
        //TODO Cargar bloques, ponerlos en pantalla y cargar pendientes del primer bloque
        $scope.selectedZone.blocks.forEach(function (block) {
            addItemAlready(block.posx,block.posy,block,block.total_pendings)
        });
        if($scope.selectedZone.blocks.length > 1){
            $scope.selectedBlock = $scope.selectedZone.blocks[0];
            $scope.getPendingsOfBlock($scope.selectedBlock.id);
        }
        $scope.loading = false;
    };

    /**
     * When a block is selected, it bring all the pendings data from the server and place it on the screen
     * @param block
     */
    $scope.getPendingsOfBlock = function(blockId){
        $scope.pendingLoader = true;
        var pos = searchBlockById(blockId);
        if(pos > -1){
            $scope.selectedBlock = $scope.selectedZone.blocks[pos];
            //TODO Traer del API
            $scope.pendings = [
                {
                    id: "P001",
                    state: 0,
                    state_class: "caducated",
                    responsable_id: "1234",
                    responsable_username: "tmoreno",
                    owner_id: "1235",
                    owner_username: "tbenavides",
                    name: "Pendiente de prueba 1",
                    description: "Este es un pendiente de prueba que esta quemado en el codigo con el fin de mostrar algo de información en la pantalla. Esta información deberia ser lo suficientemente larga, como si fuera la descripción real de un pendiente",
                    type: 3, //TODO Categorias definidas en BD? - Si, deberian estandarizarse por si se pueden cambiar o crear nuevas luego
                    end_date: "21-08-2019",
                    showing_pics: false,
                    photos:[]
                },
                {
                    id: "P002",
                    state: 1,
                    state_class: "onprocess",
                    responsable_id: "1234",
                    responsable_username: "tmoreno",
                    owner_id: "1235",
                    owner_username: "tbenavides",
                    name: "Pendiente de prueba 2",
                    description: "Este es un pendiente de prueba que esta quemado en el codigo con el fin de mostrar algo de información en la pantalla. Esta información deberia ser lo suficientemente larga, como si fuera la descripción real de un pendiente",
                    type: 2, //TODO Categorias definidas en BD? - Si, deberian estandarizarse por si se pueden cambiar o crear nuevas luego
                    end_date: "21-08-2019",
                    showing_pics: false,
                    photos:[
                        {
                            id:"PH001",
                            image:"img/testimg1.jpg"
                        },
                        {
                            id:"PH002",
                            image:"img/testimg1.jpg"
                        },
                    ]
                },
                {
                    id: "P003",
                    state: 2,
                    state_class: "completed",
                    responsable_id: "1234",
                    responsable_username: "tmoreno",
                    owner_id: "1235",
                    owner_username: "tbenavides",
                    name: "Pendiente de prueba 3",
                    description: "Este es un pendiente de prueba que esta quemado en el codigo con el fin de mostrar algo de información en la pantalla. Esta información deberia ser lo suficientemente larga, como si fuera la descripción real de un pendiente",
                    type: 1, //TODO Categorias definidas en BD? - Si, deberian estandarizarse por si se pueden cambiar o crear nuevas luego
                    end_date: "21-08-2019",
                    showing_pics: false,
                    photos:[
                        {
                            id:"PH001",
                            image:"img/testimg1.jpg"
                        },
                        {
                            id:"PH002",
                            image:"img/testimg1.jpg"
                        },
                        {
                            id:"PH003",
                            image:"img/testimg1.jpg"
                        },
                        {
                            id:"PH004",
                            image:"img/testimg1.jpg"
                        },
                    ]
                }
            ]
        }else{
            //TODO Ha ocurrido un error, comuniquese con soporte
            console.log("Ha ocurrido un error");
        }
        $scope.pendingLoader = false;
    };

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
                '<img src=' + block.image + ' alt="" class="col-12" style="margin-top: -25px">' +
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
                '<img src=' + block.image + ' alt="" class="col-12" style="margin-top: -25px">' +
                '</span>'
        }
        angular.element(con).append($(html));
        hideLoader();
     }

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
             let newX = block.posx + posX;
             let newY = block.posy + posY;
             //TODO Enviar el objeto al servidor para actualizar la info
         }else{
             //TODO Notificar que un error extraño ocurrio, favor comunicarse con soporte
             console.log("Error");
         }
         //$scope.minloader = false;
     };

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
     * Shows or hide the pictures panel of a pending
     * @param index
     */
    $scope.showPicsOfPending = function(index){
        console.log("Index",index);
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
    }
    
},"DashboardController");

/**
 * Controler for the Reports screen
 */
//----------------------------------------------------------------------------------------------------------------------
// Reports Controller
//----------------------------------------------------------------------------------------------------------------------
app.controller("ReportsController",function ($scope,$http) {
    
    $scope.initRports = function () {
        initializeStatsForTest();
    };
    
    function initializeStatsForTest() {
        var ctx = document.getElementById("pendingStats").getContext('2d');
        var ctx2 = document.getElementById("timelineStats").getContext('2d');
        data = {
            datasets: [{
                data: [10, 20, 30],
                backgroundColor: ["#F2D633", "#4E7220","#ba332b"],
            }],

            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: [
                'En proceso',
                'Completados',
                'Caducados'
            ]
        };
        // For a pie chart
        var myPieChart = new Chart(ctx,{
            type: 'pie',
            data: data,
            options: {}
        });
        var myChart2 = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [{
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                legend: {
                    display: false
                },
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.yLabel;
                        }
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
    }

});