import {useState} from "react";
import {FaArrowLeft, FaArrowRight, FaSpinner, FaWindowClose} from "react-icons/fa";
import axios from '../utils/axios';
import Logo from "./Logo";

const Configurator = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        product: "",
        installationType: "",
        dimensions: {width: '', depth: ''},
        color: "",
        led: "",
        service: false,
        branch: "",
        name: "",
        email: "",
        phone: "",
    });
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const reset = () => {
        setFormData({
            product: "",
            installationType: "",
            dimensions: {width: '', depth: ''},
            color: "",
            led: "",
            service: false,
            branch: "",
            name: "",
            email: "",
            phone: "",
        });
        setErrors({});
    }

    // Update form data as the user makes selections
    const handleChange = (e) => {
        const {name, value} = e.target;
        // For dimensions, update the nested properties specifically
        if (name.startsWith('dimensions.')) {
            const dimensionName = name.split('.')[1]; // 'width' or 'depth'
            setFormData((prevData) => ({
                ...prevData,
                dimensions: {
                    ...prevData.dimensions,
                    [dimensionName]: value, // Update specific dimension (width or depth)
                },
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value, // Update other fields
            }));
        }

        // Clear the specific error if the user corrects the input
        if (errors[name]) {
            setErrors((prevErrors) => {
                const newErrors = {...prevErrors};
                delete newErrors[name]; // Remove error if the user corrected the input
                return newErrors;
            });
        }

        console.log('Form Data:', formData);
    };

    const handleValidation = () => {
        let newErrors = {};
        if (step === 1 && !formData.product) {
            newErrors.product = "Product selection is required.";
        } else if (step === 2 && !formData.installationType) {
            newErrors.installationType = "Installation type is required.";
        } else if (step === 3) {
            if (!formData.dimensions.width) {
                newErrors.width = "Width is required.";
            }
            if (!formData.dimensions.depth) {
                newErrors.depth = "Depth is required.";
            }
        } else if (step === 4 && !formData.color) {
            newErrors.color = "Color selection is required.";
        } else if (step === 5 && !formData.led) {
            newErrors.led = "LED option selection is required.";
        } else if (step === 6 && formData.service === undefined) {
            newErrors.service = "Installation service selection is required.";
        } else if (step === 7 && !formData.branch) {
            newErrors.branch = "Branch selection is required.";
        } else if (step === 8) {
            if (!formData.name) {
                newErrors.name = "Name is required.";
            }
            if (!formData.email) {
                newErrors.email = "Email is required.";
            }
            if (!formData.phone) {
                newErrors.phone = "Phone number is required.";
            }
        }
        return newErrors;
    };

    const setStepAccordingToError = (errors) => {
        if (errors.product) {
            setStep(1);
        } else if (errors.installationType) {
            setStep(2);
        } else if (errors.width || errors.depth) {
            setStep(3);
        } else if (errors.color) {
            setStep(4);
        } else if (errors.led) {
            setStep(5);
        } else if (errors.service) {
            setStep(6);
        } else if (errors.branch) {
            setStep(7);
        } else if (errors.name || errors.email || errors.phone) {
            setStep(8);
        }
    }

    const handleSubmit = async () => {
        const validationErrors = handleValidation();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return; // Don't submit if there are validation errors
        }

        console.log("Submitting configuration", formData);
        setLoading(true);
        try {
            const response = await axios.post("/configurations", formData);
            setSuccessMessage(response.data.message);
            setStep(1);  // Reset to the first step
            reset();
        } catch (error) {
            // Check for 422 status code and set errors from the server
            if (error.response && error.response.status === 422) {
                console.log("Validation errors:", error.response.data.errors);
                setErrors(error.response.data.errors); // Assuming server sends errors object
                // set step to the step where the error occurred, if multiple then set first one
                setStepAccordingToError(error.response.data.errors);

            } else {
                console.error("An unexpected error occurred:", error);
                setErrorMessage("Failed to submit configuration. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleNextStep = () => {
        const validationErrors = handleValidation();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setStep(step + 1);  // Proceed to the next step if there are no errors
        }
    };

    const handlePreviousStep = () => {
        setStep(step - 1);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-4/5 md:w-3/5 lg:w-2/5">
                <div className="flex justify-center mb-5">
                    <Logo/>
                </div>
                {/* Display error message if there's an error. Show by alert */}
                {errorMessage && <div
                    className="bg-red-100 text-red-500 p-4 rounded-lg text-center mb-3 flex justify-between items-center">
                    <div>
                        {errorMessage}
                    </div>
                    <div className="flex items-center">
                        <button onClick={() => setErrorMessage("")} className="text-red-500 underline">
                            <FaWindowClose/>
                        </button>
                    </div>
                </div>}

                {/* Display success message if there's a success message. Show by alert */}
                {successMessage && <div
                    className="bg-green-100 text-green-500 p-4 rounded-lg text-center mb-3 flex justify-between items-center">
                    <div>
                        {successMessage}
                    </div>
                    <div className="flex items-center">
                        <button onClick={() => setSuccessMessage("")} className="text-red-400 underline">
                            <FaWindowClose/>
                        </button>
                    </div>
                </div>}

                {/* Step 1: Product Selection */}
                {step === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold">Step 1: Choose Product</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="card p-4 bg-gray-50 rounded-lg shadow-md">
                                <label htmlFor="product" className="block text-sm font-medium">Select Product</label>
                                <select
                                    id="product"
                                    name="product"
                                    className={`mt-1 block w-full p-2 bg-white border ${errors.product ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                                    onChange={handleChange}
                                    value={formData.product}
                                >
                                    <option value="">Select Product</option>
                                    <option value="patio_cover">Patio Cover</option>
                                    <option value="carport">Carport</option>
                                    <option value="winter_garden">Winter Garden</option>
                                </select>
                                {errors.product && <p className="text-red-500 text-sm">{errors.product}</p>}
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button
                                className={
                                    `bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 ${loading ? 'cursor-not-allowed opacity-50' : ''}`
                                }
                                onClick={handleNextStep}
                                disabled={loading}
                            >
                                Next <FaArrowRight className="inline-block ml-2"/>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Installation Type Selection */}
                {step === 2 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold">Step 2: Installation Type</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="card p-4 bg-gray-50 rounded-lg shadow-md">
                                <label htmlFor="installationType" className="block text-sm font-medium">Select
                                    Installation Type</label>
                                <select
                                    id="installationType"
                                    name="installationType"
                                    className={`mt-1 block w-full p-2 bg-white border ${errors.installationType ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                                    onChange={handleChange}
                                    value={formData.installationType}
                                >
                                    <option value="">Select Installation Type</option>
                                    <option value="attached">Attached</option>
                                    <option value="freestanding">Freestanding</option>
                                    <option value="consultation">I need consultation</option>
                                </select>
                                {errors.installationType &&
                                    <p className="text-red-500 text-sm">{errors.installationType}</p>}
                            </div>
                        </div>
                        <div className="flex justify-between mt-6">
                            <button
                                className={
                                    `bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 ${loading ? 'cursor-not-allowed opacity-50' : ''}`
                                }
                                onClick={handlePreviousStep}
                                disabled={loading}
                            >
                                <FaArrowLeft className="inline-block mr-2"/>
                                Previous
                            </button>
                            <button
                                className={
                                    `bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 ${loading ? 'cursor-not-allowed opacity-50' : ''}`
                                }
                                onClick={handleNextStep}
                                disabled={loading}
                            >
                                Next <FaArrowRight className="inline-block ml-2"/>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Adjust Dimensions */}
                {step === 3 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold">Step 3: Adjust Dimensions</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="card p-4 bg-gray-50 rounded-lg shadow-md">
                                <label htmlFor="width" className="block text-sm font-medium">Width (in cm)</label>
                                <input
                                    type="number"
                                    id="width"
                                    name="dimensions.width"
                                    value={formData.dimensions.width}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full p-2 bg-white border ${errors.width ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                                />
                                {errors.width && <p className="text-red-500 text-sm">{errors.width}</p>}
                            </div>
                            <div className="card p-4 bg-gray-50 rounded-lg shadow-md">
                                <label htmlFor="depth" className="block text-sm font-medium">Depth (in cm)</label>
                                <input
                                    type="number"
                                    id="depth"
                                    name="dimensions.depth"
                                    value={formData.dimensions.depth}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full p-2 bg-white border ${errors.depth ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                                />
                                {errors.depth && <p className="text-red-500 text-sm">{errors.depth}</p>}
                            </div>
                        </div>
                        <div className="flex justify-between mt-6">
                            <button
                                className={
                                    `bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 ${loading ? 'cursor-not-allowed opacity-50' : ''}`
                                }
                                onClick={handlePreviousStep}
                                disabled={loading}
                            >
                                <FaArrowLeft className="inline-block mr-2"/>
                                Previous
                            </button>
                            <button
                                className={
                                    `bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 ${loading ? 'cursor-not-allowed opacity-50' : ''}`
                                }
                                onClick={handleNextStep}
                                disabled={loading}
                            >
                                Next <FaArrowRight className="inline-block ml-2"/>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Color Selection */}
                {step === 4 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold">Step 4: Choose Color</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="card p-4 bg-gray-50 rounded-lg shadow-md">
                                <label htmlFor="color" className="block text-sm font-medium">Select Color</label>
                                <select
                                    id="color"
                                    name="color"
                                    className={`mt-1 block w-full p-2 bg-white border ${errors.color ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                                    onChange={handleChange}
                                    value={formData.color}
                                >
                                    <option value="">Select Color</option>
                                    <option value="white">White</option>
                                    <option value="black">Black</option>
                                    <option value="gray">Gray</option>
                                </select>
                                {errors.color && <p className="text-red-500 text-sm">{errors.color}</p>}
                            </div>
                        </div>
                        <div className="flex justify-between mt-6">
                            <button
                                className={
                                    `bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 ${loading ? 'cursor-not-allowed opacity-50' : ''}`
                                }
                                onClick={handlePreviousStep}
                                disabled={loading}
                            >
                                <FaArrowLeft className="inline-block mr-2"/>
                                Previous
                            </button>
                            <button
                                className={
                                    `bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 ${loading ? 'cursor-not-allowed opacity-50' : ''}`
                                }
                                onClick={handleNextStep}
                                disabled={loading}
                            >
                                Next <FaArrowRight className="inline-block ml-2"/>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 5: LED Option Selection */}
                {step === 5 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold">Step 5: Choose LED Option</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="card p-4 bg-gray-50 rounded-lg shadow-md">
                                <label htmlFor="led" className="block text-sm font-medium">Select LED Option</label>
                                <select
                                    id="led"
                                    name="led"
                                    className={`mt-1 block w-full p-2 bg-white border ${errors.led ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                                    onChange={handleChange}
                                    value={formData.led}
                                >
                                    <option value="">Select LED Option</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                                {errors.led && <p className="text-red-500 text-sm">{errors.led}</p>}
                            </div>
                        </div>
                        <div className="flex justify-between mt-6">
                            <button
                                className={
                                    `bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 ${loading ? 'cursor-not-allowed opacity-50' : ''}`
                                }
                                onClick={handlePreviousStep}
                                disabled={loading}
                            >
                                <FaArrowLeft className="inline-block mr-2"/>
                                Previous
                            </button>
                            <button
                                className={
                                    `bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 ${loading ? 'cursor-not-allowed opacity-50' : ''}`
                                }
                                onClick={handleNextStep}
                                disabled={loading}
                            >
                                Next <FaArrowRight className="inline-block ml-2"/>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 6: Installation Service */}
                {step === 6 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold">Step 6: Choose Installation Service</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="card p-4 bg-gray-50 rounded-lg shadow-md">
                                <label htmlFor="service" className="block text-sm font-medium">Require Installation
                                    Service</label>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="service"
                                        name="service"
                                        onChange={(e) => setFormData((prevData) => ({
                                            ...prevData,
                                            service: e.target.checked,
                                        }))}
                                        checked={formData.service}
                                        className={`mr-2 ${errors.service ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    <span>Yes, I need installation service</span>
                                </div>
                                {errors.service && <p className="text-red-500 text-sm">{errors.service}</p>}
                            </div>
                        </div>
                        <div className="flex justify-between mt-6">
                            <button
                                className={
                                    `bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 ${loading ? 'cursor-not-allowed opacity-50' : ''}`
                                }
                                onClick={handlePreviousStep}
                                disabled={loading}
                            >
                                <FaArrowLeft className="inline-block mr-2"/>
                                Previous
                            </button>
                            <button
                                className={
                                    `bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 ${loading ? 'cursor-not-allowed opacity-50' : ''}`
                                }
                                onClick={handleNextStep}
                                disabled={loading}
                            >
                                Next <FaArrowRight className="inline-block ml-2"/>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 7: Branch Selection */}
                {step === 7 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold">Step 7: Select Branch</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="card p-4 bg-gray-50 rounded-lg shadow-md">
                                <label htmlFor="branch" className="block text-sm font-medium">Select Branch</label>
                                <select
                                    id="branch"
                                    name="branch"
                                    className={`mt-1 block w-full p-2 bg-white border ${errors.branch ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                                    onChange={handleChange}
                                    value={formData.branch}
                                >
                                    <option value="">Select Branch</option>
                                    <option value="dhaka">Dhaka</option>
                                    <option value="chittagong">Chittagong</option>
                                    <option value="rajshahi">Rajshahi</option>
                                </select>
                                {errors.branch && <p className="text-red-500 text-sm">{errors.branch}</p>}
                            </div>
                        </div>
                        <div className="flex justify-between mt-6">
                            <button
                                className={
                                    `bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 ${loading ? 'cursor-not-allowed opacity-50' : ''}`
                                }
                                onClick={handlePreviousStep}
                                disabled={loading}
                            >
                                <FaArrowLeft className="inline-block mr-2"/>
                                Previous
                            </button>
                            <button
                                className={
                                    `bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 ${loading ? 'cursor-not-allowed opacity-50' : ''}`
                                }
                                onClick={handleNextStep}
                                disabled={loading}
                            >
                                Next <FaArrowRight className="inline-block ml-2"/>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 8: User Details */}
                {step === 8 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold">Step 8: Your Details</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="card p-4 bg-gray-50 rounded-lg shadow-md">
                                <label htmlFor="name" className="block text-sm font-medium">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full p-2 bg-white border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                                />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                            </div>
                            <div className="card p-4 bg-gray-50 rounded-lg shadow-md">
                                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full p-2 bg-white border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                            </div>
                            <div className="card p-4 bg-gray-50 rounded-lg shadow-md">
                                <label htmlFor="phone" className="block text-sm font-medium">Phone Number</label>
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full p-2 bg-white border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                                />
                                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                            </div>
                        </div>
                        <div className="flex justify-between mt-6">
                            <button
                                className={
                                    `bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 ${loading ? 'cursor-not-allowed opacity-50' : ''}`
                                }
                                onClick={handlePreviousStep}
                                disabled={loading}
                            >
                                <FaArrowLeft className="inline-block mr-2"/>
                                Previous
                            </button>
                            <button
                                className={
                                    `bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 ${loading ? 'cursor-not-allowed opacity-50' : ''}`
                                }
                                onClick={handleNextStep}
                                disabled={loading}
                            >
                                Next <FaArrowRight className="inline-block ml-2"/>
                            </button>
                        </div>
                    </div>
                )}

                {/* Final Review Step */}
                {step === 9 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold">Step 9: Review & Submit</h2>
                        <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                            <h3 className="font-medium text-lg">Your Configuration</h3>
                            <div className="mt-4">
                                <p><strong>Product:</strong> {formData.product}</p>
                                <p><strong>Installation Type:</strong> {formData.installationType}</p>
                                <p>
                                    <strong>Dimensions:</strong> {formData.dimensions.width} x {formData.dimensions.depth} cm
                                </p>
                                <p><strong>Color:</strong> {formData.color}</p>
                                <p><strong>LED Option:</strong> {formData.led}</p>
                                <p><strong>Service:</strong> {formData.service ? "Yes" : "No"}</p>
                                <p><strong>Branch:</strong> {formData.branch}</p>
                                <p><strong>Name:</strong> {formData.name}</p>
                                <p><strong>Email:</strong> {formData.email}</p>
                                <p><strong>Phone:</strong> {formData.phone}</p>
                            </div>
                        </div>
                        <div className="flex justify-between mt-6">
                            <button
                                className={
                                    `bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 ${loading ? 'cursor-not-allowed opacity-50' : ''}`
                                }
                                onClick={handlePreviousStep}
                                disabled={loading}
                            >
                                <FaArrowLeft className="inline-block mr-2"/>
                                Edit
                            </button>
                            <button
                                className={
                                    `bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 flex items-center ${loading ? 'cursor-not-allowed opacity-50' : ''}`
                                }
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                Submit {loading && <FaSpinner className="animate-spin ml-2"/>}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Configurator;
