'use strict';

import mongoose from 'mongoose';
import { SessionConfig } from '../../../config';

const { Schema } = mongoose;

const ObjectId = mongoose.Schema.Types.ObjectId;

const SocketSchema = new Schema({
    sid: {
        type: String,
        index: true,
        unique: true
    },
    ip: {
        type: String,
        default: '',
    },
    uid: {
        type: String,
        index: true,       
        default: '',
    },
    username: {
        type: String,
        index: true,       
        default: '',
    },
    user_agent: {
        type: String,
        index: true,  
        default: '',
    },
    role: {
        type: String,
        default : 'viewer',
    },
    privilegeLevel: {
        type: Number,
        min: 0,
        max: 63,
        default: 0
    },
    locale: {
        type: String,
        default : 'en',
    },
    createTime: { 
        type: Date, 
        expires: SessionConfig.Options.maxAge
    }
});


export default (mongoose.models && mongoose.models.SocketSchema
    ? mongoose.models.SocketSchema
    : mongoose.model('Socket', SocketSchema));



