export class Social {
    constructor(favorite) {
        this.favorite = favorite;
    }

    GetFavorite() {
        return this.favorite;
    }

    TranslateToJson(social) {
        return JSON.stringify({
            favorite: social.GetFavorite()
        });
    }

    TranslateFromJson(jsonString) {
        const jsonObject = JSON.parse(jsonString);
        return new DishModule(jsonObject.favorite);
    }
}