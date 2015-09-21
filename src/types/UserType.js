/* @flow */
type UserAttributesType = {
    location?: string;
    school?: string;
    url?: string;
    subjectTaught?: string;
    ageTaught?: string;
    profileUrl?: string;
    bannerUrl?: string;
}

export type UserType = {
    uuid: string;
    avatar: string;
    email: string;
    name: string;
    attributes: UserAttributesType;
    created: number;
}
