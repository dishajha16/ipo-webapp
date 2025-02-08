document.addEventListener("DOMContentLoaded", function () {
    // Function to switch sections
    window.showSection = function (sectionId) {
        document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active"));
        document.getElementById(sectionId).classList.add("active");
    };

    // Charts
    var clientsCtx = document.getElementById("clientsChart").getContext("2d");
    new Chart(clientsCtx, {
        type: "line",
        data: {
            labels: ["2006-17", "2007-18", "2008-19", "2010-20", "2020-21", "2021-22", "2022-23", "2023-24"],
            datasets: [
                { label: "Angel One", data: [1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500], borderColor: "blue", fill: false },
                { label: "Zerodha", data: [800, 1200, 1800, 2200, 2800, 3200, 3800, 4200], borderColor: "orange", fill: false }
            ]
        }
    });

    var complaintsCtx = document.getElementById("complaintsChart").getContext("2d");
    new Chart(complaintsCtx, {
        type: "bar",
        data: {
            labels: ["2016-17", "2017-18", "2018-19", "2019-20", "2020-21", "2021-22", "2022-23", "2023-24"],
            datasets: [
                { label: "Angel One", data: [50, 60, 70, 80, 90, 100, 110, 120], backgroundColor: "blue" },
                { label: "Zerodha", data: [40, 50, 60, 70, 80, 90, 100, 110], backgroundColor: "orange" }
            ]
        }
    });

    var shareholdingCtx = document.getElementById("shareholdingChart").getContext("2d");
    new Chart(shareholdingCtx, {
        type: "pie",
        data: {
            labels: ["Angel One", "Zerodha"],
            datasets: [{
                data: [60, 40],
                backgroundColor: ["blue", "orange"]
            }]
            
        },
        options: {
        responsive: false,  // Disables auto-resizing
        maintainAspectRatio: false,  // Allows custom sizing
    }
    });

    var financialCtx = document.getElementById("financialChart").getContext("2d");
    new Chart(financialCtx, {
        type: "bar",
        data: {
            labels: ["2022-01", "2022-02", "2022-03", "2022-04", "2022-05", "2022-06", "2022-07", "2022-08", "2022-09"],
            datasets: [
                { label: "Revenue", data: [6000, 4000, 3500, 3000, 2500, 2000, 1000, 500, 1000], backgroundColor: "blue" },
                { label: "Profit/Loss", data: [4000, 3000, 2500, 2000, 1500, 1000, 500, 0, 500], backgroundColor: "orange" }
            ]
        }
    });
});
