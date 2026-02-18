function initQrScanner() {

    const resultBox = document.getElementById("resultBox");
    const scanStatus = document.getElementById("scanStatus");

    function onScanSuccess(decodedText) {

        fetch("/admins/scan", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token: decodedText })
        })
        .then(res => res.json())
        .then(data => {

            scanStatus.innerHTML = "Processing...";
            
            if (data.success) {

                resultBox.classList.remove("hidden");

                resultBox.innerHTML = `
                    <div class="success-icon">✔</div>
                    <div class="result-title">Attendance Marked</div>

                    <div class="result-row">
                        <span>Student</span>
                        <strong>${data.student}</strong>
                    </div>

                    <div class="result-row">
                        <span>Meal</span>
                        <strong>${data.meal}</strong>
                    </div>

                    <div class="result-row">
                        <span>Plate</span>
                        <strong>${data.plate}</strong>
                    </div>

                    <p style="margin-top:20px;color:#6b7280;">
                        Resetting in a few seconds...
                    </p>
                `;

                scanStatus.innerHTML = "✅ Attendance Marked";

                setTimeout(() => {
                    resultBox.classList.add("hidden");
                    scanStatus.innerHTML = "🟢 Ready to Scan";
                }, 4000);

            } else {

                scanStatus.innerHTML = "❌ " + data.message;

                setTimeout(() => {
                    scanStatus.innerHTML = "🟢 Ready to Scan";
                }, 3000);
            }

        })
        .catch(err => {
            console.error("Scan error:", err);
        });
    }

    const html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        onScanSuccess
    );
}
