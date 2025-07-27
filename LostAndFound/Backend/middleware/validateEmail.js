// Middleware to validate Thapar email addresses
const validateThaparEmail = (req, res, next) => {
    const email = req.body.email;

    if (!email.endsWith('@thapar.edu')) {
        return res.status(400).json({ message: 'Only Thapar University email addresses are allowed.' });
    }

    next();
};

module.exports = validateThaparEmail;
