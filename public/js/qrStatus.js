function initQrStatus(token) {
    const qrImage = document.getElementById("qrImage");
    const statusText = document.getElementById("statusText");

    function checkStatus() {
        fetch(`/qr-status/${token}`)
            .then(res => res.json())
            .then(data => {
                if (data.status === "used") {
                    location.reload(); 
                }
            })
            .catch(err => console.error("Error checking QR status:", err));
    }

    setInterval(checkStatus, 3000);
}
