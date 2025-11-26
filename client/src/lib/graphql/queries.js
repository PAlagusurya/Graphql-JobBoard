// import { GraphQLClient } from "graphql-request";
import { getAccessToken } from "../auth";
import { ApolloClient, gql, InMemoryCache, HttpLink } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";

// const client = new GraphQLClient("http://localhost:9000/graphql", {
//   headers: () => {
//     const accessToken = getAccessToken();
//     if (accessToken) {
//       return { Authorization: `Bearer ${accessToken}` };
//     }
//     return {};
//   },
// });

const authLink = new SetContextLink(({ headers }) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    return {
      headers: {
        ...headers,
        Authorization: `Bearer ${accessToken}`,
      },
    };
  }
  return { headers };
});

const httpLink = new HttpLink({
  uri: "http://localhost:9000/graphql",
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export async function getCompany(id) {
  const query = gql`
    query getCompanyById($id: ID!) {
      company(id: $id) {
        id
        name
        description
        jobs {
          id
          title
          date
          description
        }
      }
    }
  `;

  const { data } = await apolloClient.query({ query, variables: { id } });
  return data.company;
}

export async function getJob(id) {
  const query = gql`
    query getJobById($id: ID!) {
      job(id: $id) {
        id
        date
        title
        company {
          id
          name
        }
        description
      }
    }
  `;

  const { data } = await apolloClient.query({
    query,
    variables: {
      id,
    },
  });
  return data.job;
}

export async function getJobs() {
  const query = gql`
    query {
      jobs {
        id
        date
        title
        company {
          id
          name
        }
      }
    }
  `;

  const { data } = await apolloClient.query({ query });
  return data.jobs;
}

export async function createJob({ title, description }) {
  const mutation = gql`
    mutation createJob($input: createJobInput!) {
      job: createJob(input: $input) {
        id
      }
    }
  `;

  const { data } = await apolloClient.mutate({
    mutation,
    variables: {
      input: { title, description },
    },
  });
  return data.job;
}
