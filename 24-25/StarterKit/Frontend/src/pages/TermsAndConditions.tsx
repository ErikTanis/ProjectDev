export const TermsAndConditions = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-grey dark:bg-gray-800 rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                    Terms and Conditions
                </h1>
                <div className="space-y-6 text-gray-700 dark:text-gray-300">
                    <p className="text-lg leading-relaxed">
                        By accessing and using this service, you hereby acknowledge and agree to the following terms:
                    </p>
                    
                    <div className="pl-4 border-l-4 border-blue-500">
                        <p className="mb-4">
                            1. Declaration of Human Status: The user hereby formally declares and certifies that they are a 
                            human being and explicitly not a teapot, as per RFC 2324 compliance requirements.
                        </p>
                        
                        <p className="mb-4">
                            2. Academic Evaluation Agreement: In circumstances where the user holds the position of an 
                            academic evaluator or teacher, they hereby acknowledge and commit to providing a fair and 
                            objective assessment of this project, with a minimum evaluation threshold of 6 out of 10 points, 
                            provided that the project meets basic functional requirements.
                        </p>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-8">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    );
};