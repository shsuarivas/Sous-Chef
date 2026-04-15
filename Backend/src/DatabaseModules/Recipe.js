export class Recipe{
    constructor(jsonObject){
        this.name = jsonObject.name;
        this.description = jsonObject.description;
        this.servings = jsonObject.servings;
        this.time_to_cook = jsonObject.time_to_cook;
        this.ingredients = jsonObject.ingredients.map(ingredient => new Ingredient(ingredient));
        this.instructions = jsonObject.instructions;
        this.tags = jsonObject.tags;
        this.views = jsonObject.views;
    }

    GetName(){
        return this.name;
    }

    GetDescription(){
        return this.description;
    }

    GetServings(){
        return this.servings;
    }

    GetTimeToCook(){
        return this.time_to_cook;
    }

    GetIngredients(ingredientIndex){
        return this.ingredients[ingredientIndex];
    }

    GetInstructions(stepNumber){
        return this.instructions[stepNumber];
    }

    GetTags(tagIndex){
        return this.tags[tagIndex];
    }

    GetViews(){
        return this.views;
    }

    ToJSON() {
        return {
            name: this.name,
            description: this.description,
            servings: this.servings,
            time_to_cook: this.time_to_cook,
            ingredients: this.ingredients,
            instructions: this.instructions,
            tags: this.tags
        };
    }

    static FromJSON(jsonString) {
        const jsonObject = JSON.parse(jsonString);
        ;
        return new Recipe(
            jsonObject.name, 
            jsonObject.description, 
            jsonObject.servings, 
            jsonObject.time_to_cook, 
            jsonObject.ingredients, 
            jsonObject.instructions,
            jsonObject.tags
        );
    }
}

export class Ingredient{
    constructor(jsonObject){
        this.name = jsonObject.name;
        this.quantity = jsonObject.quantity;
        this.unit = jsonObject.unit;
    }

    GetName(){
        return this.name;
    }

    GetQuantity(){
        return this.quantity;
    }

    GetUnit(){
        return this.unit;
    }

    ToJSON() {
        return {
            name: this.name,
            quantity: this.quantity,
            unit: this.unit
        };
    }

    static FromJSON() {
        const jsonObject = JSON.parse(jsonString);

        return new Ingredient(
            jsonObject.name, 
            jsonObject.quantity, 
            jsonObject.unit
        );
    }
}

export class RecipeSteps{
    constructor(jsonObject){
        this.stepNumber = jsonObject.stepNumber;
        this.instruction = jsonObject.instruction;
    }

    GetStepNumber(){
        return this.stepNumber;
    }

    GetInstruction(){
        return this.instruction;
    }

    ToJSON() {
        return {
            stepNumber: this.stepNumber,
            instruction: this.instruction
        };
    }

    static FromJSON() {
        const jsonObject = JSON.parse(jsonString);

        return new RecipeSteps(
            jsonObject.stepNumber,
            jsonObject.instruction
        );
    }
}