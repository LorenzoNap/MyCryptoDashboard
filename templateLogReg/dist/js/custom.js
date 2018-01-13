$( document ).ready(function() {

    $.ajax({
        url: "http://api.minexmr.com:8080/stats_address?address=43sxhXYBxtb3STshLp1RRpAoMBSKhe81WQwNmXtXp7gsGwMuy4wVpuR194t9jqH3cp5UeLZk2bhXu7MH4sqyRMc3MLs3aaD&longpoll=false",
        success: function (response) {

            console.log(response)

        }
    });


});