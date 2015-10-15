
export type Group = {
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
