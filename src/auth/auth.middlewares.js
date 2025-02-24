export function verifyToken(req, res, next){
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).json({ message: 'Token required.' });
        }
        try{
        const {username} =   jwt.verify(token, SECRET_KEY)
        req.username = username;
        next()
       }
       catch(error){
        return res.status(403).json({ message: 'Invalid or expired token.' });
       }
    }