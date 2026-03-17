const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activitySchema = new Schema(
    {
        action: String, // "added student", "deleted student", "qr_scan"
        performedBy: String, // Admin/Student username (legacy + human-readable)
        target: String, // Target entity (student name)
        type: String, // "student", "complaint", "billing", "scan"

        // ===== Scan audit fields (optional; used when type === "scan") =====
        studentId: { type: Schema.Types.ObjectId, ref: "User" },
        studentName: String,
        mealType: { type: String, enum: ["Breakfast", "Lunch", "Dinner", null], default: null },

        scanStatus: { type: String, enum: ["accepted", "rejected", "duplicate", null], default: null },
        reason: String, // already_scanned, invalid_qr, expired_qr, unauthorized, etc.

        scannedAt: { type: Date, default: null },
        scanDate: { type: Date, default: null }, // normalized day start for queries

        scannerId: { type: Schema.Types.ObjectId, ref: "User" },
        scannerName: String,

        metadata: { type: Schema.Types.Mixed, default: {} }
    },
    { timestamps: true }
);

// Helpful indexes for analytics (sparse so legacy logs don't bloat indexes)
activitySchema.index({ type: 1, scanDate: 1 }, { sparse: true });
activitySchema.index({ type: 1, scanStatus: 1, scanDate: 1 }, { sparse: true });
activitySchema.index({ studentId: 1, scanDate: 1, mealType: 1 }, { sparse: true });

module.exports = mongoose.model("Activity", activitySchema);