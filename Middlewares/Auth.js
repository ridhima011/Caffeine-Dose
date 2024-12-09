const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({
            message: 'Unauthorized: JWT token is required.',
        });
    }

    const token = authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized: Malformed authorization header.',
        });
    }

    try {
  
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; 
        
        req.userId = decoded.id; 
        // console.log(req.userId);
        
        
        next(); //
    } catch (err) {
        console.error('JWT verification failed:', err.message);

        return res.status(401).json({
            message: 'Unauthorized: Invalid or expired JWT token.',
        });
    }
};

module.exports = ensureAuthenticated;
