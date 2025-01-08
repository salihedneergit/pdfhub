module.exports = (req, res, next) => {
    const validReferrer = req.headers['referer'] || '';
    const customHeader = req.headers['x-custom-auth'];

    if (!validReferrer.includes(process.env.ALLOWED_FRONTEND_DOMAIN)) {
        return res.status(403).send('Access Forbidden: Invalid Referrer');
    }

    if (customHeader !== process.env.CUSTOM_ACCESS_KEY) {
        return res.status(403).send('Access Forbidden: Invalid Header');
    }

    next();
};
