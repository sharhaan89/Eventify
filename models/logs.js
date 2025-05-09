import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
    eventId : String,
    eventName : String,
    Room : String,
    fromTime : Date,
    toTime : Date,
});

export const Log = mongoose.model('Log', logSchema);