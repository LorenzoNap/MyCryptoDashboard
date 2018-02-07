var app = angular.module('app', [ 'ui.bootstrap']);


app.directive('stringToNumber', function ( $filter) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (value) {
                return '' + value;
            });
            ngModel.$formatters.push(function (value, $filter) {

                return parseFloat(value);
            });
        }
    };
});



app.controller('MainController', function ($scope, $http) {

    $(window).resize(function () {
        updateCharPrice($scope.currentMoneta)
        updateChartPircePie();
    });

    $scope.user = {};

    $http({
        method: 'GET',
        url: '/myUser'
    }).then(function successCallback(response) {
        $scope.user = response.data;

    }, function errorCallback(response) {
        console.log(response);
    });




    $scope.getFornitori = function (val) {

        return $http({
            method: 'GET',
            url: '/coinList?name='+val
        }).then(function successCallback(response) {
            $scope.arrayFornitori = response.data;
            return response.data.map(function (item) {
                return item;
            });
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    $scope.haveCrypto = true;
    $scope.coinList = [];
    $scope.currentMoneta = "BTC";
    $scope.pieData = [];

    $scope.cryptosValuesMoney = {eur: 0, usd: 0, totale: 0};


    $scope.aggiungiMoneteDialog = function () {

        $("#addCryptoDialog").modal("show")
        $scope.myCoinListTemp = angular.copy($scope.myCoinList)

    }


    $scope.myCoinTable = []
    $scope.totalCoinEur = 0;
    $scope.totalCoinUsd = 0;
    $scope.totalCoinInvestimento = 0;



    //Sezione per l'aggiunta di monete
    $scope.myCoinList = []

    $scope.addNew = function (personalDetail) {
        $scope.myCoinListTemp.push({
            'moneta': "",
            'quantita': 0,
            'investimento': 0
        });
    }

    $scope.remove = function () {
        var newDataList = [];
        $scope.selectedAll = false;
        angular.forEach($scope.myCoinListTemp, function (selected) {
            if (!selected.selected) {
                newDataList.push(selected);
            }
        });
        $scope.myCoinListTemp = newDataList;
    };


    $scope.checkAll = function () {
        if (!$scope.selectedAll) {
            $scope.selectedAll = true;
        } else {
            $scope.selectedAll = false;
        }
        angular.forEach($scope.myCoinListTemp, function (personalDetail) {
            personalDetail.selected = $scope.selectedAll;
        });
    };

    $scope.saveMyCrypto = function () {

         if($("#formSaveMyCoin")[0].checkValidity()){

             $http.post('/saveMyCrypto', JSON.stringify($scope.myCoinListTemp)).success(function (response) {
                 if(response){

                     $.notify({
                         // options
                         message: 'Le monete sono state salvate'
                     },{
                         // settings
                         delay: 5000,
                         type: 'success'
                     })

                     $scope.myCoinList = $scope.myCoinListTemp
                     $("#addCryptoDialog").modal("hide")
                     //ricarica le pagine
                     updateCryptos()



                 } else {
                     $.notify({
                         // options
                         message: 'Attenzione si è verificato un errore'
                     },{
                         // settings
                         delay: 5000,
                         type: 'danger'
                     })
                 }

             })

         } else {
             $.notify({
                 // options
                 message: 'Controlla tutti i campi'
             },{
                 // settings
                 delay: 5000,
                 z_index: 100000000,
                 type: 'warning'
             })
         }



    }

    $scope.updateChart = function (moneta) {
        $scope.currentMoneta = moneta
        updateCharPrice(moneta);
    }




    updateCryptos();

    function updateCryptos() {

        $("#myCoinGuadagnoTable").show();


        $scope.cryptosValuesMoney = {eur: 0, usd: 0, totale: 0};


        updateCharPrice($scope.currentMoneta);

        var now = new Date();

        $("#lastUpdate").html("Last update at " + now.toLocaleString("it-IT"));


        $http.get("/cryptos").success(function (response) {

                if (response.length <= 0) {
                    $scope.haveCrypto = false;
                    $("#myCoinGuadagnoTable").hide();
                    $("#myCoinTableInfo").hide()
                } else {
                    $scope.haveCrypto = true;
                    $scope.myCoinList = response
                }

                $('.tableGuadagno > tbody > tr').on('click', function(){
                    var value =$(this).closest('tr').children('td:first').text();
                    updateCharPrice(value)
                });

                $scope.pieData = [];


                var totMonete = 0;

                for (index in $scope.myCoinList) {
                    totMonete = totMonete + Number.parseFloat($scope.myCoinList[index].quantita);
                }

                $.each($scope.myCoinList, function (index, moneta) {

                    var perc = Math.round(((Number.parseFloat($scope.myCoinList[index].quantita) * 100) / totMonete) * 100) / 100

                    $scope.pieData.push({y: perc, name: moneta.moneta.Symbol});

                    $http.get("https://min-api.cryptocompare.com/data/price?fsym=" + $scope.myCoinList[index].moneta.Symbol + "&tsyms=USD,EUR").
                        success(function (resultMoneta) {

                            $scope.cryptosValuesMoney.eur = $scope.cryptosValuesMoney.eur + parseFloat(Math.round(resultMoneta.EUR * moneta.quantita * 100) / 100);
                            $scope.cryptosValuesMoney.usd = $scope.cryptosValuesMoney.usd + parseFloat(Math.round(resultMoneta.USD * moneta.quantita * 100) / 100);
                            $scope.cryptosValuesMoney.totale = $scope.cryptosValuesMoney.totale + parseFloat(moneta.investimento);


                            $scope.myCoinList[index].eur = parseFloat(Math.round(resultMoneta.EUR * moneta.quantita * 100) / 100);
                            $scope.myCoinList[index].usd = parseFloat(Math.round(resultMoneta.USD * moneta.quantita * 100) / 100);

                            $scope.myCoinList[index].eurValue = parseFloat(resultMoneta.EUR);
                            $scope.myCoinList[index].usdValue = parseFloat(resultMoneta.USD);


                            if (index === $scope.myCoinList.length - 1) {
                                if (!isNaN($scope.cryptosValuesMoney.eur) && !isNaN($scope.cryptosValuesMoney.totale)) {

                                    var diff = $scope.cryptosValuesMoney.eur - $scope.cryptosValuesMoney.totale;
                                    var perc = parseFloat((diff * 100) / (parseFloat(Math.round($scope.cryptosValuesMoney.totale * 100) / 100))).toFixed(2)
                                    if(perc === 'Infinity'){
                                        perc = 100
                                    }

                                    $scope.cryptosValuesMoney.profitLost = diff.toFixed(2)
                                    $scope.cryptosValuesMoney.profitLostPerc = perc
                                }

                                updateCoinInfoTable();
                                $("#myCoinGuadagnoTable").hide();
                            }

                        }).error( function (err) {
                            alert(err)
                            $("#myCoinGuadagnoTable").hide();

                        })
                    })

                });


                updateChartPircePie()

    }


    function updateCoinInfoTable() {

        $("#myCoinTableInfo").show();
        if($scope.myCoinList.length == 0){
            $("#myCoinTableInfo").hide();

        }

        $.each($scope.myCoinList, function (index, moneta) {


            $http.get("https://api.coinmarketcap.com/v1/ticker/" + moneta.moneta.CoinName.toLowerCase() + "/?convert=EUR").success(function (result) {
                $scope.myCoinList[index].price24 = result[0].percent_change_24h

                if (index == $scope.myCoinList.length - 1) {
                    $("#myCoinTableInfo").hide();
                }

            }).error(function (err) {
                alert(err)
                $("#myCoinTableInfo").hide();
            })


        })


    }


    function updateChartPircePie() {

        var chart = new CanvasJS.Chart("chartContainerPie", {
            exportEnabled: false,
            animationEnabled: true,
            width: $("#chartPricePie").width(),
            theme: "light2",
            // title: {
            //     text: "Percentuale monete"
            // },
            data: [{
                type: "pie",

                showInLegend: false,
                toolTipContent: "{name}: <strong>{y}%</strong>",
                indexLabel: "{name} - {y}%",
                dataPoints: $scope.pieData
            }]
        });
        chart.render();
    }

    function updateChartHashRate(moneta) {

        var url= "";
        if(moneta == "BTC"){
            url = "https://api.blockchain.info/pools?cors=true&timespan=48hours"
        } else {

        }


        $.ajax({
            url: "https://api.blockchain.info/pools?cors=true&timespan=48hours",
            success: function (result) {

                var data = [];
                $.each(result, function (index, value) {

                    data.push({y: value, name: index});

                })

                function SortByID(x,y) {
                    return x.y - y.y;
                }
                data.sort(SortByID)

                var chart = new CanvasJS.Chart("chartHashRateContainer", {
                    exportEnabled: false,
                    animationEnabled: true,
                    width: $("#chartHashRate").width(),
                    theme: "light2",
                    // title: {
                    //     text: "Percentuale monete"
                    // },
                    data: [{
                        type: "pie",

                        showInLegend: false,
                        toolTipContent: "{name}: <strong>{y}%</strong>",
                        indexLabel: "{name} - {y}%",
                        dataPoints: data
                    }]
                });
                chart.render();

            }
        })

        var chart = new CanvasJS.Chart("chartContainerPie", {
            exportEnabled: false,
            animationEnabled: true,
            width: $("#chartPricePie").width(),
            theme: "light2",
            // title: {
            //     text: "Percentuale monete"
            // },
            data: [{
                type: "pie",

                showInLegend: false,
                toolTipContent: "{name}: <strong>{y}%</strong>",
                indexLabel: "{name} - {y}%",
                dataPoints: $scope.pieData
            }]
        });
        chart.render();
    }


    function updateCharPrice(moneta) {


        updateChartHashRate(moneta)

        $.ajax({
            url: "https://min-api.cryptocompare.com/data/histoday?fsym=" + moneta + "&tsym=USD&limit=60&aggregate=3&e=CCCAGG",
            success: function (result) {

                var dataUSD = [];

                result.Data.forEach(function (value, index) {

                    var date = new Date(result.Data[index].time * 1000);
                    dataUSD.push({x: date, y: result.Data[index].close})
                })



                $.ajax({
                    url: "https://min-api.cryptocompare.com/data/histoday?fsym=" + moneta + "&tsym=EUR&limit=60&aggregate=3&e=CCCAGG",
                    success: function (result) {

                        var dataEUR = [];

                        result.Data.forEach(function (value, index) {

                            var date = new Date(result.Data[index].time * 1000);
                            dataEUR.push({x: date, y: result.Data[index].close})
                        })

                        var chart = new CanvasJS.Chart("chartContainer", {
                            animationEnabled: true,
                            width: $("#chartPrice").width(),
                            theme: "light2",
                            // title: {
                            //     text: "Prezzo " + moneta
                            // },
                            axisX: {
                                valueFormatString: "DD MMM",
                                // crosshair: {
                                //     enabled: true,
                                //     snapToDataPoint: true
                                // }
                            },
                            axisY: {
                                title: "Prezzo in €, $",
                                // crosshair: {
                                //     enabled: true
                                // }
                            },
                            toolTip: {
                                shared: true
                            },
                            legend: {
                                cursor: "pointer",
                                fontSize: 16
                            },
                            data: [{
                                name: "Prezzo in €",
                                type: "line",
                                showInLegend: true,
                                markerType: "square",
                                xValueFormatString: "DD MMM, YYYY",
                                color: "#F08080",
                                dataPoints: dataEUR
                            }, {
                                type: "line",
                                showInLegend: true,
                                name: "$",
                                markerType: "square",
                                xValueFormatString: "DD MMM, YYYY",
                                color: "#2b43f0",
                                dataPoints: dataUSD
                            }
                            ]
                        });
                        chart.render();

                    }
                });


            }
        });
    }

})