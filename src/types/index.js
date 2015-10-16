/* @flow */

/// GROUP ////
export type Group = {
    nameTest: string;
    code: string;
    link: string;
    name: string;
};


export type GroupContent = {
    access: number;
    attributes: {
        access: string;
        code: string;
    };
    contentId: string;
    created: number;
    createdString: string;
    groupCode: string;
    ownerId: string;
    profileOwnerId: string;
    revision: number;
    timestamp: number;
    timestampedString: string;
    uuid: string;
}


//// QUIZ ////

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
    nameTest: string;
}

export type Quiz = {
    uuid: string;
    meta: QuizMeta;
    _category?: QuizCategory;
}

//// USER ////
/* @flow */
var T = require('immutable');
type UserAttributesType = {
    location?: string;
    school?: string;
    url?: string;
    subjectTaught?: string;
    ageTaught?: string;
    profileUrl?: string;
    bannerUrl?: string;
    accountType: number;
    accountTypeUpdated: number;
    accountTypeExpiration: ?number;
    stripeId?: string;
}

type UserTypeDefinition = {
    uuid: string;
    avatar: string;
    email: string;
    name: string;
    attributes: T.Map<UserAttributesType>;
    created: number;
    apps?: Array<Object>;
    quizzes?: Array<Object>;
    toJSON?: Function;
}

export type UserType = T.Map<UserTypeDefinition>;

//// APP ////
type AppMeta = {
    code: string;
    colour: string;
    created: number;
    description: string;
    iconURL: string;
    name: string;
    price: number;
    profileId: string;
    quizzes: Array<Object>
}

export type AppType = {
    uuid: string;
    meta: AppMeta;
}
