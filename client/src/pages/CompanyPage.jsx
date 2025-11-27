import { useParams } from "react-router";
// import { companies } from "../lib/fake-data";
import JobList from "../components/JobList";
import { useCompany } from "../lib/graphql/hooks";

function CompanyPage() {
  const { companyId } = useParams();
  const { loading, error, company } = useCompany(companyId);

  //const company = companies.find((company) => company.id === companyId);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Data unavailable</div>;
  return (
    <div>
      <h1 className="title">{company.name}</h1>
      <div className="box">{company.description}</div>
      <h2>Jobs at {company.name}</h2>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyPage;
