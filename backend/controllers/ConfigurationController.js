const catchAsync = require('../utils/catchAsync');
const Configuration = require('../models/configuration');
const nodemailer = require("nodemailer");
const validateConfiguration = require("../utils/configurationValidation");
const sendEmail = require("../utils/email");

/**
 * Display a listing of the resource.
 */
exports.index = catchAsync(async (req, res) => {
    const page     = parseInt(req.query.page) || 1; // Get the page parameter from the request query, default to page 1
    const pageSize = 10; // Set the number of tasks per page
    const offset   = (page - 1) * pageSize; // Calculate the offset based on the current page

    const configurations = await Configuration.findAll({
        limit : pageSize,
        offset: offset,
    });
    // Get the total number of tasks
    const totalConfigs = await Configuration.count();

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalConfigs / pageSize);


    const pagination = {
        currentPage: page,
        pageSize   : pageSize,
        totalConfigs : totalConfigs,
        totalPages : totalPages,
        offset     : offset,
        meta: {
            previous: page > 1 ? page - 1 : null,
            next    : page < totalPages ? page + 1 : null,
        }
    };

    return res.json({
        title: "Configurations",
        configurations,
        pagination: pagination,
    });
});


/**
 * Display a listing of the resource.
 */
exports.store = catchAsync(async (req, res) => {
    try {
        const errors = validateConfiguration(req.body);

        if (Object.keys(errors).length) {
            return res.status(422).json({errors});
        }

        const { product, installationType, dimensions, color, led, service, branch, name, email, phone } = req.body;

        // Save the configuration to DB
        const newConfig = await Configuration.create({
            product,
            installationType,
            dimensions,
            color,
            led,
            service,
            branch,
            name,
            email,
            phone,
        });

        // Send email to branch
        await sendEmail({
            to: `${branch}@prestoconfig.mi-shajib.com`,  // Dynamically send to the selected branch email
            subject: `New Configuration Request from ${name}`,
            message: `Product: ${product}\nInstallation Type: ${installationType}\nDimensions: ${JSON.stringify(dimensions)}\nColor: ${color}\nLED: ${led}\nService: ${service}\nBranch: ${branch}\nName: ${name}\nEmail: ${email}\nPhone: ${phone}`,
        });

        return res.json({
            message: "Configuration saved successfully",
            newConfig,
        })
    } catch (error) {
        console.error(error);
        res.status(500).send("Error saving configuration");
    }
});