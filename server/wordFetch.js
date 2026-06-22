import wordSchema from "./models/wordSchema.js";

export async function getRandomWord(categoryName){
    try{
        const randomWordDoc = await wordSchema.aggregate([
            {$match: {category: categoryName}},
            {$sample: {sze: 1}}
        ]);
        if (!randomWordDoc || randomWordDoc.length === 0){
            return null;
        }
        return randomWordDoc[0];
    }
    catch(error){
        console.error("Database fetch error",error);
        throw error;
    }
}