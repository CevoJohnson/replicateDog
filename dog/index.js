const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const axios = require('axios');
const Replicate = require('replicate');

const app = express();
const REPLICATE_API_TOKEN="r8_G4dtmoJnCehihZkAUlnPGjsq9ZOG8Bg045vwO"
const typeDefs = gql`
  type Query {
    isDogPresent(imageUrl: String!): String!
  }
`;

const replicate = new Replicate({
  auth: REPLICATE_API_TOKEN,
});

const isDogPresent = async (imageUrl) => {
  try {


    const output = await replicate.run("andreasjansson/blip-2:4b32258c42e9efd4288bb9910bc532a69727f9acd26aa08e175713a0a857a608",
 {
      input: {
        image: imageUrl,
        question: 'Is there a dog?',
      },
    });

    return output
  } catch (error) {
    console.error('Failed to process the image:', error);
    throw new Error('Failed to process the image.');
  }
};

const resolvers = {
  Query: {
    isDogPresent: (_, { imageUrl }) => isDogPresent(imageUrl),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.start().then(() => {
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () => {
    console.log('Server is running at http://localhost:4000');
  });
});
