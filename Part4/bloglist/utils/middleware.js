const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
        return response.status(400).json({ error: 'expected `username` to be unique' })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'token invalid' })
    }

    next(error)
}

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        req.token = authorization.replace('Bearer ', '').trim()
    }
    next()
}

const userExtractor = async (req, res, next) => {
    const token = req.token;

    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.SECRET);

            if (decodedToken && decodedToken.id) {
                const user = await User.findById(decodedToken.id);

                if (user) {
                    req.user = user;
                    next();
                } else {
                    res.status(404).json({ error: 'User not found' });
                }
            } else {
                res.status(401).json({ error: 'Token does not contain a valid user ID' });
            }
        } catch (error) {
            res.status(401).json({ error: 'Token is invalid' });
        }
    } else {
        res.status(401).json({ error: 'Token is missing' });
    }
};

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}