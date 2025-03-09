module.exports = async function (context, req) {
    context.log('Processing doctor attendance submission.');

    const doctorId = req.body.doctor_id;
    const doctorName = req.body.doctor_name;
    const status = req.body.status; // Should be 'P', 'AB', or 'A'

    if (!doctorId || !doctorName || !status) {
        context.res = {
            status: 400,
            body: "Please pass doctor_id, doctor_name, and status (P, AB, or A) in the request."
        };
        return;
    }

    // Create the record to insert.
    const record = {
        DoctorID: parseInt(doctorId),
        DoctorName: doctorName,
        Status: status,
        Timestamp: new Date().toISOString()
    };

    // Use the SQL output binding to insert the record.
    context.bindings.outputDocument = record;

    context.res = {
        status: 200,
        body: "Doctor attendance record inserted successfully."
    };
};
