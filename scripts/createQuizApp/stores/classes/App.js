class App extends Object {
    constructor(properties){
        console.log('using app class', properties);
        super(properties);
        Object.extend(this, properties);
    }
}

export default App;
