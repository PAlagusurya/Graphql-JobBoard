import { gql, GraphQLClient } from "graphql-request";

const client = new GraphQLClient("http://localhost:9000/graphql");

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

  const { company } = await client.request(query, { id });
  return company;
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

  const { job } = await client.request(query, { id });
  return job;
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

  const { jobs } = await client.request(query);
  return jobs;
}

export async function createJob({ title, description }) {
  const mutation = gql`
    mutation createJob($input: createJobInput!) {
      job: createJob(input: $input) {
        id
      }
    }
  `;
  const { job } = await client.request(mutation, {
    input: { title, description },
  });
  return job;
}
