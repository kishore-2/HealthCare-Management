module.exports = async function (context, req) {
    context.log("Processing resource request submission.");

    const itemName = req.body.item_name;
    const quantity = req.body.quantity;
    const requester = req.body.requester; // e.g., "PHC" or "Sub-Center"

    if (!itemName || !quantity || !requester) {
        context.res = {
            status: 400,
            body: "Please pass item_name, quantity, and requester in the request."
        };
        return;
    }

    const record = {
        ItemName: itemName,
        Quantity: parseInt(quantity),
        Requester: requester,
        Status: "Pending"  // default status
    };

    context.bindings.outputDocument = record;

    context.res = {
        status: 200,
        body: "Resource request submitted successfully."
    };
};
