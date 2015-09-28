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
