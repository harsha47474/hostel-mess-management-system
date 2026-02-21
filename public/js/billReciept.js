function showReceipt(id) {
    const bill = billsData.find(b => b._id === id);
    if (!bill) return;

    const content = `
        <p><strong>Transaction ID:</strong> ${bill.transactionId}</p>
        <p><strong>Payment Date:</strong> ${new Date(bill.paymentDate).toDateString()}</p>
        <p><strong>Subscription From:</strong> ${new Date(bill.startDate).toDateString()}</p>
        <p><strong>Subscription Till:</strong> ${new Date(bill.endDate).toDateString()}</p>
        <p><strong>Amount Paid:</strong> ₹ ${bill.amount}</p>
    `;

    document.getElementById("receiptContent").innerHTML = content;

    // 🔥 Attach download route dynamically
    document.getElementById("downloadBtn").onclick = function () {
        window.location.href = `/student/receipt/${bill._id}/download`;
    };

    document.getElementById("receiptModal").style.display = "flex";
}

function closeReceipt() {
  document.getElementById("receiptModal").style.display = "none";
}