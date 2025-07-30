import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/putter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feadback of your resume" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [resumeLoading, setResumeLoading] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResume = async () => {
      setResumeLoading(true);
      const resumes = (await kv.list("resume:*", true)) as KVItem[];
      const parsedResumes = resumes?.map((resume) => JSON.parse(resume.value));
      setResumes(parsedResumes || []);
      setResumeLoading(false);
    };
    loadResume();
  }, []);
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track Your Applications & Resume Ratings </h1>
          {!resumeLoading && resumes?.length == 0 ? (
            <h2>No resumes found upload your first resume to get a feedback</h2>
          ) : (
            <h2>Review your submission and check Ai-powered feedback.</h2>
          )}
        </div>
        {
          resumeLoading&&(
            <div className="flex flex-col items-center justify-center">
              <img src="/images/resume-scan-2.gif" className="w-[200px]"/>
            </div>
          )
        }
        {!resumeLoading && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
        {!resumeLoading&& resumes?.length==0 &&(
          <div className="flex flex-col justify-center mt-10 gap-4 items-center">
            <Link to={"/upload"} className="primary-button w-fit text-xl font-semibold">Upload Resume</Link>
          </div>
        )}
      </section>
    </main>
  );
}
