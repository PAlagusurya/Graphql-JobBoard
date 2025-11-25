import { useParams } from "react-router";
// import { companies } from "../lib/fake-data";
import { useEffect, useState } from "react";
import { getCompany } from "../lib/graphql/queries";
import JobList from "../components/JobList";

function CompanyPage() {
  const { companyId } = useParams();
  const [state, setState] = useState({
    company: null,
    error: false,
    loading: true,
  });

  useEffect(() => {
    (async () => {
      try {
        const company = await getCompany(companyId);
        setState({ company: company, error: false, loading: false });
      } catch (error) {
        console.log("ERROR:", error);
        setState({ company: null, error: true, loading: false });
      }
    })();
  }, [companyId]);

  const { loading, error, company } = state;

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
