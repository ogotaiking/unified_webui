'use strict';

import mongoose from 'mongoose';
import { SessionConfig } from '../../../config';

const { Schema } = mongoose;

const ObjectId = mongoose.Schema.Types.ObjectId;
const ExpireTime = SessionConfig.Options.maxAge ;

const LoginHistorySchema = new Schema({
    createTime: { type: Date, default: Date.now , expires: ExpireTime },
    cookie: {
        type: String,
        index: true,
    },
    uid: {
        type: String,
        index: true,
    },
    clientfp: {
        type: String,
    },
    username: {
        type: String,
        index: true,       
    },
    user_agent: {
        type: String,
        index: true,       
    },
    ip: {
        type: String,
        index: true,        
    },
    continent: { 
        type: String,
        default:'',
        index: true
    },
    region: {
        type: String,
        default:'',
        index: true,
    },
    city: {
        type: String,
        default:'',
        index: true,
    },
    location:{
        accuracy_radius: {
            type: Number,
            default: 1000
        },
        longitude:{
            type: Number,
            default: 0
        },
        latitude:{
            type: Number,
            default: 0
        },
        time_zone: {
            type: String,
            default:'',            
        }
    },
    asn:{
        type: Number,
        default: 0,
        index: true
    },
    asname: {
        type: String,
        default:'',
        index: true
    }

});


export default (mongoose.models && mongoose.models.LoginHistorySchema
    ? mongoose.models.LoginHistorySchema
    : mongoose.model('LoginHistory', LoginHistorySchema));



