'use strict';
import mongoose from 'mongoose';

const { Schema } = mongoose;
const ObjectId = mongoose.Schema.Types.ObjectId;
const StockClearenceTable = new Schema({
    id: {
        type: String,
        index: true,
        unique: true
    },
    symbol: {
        type: String,
        index: true
    },
    name: {
        type: String,
        index: true,       
    },
    trade_date: {
        type: String,
        index: true,       
    },
    trade_price: {
        type: Number,
    },
    volume: {
        type: Number,
    },
    total_money: {
        type: Number,
    },
});

export default (mongoose.models && mongoose.models.StockClearenceTable
    ? mongoose.models.StockClearenceTable
    : mongoose.model('StockClearenceTable', StockClearenceTable));



