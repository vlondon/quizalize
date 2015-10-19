import MeStore from './../MeStore';
export class Application {

    uuid: ?string;
    meta: AppMeta;
    payload: AppPayload;

    constructor(appInfo: ?AppComplete){
        var user:Object = MeStore.state;
        var profileId = user.uuid || undefined;
        var emptyApp = {
            uuid: undefined,
            meta:  {
                colour: '#a204c3',
                created: Date.now(),
                description: '',
                iconURL: undefined,
                name: '',
                price: 0,
                profileId,
                quizzes: [],
                updated: Date.now()
            },
            payload: {
                categories: [],
                quizzes: []
            }
        };

        Object.assign(this, emptyApp, appInfo);


    }

}
