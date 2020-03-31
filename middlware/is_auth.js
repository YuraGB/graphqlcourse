const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }


    const token = authHeader.split(' ')[1];
    let decodeToken;
    if (!token || token === ' ') {
        return next();
    }
    try {
        decodeToken = jwt.verify(token, 'somesecretkey');
    } catch (e) {
        console.log(e);
        req.isAuth = false;
        return next();
    }

    if (!decodeToken) {
        req.isAuth = false;
        return next();
    }

    req.isAuth = true;
    req.userId = decodeToken.userId;
    return next();
};

