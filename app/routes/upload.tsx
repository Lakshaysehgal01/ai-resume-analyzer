import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import FileUplaoder from "~/components/FileUplaoder";
import Navbar from "~/components/Navbar";
import { prepareInstructions } from "~/constants";
import { convertPdfToImage } from "~/lib/pdf2img";
import { usePuterStore } from "~/lib/putter";
import { generateUUID } from "~/lib/util";

export const meta = () => {
  return [
    { title: "Resumind | Upload" },
    { name: "description", content: "Upload Your Resume" },
  ];
};

interface handleAnalyzeProps {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  file: File;
}

const upload = () => {
  const { fs, auth, isLoading, kv, ai } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);
    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    if (!file) return;
    handleAnalyze({ companyName, jobDescription, jobTitle, file });
  };

  const handleAnalyze = async ({
    companyName,
    jobDescription,
    jobTitle,
    file,
  }: handleAnalyzeProps) => {
    setIsProcessing(true);
    setStatusText("Uploading file ...");
    const uploadedFile = await fs.upload([file]);
    if (!uploadedFile) return setStatusText("Error : failed to upload file ");

    setStatusText("Converting to image ...");
    const imageFile = await convertPdfToImage(file);

    if (!imageFile.file)
      return setStatusText("Error : failed to convert Pdf to image");

    setStatusText("Uploading the image ...");
    const uploadedImage = await fs.upload([imageFile.file]);
    if (!uploadedImage)
      return setStatusText("Error : Failed to upload the image");

    setStatusText("Preparing data...");
    const uuid = generateUUID();
    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName,
      jobDescription,
      jobTitle,
      feedback: "",
    };
    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    setStatusText("Analyzing ...");
    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({ jobTitle, jobDescription })
    );

    if (!feedback) return setStatusText("Error: Failed to analyze resume");
    const feedbackText =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;

    data.feedback = JSON.parse(feedbackText);
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText("Analysis complete, redirecting...");
    console.log(data);
    navigate(`/resume/${uuid}`);
  };

  const handleSelect = (file: File | null) => {
    setFile(file);
  };
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Smart feedback for your dream job</h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img
                src="/images/resume-scan.gif"
                alt="scan-img"
                className="w-full"
              />
            </>
          ) : (
            <h2>Drop your resume for a ATS score and improvement tips</h2>
          )}
          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 mt-8"
            >
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input
                  type="text"
                  name="company-name"
                  placeholder="Company Name"
                  id="company-name"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input
                  type="text"
                  name="job-title"
                  placeholder="Job Title"
                  id="job-title"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-description">Job description</label>
                <textarea
                  rows={5}
                  name="job-description"
                  placeholder="Job description"
                  id="job-description"
                />
              </div>
              <div className="form-div">
                <label htmlFor="uploader">Upload Resume</label>
                <FileUplaoder onFileSelect={handleSelect} />
              </div>
              <button type="submit" className="primary-button">
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default upload;
