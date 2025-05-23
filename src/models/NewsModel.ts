import { Schema, model, Query } from 'mongoose';
import { News } from '../interfaces/News';

const newsSchema = new Schema<News>({
    title: { type: String, required: true, min: 2, max: 100 },
    subTitle: { type: String, required: true, min: 2, max: 255 },
    text: { type: String, required: true, min: 6 },
    imageURL: { type: String, required: true },
    date: { type: String, required: true, min: 8, max: 10 },
    theme: { type: String, required: true, min: 2, max: 100 },
    isHidden: { type: Boolean, default: false, required: false },
    userId: { type: String, required: true },
});


// define how its being updated in mongoose
type UpdateQuery<T> = {
    [key: string]: unknown;
} & {
    __v?: number;
    $set?: Partial<T> & { __v?: number };
    $setOnInsert?: Partial<T> & { __v?: number };
    $inc?: { __v?: number };
};


// define news schema in mongoose  
newsSchema.pre<Query<News, News>>('findOneAndUpdate', function () {
    const update = this.getUpdate() as UpdateQuery<News>;
    if (update.__v != null) {
        delete update.__v;
    }
    const keys: Array<'$set' | '$setOnInsert'> = ['$set', '$setOnInsert'];
    for (const key of keys) {
        if (update[key] != null && update[key]!.__v != null) {
            delete update[key]!.__v;
            if (Object.keys(update[key]!).length === 0) {
                delete update[key];
            }
        }
    }
    update.$inc = update.$inc || {};
    update.$inc.__v = 1;
});

export const newsModel = model<News>("News", newsSchema);