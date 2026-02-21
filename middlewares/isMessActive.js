module.exports.isMessActive = async(req, res, next)=>{
    const user = req.user;

    if (user.messStatus === "inactive") {
        return res.send("Your mess subscription is inactive.");
    }

    if (!user.messSubscription?.endDate) {
        return res.send("Subscription data missing.");
    }

    const today = new Date();

    if (today > user.messSubscription.endDate) {
        user.messStatus = "inactive";
        await user.save();
        return res.send("Your subscription has expired.");
    }

    next();
}