const express = require('express');
const graphqlHTTP = require('express-graphql');
const bodyParser = require('body-parser');
const schema = require('./graphql/schema');
const mongoose = require('mongoose');
const resolvers = require('./graphql/resolvers');
const isAuth = require('./middlware/is_auth');

var app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if( req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(isAuth);

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
}));

mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-r3zwb.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    }
).then(() => {
    app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));
}).catch(console.log);



