// $(document).ready(function () {
//
//
//     var cryptosValuesMoney = {eur: 0, usd: 0, totale: 0};
//
//     $("#buttonRefresh").on('click', function () {
//
//         updateCryptos();
//     });
//
//     setInterval(updateCryptos, 300000);
//
//
//     updateCharPrice("BTC")
//
//
//
//
//     var formatterUSD = new Intl.NumberFormat('en-US', {
//         style: 'currency',
//         currency: 'USD',
//         minimumFractionDigits: 2
//         // the default value for minimumFractionDigits depends on the currency
//         // and is usually already 2
//     });
//
//     var formatterEUR = new Intl.NumberFormat('it-IT', {
//         style: 'currency',
//         currency: 'EUR',
//         minimumFractionDigits: 2,
//         // the default value for minimumFractionDigits depends on the currency
//         // and is usually already 2
//     });
//
//     var myTableCurrentPrice = $('#myTableCurrentPrice').DataTable({
//         "paging": false,
//         "ordering": false,
//         "info": false,
//         "searching": false,
//         "columnDefs": [
//             {
//                 // The `data` parameter refers to the data for the cell (defined by the
//                 // `data` option, which defaults to the column being worked with, in
//                 // this case `data: 0`.
//                 "render": function (data, type, row) {
//                     if (parseFloat(data) > 0) {
//                         return '<p class="text-success">' + data + '</p>'
//                     } else {
//                         return '<p class="text-danger">' + data + '</p>'
//                     }
//
//                 },
//                 "targets": 3
//             },
//             {"visible": true, "targets": [3]}
//         ]
//     });
//
//     var myTable = $('#myTable').DataTable({
//         "paging": false,
//         "ordering": false,
//         "info": false,
//         "searching": false,
//         "columnDefs": [
//             { "width": "30%", "targets": 1, "defaultContent": "" },
//             { "width": "30%", "targets": 0, "defaultContent": ""},
//             { "width": "30%", "targets": 4 , "defaultContent": ""},
//             {
//                 // The `data` parameter refers to the data for the cell (defined by the
//                 // `data` option, which defaults to the column being worked with, in
//                 // this case `data: 0`.
//                 "render": function (data, type, row) {
//                     return '<p class="text-success">' + data + '</p>'
//                 },
//                 "targets": 2,
//                 "width": "30%", "defaultContent": ""
//             },
//             {
//                 // The `data` parameter refers to the data for the cell (defined by the
//                 // `data` option, which defaults to the column being worked with, in
//                 // this case `data: 0`.
//                 "render": function (data, type, row) {
//                     return '<p class="text-success">' + data + '</p>'
//                 },
//                 "targets": 3,
//                 "width": "30%", "defaultContent": ""
//             }
//         ],
//         "footerCallback": function (row, data, start, end, display) {
//             var api = this.api(), data;
//
//
//             // Update footer
//             $(api.column(2).footer()).html(
//                 '<h5 class="text-success"><b>' + formatterEUR.format(cryptosValuesMoney.eur) +"  "+ formatterUSD.format(cryptosValuesMoney.usd) + '</b></h5>'
//             );
//             // Update profit/Loss table
//             $("#totaleInvestitoColumn").html("<h5 class='text-success'><b>"+ formatterEUR.format(cryptosValuesMoney.totale) +"</b></h5>")
//             $("#guadagnoColumn").html("<h5 class='text-success'><b>"+ formatterEUR.format(cryptosValuesMoney.eur) +"</b></h5>")
//
//             if(!isNaN(cryptosValuesMoney.eur) && !isNaN(cryptosValuesMoney.totale)){
//
//                 var diff = cryptosValuesMoney.eur - cryptosValuesMoney.totale;
//                 var perc = parseFloat((diff * 100) / (parseFloat(Math.round(cryptosValuesMoney.totale * 100) / 100))).toFixed(2)
//
//                 if(diff >= 0){
//                     $("#profitLossColumn").html("<h5 class='text-success'><b>"+ diff.toFixed(2) +"</b>" +
//                         "<br><h5 class='text-succes'><b>"+perc+" %</b></h5></p>")
//                 } else {
//
//                     $("#profitLossColumn").html("<h5 class='text-danger'><b>"+ diff.toFixed(2) +"</b>" +
//                         "<br><h5 class='text-danger'><b>"+perc+" %</b></h5></p>")
//                 }
//             }
//
//
//         }
//
//     });
//
//     $('#myTable tbody').on('click', 'tr', function () {
//         var data = myTable.row(this).data();
//         var moneta = data[0];
//
//         updateCharPrice(moneta)
//     });
//
//     //check if api responses
//     $.ajax({
//         url: "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD,EUR",
//         success: function () {
//
//         },
//         error: function () {
//             alert("Le api di cryptocompare non funzionano")
//         }
//     });
//     //load my cryptos
//
//
//     updateCryptos()
//
//     function updateCryptos() {
//
//         cryptosValuesMoney = {eur: 0, usd: 0, totale: 0};
//
//
//         updateProfitChart()
//
//         var now = new Date();
//
//         $("#lastUpdate").html("Last update at "+ now.toLocaleString("it-IT"));
//
//
//         $.ajax({
//             url: "/cryptos",
//             success: function (result) {
//
//                 myTableCurrentPrice
//                     .clear()
//                     .draw();
//
//                 myTable
//                     .clear()
//                     .draw();
//
//                 var pieData = [];
//
//                 var totMonete = 0;
//
//                 for (index in result) {
//                     totMonete = totMonete + Number.parseFloat(result[index].quantita);
//                 }
//
//                 $.each(result, function (index, moneta) {
//
//                     var perc = Math.round(((Number.parseFloat(result[index].quantita) * 100) / totMonete) * 100) / 100
//
//                     pieData.push({y: perc, name: moneta.moneta});
//
//                     $.ajax({
//                         url: "https://min-api.cryptocompare.com/data/price?fsym=" + moneta.moneta + "&tsyms=USD,EUR",
//                         success: function (resultMoneta) {
//
//                             cryptosValuesMoney.eur = cryptosValuesMoney.eur + parseFloat(Math.round(resultMoneta.EUR * moneta.quantita * 100) / 100);
//                             cryptosValuesMoney.usd = cryptosValuesMoney.usd  + parseFloat(Math.round(resultMoneta.USD * moneta.quantita * 100) / 100);
//                             cryptosValuesMoney.totale = cryptosValuesMoney.totale  + parseFloat(moneta.investimento);
//
//                             myTable.row.add([
//                                 moneta.moneta,
//                                 moneta.quantita,
//                                 formatterEUR.format(parseFloat(Math.round(resultMoneta.EUR * moneta.quantita * 100) / 100).toFixed(2)),
//                                 formatterUSD.format(parseFloat(Math.round(resultMoneta.USD * moneta.quantita * 100) / 100).toFixed(2)),
//                                 formatterEUR.format(moneta.investimento)
//                             ]).draw(false);
//
//                             var monetaID = "";
//                             switch (moneta.moneta) {
//                                 case "BTC":
//                                     monetaID = "bitcoin"
//                                     break;
//                                 case "LTC":
//                                     monetaID = "litecoin"
//                                     break;
//                                 case "XMR":
//                                     monetaID = "monero";
//                                     break;
//                                 case "ETH":
//                                     monetaID = "ethereum"
//                                     break;
//                                 default:
//                                     monetaID = "bitcoin"
//                             }
//
//                             $.ajax({
//                                 url: "https://api.coinmarketcap.com/v1/ticker/" + monetaID + "/?convert=EUR",
//                                 success: function (result) {
//
//
//
//                                     myTableCurrentPrice.row.add([
//                                         moneta.moneta,
//                                         formatterEUR.format(resultMoneta.EUR),
//                                         formatterUSD.format(resultMoneta.USD),
//                                         result[0].percent_change_24h
//                                     ]).draw(false);
//                                 }
//                             })
//
//
//                         },
//                         error: function (err) {
//                             alert(err)
//                         }
//                     })
//
//                 })
//
//
//
//                 var chart = new CanvasJS.Chart("chartContainerPie", {
//                     exportEnabled: false,
//                     animationEnabled: true,
//                     theme: "dark2",
//                     title: {
//                         text: "Percentuale monete"
//                     },
//                     data: [{
//                         type: "pie",
//
//                         showInLegend: false,
//                         toolTipContent: "{name}: <strong>{y}%</strong>",
//                         indexLabel: "{name} - {y}%",
//                         dataPoints: pieData
//                     }]
//                 });
//                 chart.render();
//
//
//             }
//         });
//     }
//
//
//
//     function stringToDate(_date,_format,_delimiter)
//     {
//         var formatLowerCase=_format.toLowerCase();
//         var formatItems=formatLowerCase.split(_delimiter);
//         var dateItems=_date.split(_delimiter);
//         var monthIndex=formatItems.indexOf("mm");
//         var dayIndex=formatItems.indexOf("dd");
//         var yearIndex=formatItems.indexOf("yyyy");
//         var month=parseInt(dateItems[monthIndex]);
//         month-=1;
//         var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
//         return formatedDate;
//     }
//
//
//
//     function updateProfitChart() {
//         $.ajax({
//             url: "/profits",
//             success: function (result) {
//
//                 var dataUSD = [];
//
//                 for (index in result) {
//
//
//
//                     var profit = result[index]
//                     var date =  new Date(profit.date);
//
//                     var splitted = profit.date.split("-");
//
//                     dataUSD.push({ x: stringToDate(profit.date, "dd-MM-yyyy", "-"), y: parseInt(profit.guadagno)})
//     }
//
//
//                 var chart = new CanvasJS.Chart("chartContainerProfit", {
//                     animationEnabled: true,
//                     theme: "dark2",
//                     title: {
//                         text: "Guadagno Totale "
//                     },
//                     axisX: {
//                         valueFormatString: "DD MMM",                        // interval: 1,
//                         // intervalType: "month"
//                         // crosshair: {
//                         //     enabled: true,
//                         //     snapToDataPoint: true
//                         // }
//                     },
//                     // axisY: {
//                     //     title: "Prezzo in €, $",
//                     //     // crosshair: {
//                     //     //     enabled: true
//                     //     // }
//                     // },
//                     toolTip: {
//                         shared: true
//                     },
//                     legend: {
//                         cursor: "pointer",
//                         fontSize: 16,
//                     },
//                     data: [{
//                         indexLabel: "{y} €",
//                         name: "Prezzo in €",
//                         type: "area",
//                         showInLegend: true,
//                         name: "€",
//                         markerType: "square",
//                         color: "#2c71f0",
//                         dataPoints: dataUSD
//                     }
//                     ]
//                 });
//                 chart.render();
//
//
//             }
//         });
//
//
//     }
//
//
//     function updateCharPrice(moneta) {
//         $.ajax({
//             url: "https://min-api.cryptocompare.com/data/histoday?fsym=" + moneta + "&tsym=USD&limit=60&aggregate=3&e=CCCAGG",
//             success: function (result) {
//
//                 var dataUSD = [];
//
//                 for (index in result.Data) {
//
//                     var date = new Date(result.Data[index].time * 1000);
//                     dataUSD.push({x: date, y: result.Data[index].close})
//                 }
//
//
//                 $.ajax({
//                     url: "https://min-api.cryptocompare.com/data/histoday?fsym=" + moneta + "&tsym=EUR&limit=60&aggregate=3&e=CCCAGG",
//                     success: function (result) {
//
//                         var dataEUR = [];
//
//                         for (index in result.Data) {
//
//                             var date = new Date(result.Data[index].time * 1000);
//                             dataEUR.push({x: date, y: result.Data[index].close})
//                         }
//
//                         var chart = new CanvasJS.Chart("chartContainer", {
//                             animationEnabled: true,
//                             theme: "dark2",
//                             title: {
//                                 text: "Prezzo " + moneta
//                             },
//                             axisX: {
//                                 valueFormatString: "DD MMM",
//                                 // crosshair: {
//                                 //     enabled: true,
//                                 //     snapToDataPoint: true
//                                 // }
//                             },
//                             axisY: {
//                                 title: "Prezzo in €, $",
//                                 // crosshair: {
//                                 //     enabled: true
//                                 // }
//                             },
//                             toolTip: {
//                                 shared: true
//                             },
//                             legend: {
//                                 cursor: "pointer",
//                                 fontSize: 16,
//                             },
//                             data: [{
//                                 name: "Prezzo in €",
//                                 type: "line",
//                                 showInLegend: true,
//                                 name: "€",
//                                 markerType: "square",
//                                 xValueFormatString: "DD MMM, YYYY",
//                                 color: "#F08080",
//                                 dataPoints: dataEUR
//                             }, {
//                                 name: "Prezzo in $",
//                                 type: "line",
//                                 showInLegend: true,
//                                 name: "$",
//                                 markerType: "square",
//                                 xValueFormatString: "DD MMM, YYYY",
//                                 color: "#2b43f0",
//                                 dataPoints: dataUSD
//                             }
//                             ]
//                         });
//                         chart.render();
//
//                     }
//                 });
//
//
//             }
//         });
//     }
//
//
// });