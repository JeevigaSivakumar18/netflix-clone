const Joi = require('joi');

// User validation schemas
const userRegistrationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  }),
  name: Joi.string().max(50).optional()
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

// Movie validation schemas
const movieSchema = Joi.object({
  title: Joi.string().max(100).required().messages({
    'string.max': 'Title cannot exceed 100 characters',
    'any.required': 'Movie title is required'
  }),
  description: Joi.string().max(1000).required().messages({
    'string.max': 'Description cannot exceed 1000 characters',
    'any.required': 'Movie description is required'
  }),
  genre: Joi.array().items(Joi.string()).min(1).required().messages({
    'array.min': 'At least one genre is required',
    'any.required': 'Genre is required'
  }),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 2).required().messages({
    'number.min': 'Year must be after 1900',
    'number.max': 'Year cannot be more than 2 years in the future',
    'any.required': 'Release year is required'
  }),
  rating: Joi.number().min(0).max(10).optional(),
  duration: Joi.number().min(1).required().messages({
    'number.min': 'Duration must be at least 1 minute',
    'any.required': 'Movie duration is required'
  }),
  poster: Joi.string().uri().required().messages({
    'string.uri': 'Poster must be a valid URL',
    'any.required': 'Poster image is required'
  }),
  backdrop: Joi.string().uri().required().messages({
    'string.uri': 'Backdrop must be a valid URL',
    'any.required': 'Backdrop image is required'
  }),
  trailerUrl: Joi.string().uri().optional(),
  director: Joi.string().optional(),
  cast: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    character: Joi.string().required()
  })).optional(),
  hint: Joi.string().optional(),
  quote: Joi.string().optional(),
  featured: Joi.boolean().optional()
});

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        message: 'Validation failed',
        errors
      });
    }
    
    next();
  };
};

module.exports = {
  userRegistrationSchema,
  userLoginSchema,
  movieSchema,
  validate
};
