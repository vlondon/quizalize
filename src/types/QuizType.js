
type QuizCategory = {
    name: string;
    title: string;
}
type QuizMeta = {
    authorId?: string;
    categoryId?: string;
    code?: string;
    comment?: any;
    created: number;
    imageUrl?: string;
    name: string;
    originalQuizId?: string;
    price: number;
    profileId: string;
    published?: string;
    random: boolean;
    review?: any;
    subject?: string;
    updated: number;
};

export type Question = {
    uuid: string;
    question: string;
    answer: string;
    alternatives?: Array<string>;
    topicId?: string;
    latexEnabled: boolean;
    imageEnabled: boolean;
    duration: number;
    alternatives: Array<string>
}

type QuizPayload = {
    questions: Array<Question>;
}

export type QuizComplete = {
    _temp?: boolean;
    _new?: boolean;
    uuid: string;
    meta: QuizMeta;
    payload: QuizPayload;
}

export type Quiz = {
    uuid: string;
    meta: QuizMeta;
    _category?: QuizCategory;
}
