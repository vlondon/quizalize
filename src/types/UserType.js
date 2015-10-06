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
