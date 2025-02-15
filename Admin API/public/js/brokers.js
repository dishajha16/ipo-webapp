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
document.addEventListener("DOMContentLoaded", function () {
    const brokers = [
        { name: "Upstox", rating: "⭐⭐⭐⭐⭐", reviews: "15K", accounts: "50.2K", openingCharge: "₹0", maintenanceCharge: "₹200", deliveryBrokerage: "₹20", intradayBrokerage: "₹20", logo: "upstox-logo.png" },
        { name: "Angel One", rating: "⭐⭐⭐⭐", reviews: "15K", accounts: "50.2K", openingCharge: "₹0", maintenanceCharge: "₹20/month", deliveryBrokerage: "₹0", intradayBrokerage: "₹20", logo: "angelone-logo.png" },
        { name: "Groww", rating: "⭐⭐⭐⭐", reviews: "20K", accounts: "60K", openingCharge: "₹0", maintenanceCharge: "₹200", deliveryBrokerage: "₹0", intradayBrokerage: "₹20", logo: "groww-logo.png" },
        { name: "Dhan", rating: "⭐⭐⭐⭐", reviews: "12K", accounts: "30K", openingCharge: "₹0", maintenanceCharge: "₹180", deliveryBrokerage: "₹0", intradayBrokerage: "₹20", logo: "dhan-logo.png" },
        { name: "Alice Blue", rating: "⭐⭐⭐⭐", reviews: "8K", accounts: "25K", openingCharge: "₹0", maintenanceCharge: "₹150", deliveryBrokerage: "₹0", intradayBrokerage: "₹20", logo: "aliceblue-logo.png" },
        { name: "Axis Direct", rating: "⭐⭐⭐⭐", reviews: "10K", accounts: "35K", openingCharge: "₹250", maintenanceCharge: "₹300", deliveryBrokerage: "₹0", intradayBrokerage: "₹20", logo: "axisdirect-logo.png" },
        { name: "Fyers", rating: "⭐⭐⭐⭐", reviews: "5K", accounts: "15K", openingCharge: "₹0", maintenanceCharge: "₹120", deliveryBrokerage: "₹0", intradayBrokerage: "₹20", logo: "fyers-logo.png" },
        { name: "Geojit", rating: "⭐⭐⭐⭐", reviews: "7K", accounts: "22K", openingCharge: "₹0", maintenanceCharge: "₹240", deliveryBrokerage: "₹0", intradayBrokerage: "₹20", logo: "geojit-logo.png" },
        { name: "HDFC Securities", rating: "⭐⭐⭐⭐", reviews: "18K", accounts: "80K", openingCharge: "₹999", maintenanceCharge: "₹500", deliveryBrokerage: "₹0", intradayBrokerage: "₹20", logo: "hdfc-logo.png" },
        { name: "Zerodha", rating: "⭐⭐⭐⭐⭐", reviews: "50K", accounts: "200K", openingCharge: "₹200", maintenanceCharge: "₹300", deliveryBrokerage: "₹0", intradayBrokerage: "₹20", logo: "zerodha-logo.png" }
    ];

    const brokersList = document.getElementById("brokers-list");

    brokers.forEach(broker => {
        const brokerCard = document.createElement("div");
        brokerCard.classList.add("broker-card");

        brokerCard.innerHTML = `
            <div class="broker-info">
                <div class="broker-name">${broker.name}</div>
                <div class="rating">${broker.rating}</div>
                <div>👤 ${broker.reviews} Reviews &nbsp; 📊 ${broker.accounts} Accounts</div>
                <div class="features">
                    <span class="feature">✔ Equity</span>
                    <span class="feature">✔ Commodity</span>
                    <span class="feature">✔ Currency</span>
                    <span class="feature">✔ Futures</span>
                    <span class="feature">✔ Options</span>
                </div>
                <div class="charges">
                    A/C Opening Charge: ${broker.openingCharge} <br>
                    Maintenance Charge: ${broker.maintenanceCharge} <br>
                    Delivery Brokerage: ${broker.deliveryBrokerage} <br>
                    Intraday Brokerage: ${broker.intradayBrokerage}
                </div>
                <div class="buttons">
                    <button class="open-account botn">Open A/C 🚀</button>
                    <button class="learn-more botn">Learn More</button>
                </div>
            </div>
            <img src="images/${broker.logo}" alt="${broker.name}" class="broker-logo">
        `;

        brokersList.appendChild(brokerCard);
    });
});
