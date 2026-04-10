export class CommentSection {
    constructor(comments) {
        this.comments = comments;
    }

    GetComments(commentIndex) {
        return this.comments[commentIndex];
    }

    TranslateToJson(commentSection) {
        return JSON.stringify({
            comments: commentSection.GetComments()
        });
    }

    TranslateFromJson(jsonString) {
        const jsonObject = JSON.parse(jsonString);
        return new DishModule(jsonObject.comments);
    }
}