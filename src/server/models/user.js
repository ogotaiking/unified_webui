'use strict';

import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';


const ObjectId = mongoose.Schema.Types.ObjectId;
const UserSchema = new mongoose.Schema({
    id: {
        type: String,
        index: true
    },
    email: {
        type: String,
        required: true,
        match:RegExp(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/),
        index: true
    },
    username: {
        type: String,
        required: true,
        index: true
    },
    phone: {
        type: String,
        required: true,
        index: true
    },
    password: {
        type: String,
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        displayName: String
    },
    github: {
        id: String,
        token: String,
        username: String,
        name: String
    },
    linkedin: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    instagram: {
        id: String,
        token: String,
        username: String,
        name: String
    },
    role: {
        type: String,
        required: true,
        enum: ['Admin', 'Operator', 'viewer'],
        default: ['viewer']
    },
    //用户身份权级
    privilegeLevel: {
        type: Number,
        required: true,
        min: 0,
        max: 63,
        default: 0
        /*
         * 0: Tenant-Viewer
         * 7: Tenant-Operator
         * 15: Tenant-Admin
         *
         * roleLevel > 32 could support multi-Tenant management
         *
         * 40: System-Viewer <-Low Level online Support Engineer
         * 50: System-Operator <-High Level online Support Engineer
         * 63: System-Admin
         */
    },
    //多语言支持
    locale: {
        type: String,
        enum: ['en', 'en-US', 'zh-TW', 'zh', 'zh-CN'],
        default: ['en']
    },
    clientinfo : [{
        clientfp: {
            type: String,
        },
        cookie: {
            type: String
        }
    }]
});

// methods ======================
// generating a hash

UserSchema.methods.generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

export default (mongoose.models && mongoose.models.User
    ? mongoose.models.User
    : mongoose.model('User', UserSchema));