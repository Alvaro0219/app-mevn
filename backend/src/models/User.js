import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: [true, 'Por favor ingresa un nombre de usuario'],
        unique: true, 
        trim: true,
        maxlength: [30, 'El nombre de usuario no puede exceder los 30 caracteres']
    },
    email: { 
        type: String, 
        required: [true, 'Por favor ingresa un correo electrónico'],
        unique: true, 
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Por favor ingresa un correo electrónico válido'
        ]
    },
    password: { 
        type: String, 
        required: [true, 'Por favor ingresa una contraseña'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
        select: false
    },
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
}, { 
    versionKey: false 
});

// Encriptar contraseña antes de guardar
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Firmar JWT y retornar
userSchema.methods.getSignedJwtToken = function() {
    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

// Comparar contraseña ingresada con la almacenada
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);