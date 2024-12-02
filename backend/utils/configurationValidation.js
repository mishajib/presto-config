const validator = require("validator"); // Import the validator library

// Validation function
const validateConfiguration = (data) => {
    const errors = {};

    // Validate required fields
    if (!data.product) errors.product = "Product is required";
    if (!data.installationType) errors.installationType = "Installation Type is required";
    if (!data.dimensions || !data.dimensions.width || !data.dimensions.depth) errors.dimensions = "Dimensions (width and depth) are required";
    if (!data.color) errors.color = "Color is required";
    if (!data.led) errors.led = "LED option is required";
    if (data.service === undefined) errors.service = "Service option is required";
    if (!data.branch) errors.branch = "Branch is required";
    if (!data.name) errors.name = "Name is required";
    if (!data.phone) errors.phone = "Phone number is required";

    // Validate email
    if (data.email && !validator.isEmail(data.email)) {
        errors.email = "Invalid email format";
    } else if (!data.email) {
        errors.email = "Email is required";
    }

    return errors;
};

module.exports = validateConfiguration; // Export the validation function