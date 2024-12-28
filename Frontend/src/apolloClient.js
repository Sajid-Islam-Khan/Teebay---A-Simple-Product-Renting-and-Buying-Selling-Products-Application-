import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { persistCache } from 'apollo3-cache-persist';

// Create a new Apollo Client instance
const createApolloClient = async () => {
    const cache = new InMemoryCache();

    // Set up cache persistence
    await persistCache({
        cache,
        storage: localStorage, // Persist the cache to localStorage
    });

    const client = new ApolloClient({
        link: new HttpLink({ uri: 'http://localhost:3002/graphql' }), // your GraphQL server URI
        cache,
    });

    return client;
};

export default createApolloClient;
