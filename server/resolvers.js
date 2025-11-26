import {
  createJob,
  deleteJob,
  getJob,
  getJobByCompany,
  getJobs,
  updateJob,
} from "./db/jobs.js";
import { getCompany } from "./db/companies.js";
import { GraphQLError } from "graphql";

export const resolvers = {
  Query: {
    jobs: () => getJobs(),
    job: async (_root, { id }) => {
      const job = await getJob(id);
      if (!job) {
        throw notFoundError(`No job found with ${id}`);
      }
      return job;
    },
    company: async (_root, { id }) => {
      const company = await getCompany(id);
      if (!company) {
        throw notFoundError(`No company found with ${id}`);
      }
      return company;
    },
  },

  Mutation: {
    createJob: (_root, { input: { title, description } }, user) => {
      if (!user) {
        throw UnauthorizedError("Missing credentials");
      }
      createJob({ companyId: user.companyId, title, description });
    },
    deleteJob: (_root, { id }) => deleteJob(id),
    updateJob: (_root, { input: { id, title, description } }) => {
      return updateJob({ id, title, description });
    },
  },

  Company: {
    jobs: (company) => getJobByCompany(company.id),
  },

  Job: {
    company: (job) => getCompany(job.companyId),
    date: (job) => toISODate(job.createdAt),
  },
};

function toISODate(value) {
  return value.slice(0, "yyyy-mm-dd".length);
}

function notFoundError(message) {
  throw new GraphQLError(message, {
    extensions: { code: "NOT_FOUND" },
  });
}

function UnauthorizedError(message) {
  throw new GraphQLError(message, {
    extensions: { code: "UNAUTHORIZED" },
  });
}
