import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import Summary from "~/components/Summary";
import { usePuterStore } from "~/lib/putter";

// "965a9fd9-b915-4efc-80b7-934824309ec6"
export const meta = () => [
  { title: "Resumind | Review" },
  { name: "description", content: "Detailed overveiw of your resume" },
];

const resume = () => {
  const { auth, kv, fs, isLoading } = usePuterStore();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${id}`);
    }
  }, [isLoading]);

  async function LoadResume() {
    const resume = await kv.get(`resume:${id}`);

    if (!resume) return;

    const data = JSON.parse(resume);

    const resumeBlob = await fs.read(data.resumePath);
    if (!resumeBlob) return;

    const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
    const resumeUrl = URL.createObjectURL(pdfBlob);
    setResumeUrl(resumeUrl);
    console.log(data.imagePath);
    const imageBlob = await fs.read(data.imagePath);
    if (!imageBlob) return;
    const imageUrl = URL.createObjectURL(imageBlob);
    setImageUrl(imageUrl);

    setFeedback(data.feedback);
    console.log({ resumeUrl, imageUrl, feedback: data.feedback });
  }

  useEffect(() => {
    LoadResume();
  }, [id]);
  return (
    <main className="!pt-0">
      <nav className="resume-nav">
        <Link to={"/"} className="back-button">
          <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
          <span className="text-gray-800 text-sm font-semibold">
            Back to Homepage
          </span>
        </Link>
      </nav>
      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        <section className="feedback-section bg-[url('/images/bg-small.svg') bg-cover h-[100vh] sticky top-0 items-center justify-center">
          {imageUrl && resumeUrl && (
            <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit ">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={imageUrl}
                  className="w-full h-[90vh] rounded-2xl"
                  title="Resume"
                />
              </a>
            </div>
          )}
        </section>
        <section className="feedback-section">
          <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
          {feedback ? (
            <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
              <Summary feedback={feedback} />
              <ATS
                score={feedback.ATS.score || 0}
                suggestions={feedback.ATS.tips || []}
              />
              <Details feedback={feedback} />
            </div>
          ) : (
            <img src="/images/resume-scan-2.gif" className="w-full" />
          )}
        </section>
      </div>
    </main>
  );
};

export default resume;
