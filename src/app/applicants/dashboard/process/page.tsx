
"use client";
import React, { useState, useEffect } from "react";
import data from "./data.json"; // ensure your data.json file is in the same directory
import DefaultLayout from "@/components/layouts/DefaultLayout";
const Page: React.FC = () => {
  // STEP STATE
  const [step, setStep] = useState(1);
  /* ------------------ STEP 1: BASIC INFORMATION ------------------ */
  // Location selection states
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedCell, setSelectedCell] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [cells, setCells] = useState<any[]>([]);
  const [villages, setVillages] = useState<any[]>([]);
  // Other info fields
  const [projectName, setProjectName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState("");
  const [repName, setRepName] = useState("");
  const [email, setEmail] = useState("");
  // On mount, load province data
  useEffect(() => {
    setProvinces(data);
  }, []);
  // Handlers for dropdown selections
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = e.target.value;
    setSelectedProvince(provinceId);
    setSelectedDistrict("");
    setSelectedSector("");
    setSelectedCell("");
    setSelectedVillage("");
    const selectedProvinceData = data.find(
      (province) => province.id.toString() === provinceId
    );
    setDistricts(selectedProvinceData ? selectedProvinceData.districts : []);
  };
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
    setSelectedSector("");
    setSelectedCell("");
    setSelectedVillage("");
    const selectedDistrictData = districts.find(
      (district) => district.id.toString() === districtId
    );
    setSectors(selectedDistrictData ? selectedDistrictData.sectors : []);
  };
  const handleSectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sectorId = e.target.value;
    setSelectedSector(sectorId);
    setSelectedCell("");
    setSelectedVillage("");
    const selectedSectorData = sectors.find(
      (sector) => sector.id.toString() === sectorId
    );
    setCells(selectedSectorData ? selectedSectorData.cells : []);
  };
  const handleCellChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cellId = e.target.value;
    setSelectedCell(cellId);
    setSelectedVillage("");
    const selectedCellData = cells.find(
      (cell) => cell.id.toString() === cellId
    );
    setVillages(selectedCellData ? selectedCellData.villages : []);
  };
  /* ------------------ STEP 2: DETAILED PROJECT INFORMATION ------------------ */
  const [formData, setFormData] = useState({
    contactFirstName: "",
    contactFamilyName: "",
    contactEmail: "",
    contactPersonIfNotLegal: "",
    projectPartners: "",
    projectTeamMembers: "",
    projectTitle: "",
    placeOfImplementation: "",
    startDate: "",
    endDate: "",
    projectDescription: "",
    projectMainObjective: "",
    specificObjectives: "",
    implementationPlan: "",
    targetGroups: "",
    communicationPlan: "",
    resourceURL: "https://unesco.rw/IMG/pdf/pp_project_2022-23.pdf",
    budgetLink: "https://unesco.rw/IMG/pdf/sample_budget_template.pdf",
  });
  const handleDetailedChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  /* ------------------ STEP 3: PROJECT BUDGET BREAKDOWN ------------------ */
  const [budgetData, setBudgetData] = useState({
    category1Explanation: "",
    category1Cost: 0,
    category2Explanation: "",
    category2Cost: 0,
    category3Explanation: "",
    category3Cost: 0,
    category4Explanation: "",
    category4Cost: 0,
    category5Explanation: "",
    category5Cost: 0,
    category6Explanation: "",
    category6Cost: 0,
    totalCost: 0,
  });
  const handleBudgetChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBudgetData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: name.includes("Cost") ? parseFloat(value) || 0 : value,
      };
      // Update total cost by summing up all category costs.
      updatedData.totalCost =
        updatedData.category1Cost +
        updatedData.category2Cost +
        updatedData.category3Cost +
        updatedData.category4Cost +
        updatedData.category5Cost +
        updatedData.category6Cost;
      return updatedData;
    });
  };
  // New state to manage file uploads for supporting documents
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  // Handler to update file state when user selects supporting documents
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesArray = Array.from(e.target.files || []);
    setSelectedFiles(filesArray);
  };
  // New state to manage file upload for additional "More Information"
  const [selectedMoreInfoFile, setSelectedMoreInfoFile] = useState<File | null>(null);
  const handleMoreInfoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setSelectedMoreInfoFile(file);
  };
  const handleBudgetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (budgetData.totalCost <= 0) {
        throw new Error("Total cost must be greater than 0");
      }
      const response = await fetch("/api/applicant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          budgetData: {
            category1Explanation: budgetData.category1Explanation,
            category1Cost: budgetData.category1Cost,
            category2Explanation: budgetData.category2Explanation,
            category2Cost: budgetData.category2Cost,
            category3Explanation: budgetData.category3Explanation,
            category3Cost: budgetData.category3Cost,
            category4Explanation: budgetData.category4Explanation,
            category4Cost: budgetData.category4Cost,
            category5Explanation: budgetData.category5Explanation,
            category5Cost: budgetData.category5Cost,
            category6Explanation: budgetData.category6Explanation,
            category6Cost: budgetData.category6Cost,
            totalCost: budgetData.totalCost,
          },
          selectedFiles,
          moreInfoFile: selectedMoreInfoFile,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message ||
            `Server error occurred (Status: ${response.status})`
        );
      }
      await response.json();
      alert("Budget form submitted successfully!");
      // Reset form fields and file input
      setBudgetData({
        category1Explanation: "",
        category1Cost: 0,
        category2Explanation: "",
        category2Cost: 0,
        category3Explanation: "",
        category3Cost: 0,
        category4Explanation: "",
        category4Cost: 0,
        category5Explanation: "",
        category5Cost: 0,
        category6Explanation: "",
        category6Cost: 0,
        totalCost: 0,
      });
      setSelectedFiles([]);
      setSelectedMoreInfoFile(null);
    } catch (error: any) {
      console.error("Error submitting budget form:", error);
      alert(
        error.message ||
          "An error occurred while submitting the form. Please try again."
      );
    }
  };
  /* ------------------ STEP HANDLERS FOR NAVIGATION ------------------ */
  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };
  const handleStep2Next = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };
  const handleStep2Back = () => {
    setStep(1);
  };
  const handleStep3Back = () => {
    setStep(2);
  };
  return (
    <DefaultLayout>
      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/abou.webp')" }}
      >
        {/* MAIN CONTENT */}
        <div className="max-w-4xl mx-auto bg-white bg-opacity-90 p-8 mt-10 rounded-xl shadow-lg">
          {step === 1 && (
            <form onSubmit={handleStep1Next} className="space-y-4">
              <h2 className="text-2xl font-bold mb-6 text-center">
                UNESCO Participation Programme Form – Basic Info
              </h2>
              {/* Project Name */}
              <div className="flex flex-col">
                <label htmlFor="project_name" className="font-medium">
                  Project Name
                </label>
                <input
                  type="text"
                  id="project_name"
                  name="project_name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                  className="border rounded-md px-3 py-2"
                  placeholder="TYPE HERE"
                />
              </div>
              {/* Organisation Information */}
              <h3 className="text-lg font-semibold mt-8">
                Information on Applicant Organisation / Individual
              </h3>
              <div className="flex flex-col">
                <label htmlFor="org_name" className="font-medium">
                  Name of Applicant Organisation
                </label>
                <input
                  type="text"
                  id="org_name"
                  name="org_name"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  required
                  className="border rounded-md px-3 py-2"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="org_type" className="font-medium">
                  Type of Organisation
                </label>
                <input
                  type="text"
                  id="org_type"
                  name="org_type"
                  value={orgType}
                  onChange={(e) => setOrgType(e.target.value)}
                  required
                  className="border rounded-md px-3 py-2"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="rep_name" className="font-medium">
                  Legal Representative Name
                </label>
                <input
                  type="text"
                  id="rep_name"
                  name="rep_name"
                  value={repName}
                  onChange={(e) => setRepName(e.target.value)}
                  required
                  className="border rounded-md px-3 py-2"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="email" className="font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border rounded-md px-3 py-2"
                />
              </div>
              {/* Location Dropdowns */}
              <div className="flex flex-col">
                <label htmlFor="province" className="font-medium">
                  Province
                </label>
                <select
                  id="province"
                  value={selectedProvince}
                  onChange={handleProvinceChange}
                  className="border rounded-md px-3 py-2"
                  required
                >
                  <option value="">-- Select a Province --</option>
                  {provinces.map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>
              {selectedProvince && (
                <div className="flex flex-col">
                  <label htmlFor="district" className="font-medium">
                    District
                  </label>
                  <select
                    id="district"
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    className="border rounded-md px-3 py-2"
                    required
                  >
                    <option value="">-- Select a District --</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {selectedDistrict && (
                <div className="flex flex-col">
                  <label htmlFor="sector" className="font-medium">
                    Sector
                  </label>
                  <select
                    id="sector"
                    value={selectedSector}
                    onChange={handleSectorChange}
                    className="border rounded-md px-3 py-2"
                    required
                  >
                    <option value="">-- Select a Sector --</option>
                    {sectors.map((sector) => (
                      <option key={sector.id} value={sector.id}>
                        {sector.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {selectedSector && (
                <div className="flex flex-col">
                  <label htmlFor="cell" className="font-medium">
                    Cell
                  </label>
                  <select
                    id="cell"
                    value={selectedCell}
                    onChange={handleCellChange}
                    className="border rounded-md px-3 py-2"
                    required
                  >
                    <option value="">-- Select a Cell --</option>
                    {cells.map((cell) => (
                      <option key={cell.id} value={cell.id}>
                        {cell.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {selectedCell && (
                <div className="flex flex-col">
                  <label htmlFor="village" className="font-medium">
                    Village
                  </label>
                  <select
                    id="village"
                    value={selectedVillage}
                    onChange={(e) => setSelectedVillage(e.target.value)}
                    className="border rounded-md px-3 py-2"
                    required
                  >
                    <option value="">-- Select a Village --</option>
                    {villages.map((village) => (
                      <option key={village.id} value={village.id}>
                        {village.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-xl transition"
                >
                  NEXT
                </button>
              </div>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={handleStep2Next} className="space-y-6">
              <h2 className="text-3xl font-bold text-center mb-6 text-blue-800">
                UNESCO Participation Programme Form – Project Details
              </h2>
              {/* Contact Person */}
              <div>
                <h3 className="text-2xl font-bold text-center mb-4 text-black">
                  Contact Person for Follow-up Communication
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contactFirstName" className="block font-medium">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="contactFirstName"
                      id="contactFirstName"
                      placeholder="First Name"
                      value={formData.contactFirstName}
                      onChange={handleDetailedChange}
                      className="p-2 w-full border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="contactFamilyName" className="block font-medium">
                      Family Name
                    </label>
                    <input
                      type="text"
                      name="contactFamilyName"
                      id="contactFamilyName"
                      placeholder="Family Name"
                      value={formData.contactFamilyName}
                      onChange={handleDetailedChange}
                      className="p-2 w-full border rounded"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="contactEmail" className="block font-medium">
                      Email
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      id="contactEmail"
                      placeholder="Email"
                      value={formData.contactEmail}
                      onChange={handleDetailedChange}
                      className="p-2 border rounded w-full"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="contactPersonIfNotLegal" className="block font-medium">
                      If not legal representative
                    </label>
                    <input
                      type="text"
                      name="contactPersonIfNotLegal"
                      id="contactPersonIfNotLegal"
                      placeholder="If not legal representative"
                      value={formData.contactPersonIfNotLegal}
                      onChange={handleDetailedChange}
                      className="p-2 border rounded w-full"
                    />
                  </div>
                </div>
              </div>
              {/* Partners and Team */}
              <div>
                <div>
                  <label htmlFor="projectPartners" className="block font-medium">
                    Project Partners
                  </label>
                  <textarea
                    name="projectPartners"
                    id="projectPartners"
                    placeholder="Project Partners"
                    value={formData.projectPartners}
                    onChange={handleDetailedChange}
                    rows={2}
                    className="w-full p-2 border rounded mt-2"
                  />
                </div>
                <div>
                  <label htmlFor="projectTeamMembers" className="block font-medium">
                    Project Team Members
                  </label>
                  <textarea
                    name="projectTeamMembers"
                    id="projectTeamMembers"
                    placeholder="Project Team Members"
                    value={formData.projectTeamMembers}
                    onChange={handleDetailedChange}
                    rows={2}
                    className="w-full p-2 border rounded mt-2"
                  />
                </div>
              </div>
              {/* Document Link & Project Info */}
              <div className="text-sm text-black">
                <p>
                  View required documents:{" "}
                  <a
                    href={formData.resourceURL}
                    target="_blank"
                    className="underline"
                  >
                    Participation Project Info PDF
                  </a>
                </p>
                <h3 className="text-2xl font-bold text-center mb-6 text-black">
                  Project Information
                </h3>
              </div>
              <div>
                <div>
                  <label htmlFor="projectTitle" className="block font-medium">
                    Project Title
                  </label>
                  <input
                    type="text"
                    name="projectTitle"
                    id="projectTitle"
                    placeholder="Project Title"
                    value={formData.projectTitle}
                    onChange={handleDetailedChange}
                    className="w-full p-2 border rounded mt-3"
                  />
                </div>
                <div>
                  <label htmlFor="placeOfImplementation" className="block font-medium">
                    Place of Implementation
                  </label>
                  <input
                    type="text"
                    name="placeOfImplementation"
                    id="placeOfImplementation"
                    placeholder="Place of Implementation"
                    value={formData.placeOfImplementation}
                    onChange={handleDetailedChange}
                    className="w-full p-2 border rounded mt-3"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div>
                    <label htmlFor="startDate" className="block font-medium">
                      Commencement Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      id="startDate"
                      value={formData.startDate}
                      onChange={handleDetailedChange}
                      className="p-2 w-full border rounded"
                    />
                  </div>
                  <div>
                    <label htmlFor="endDate" className="block font-medium">
                      Completion Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      id="endDate"
                      value={formData.endDate}
                      onChange={handleDetailedChange}
                      className="p-2 w-full border rounded"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="projectDescription" className="block font-medium">
                    Project Description (max 500 words)
                  </label>
                  <textarea
                    name="projectDescription"
                    id="projectDescription"
                    placeholder="Project Description (max 500 words)"
                    value={formData.projectDescription}
                    onChange={handleDetailedChange}
                    rows={2}
                    className="w-full p-2 border rounded mt-2"
                  />
                </div>
                <div>
                  <label htmlFor="projectMainObjective" className="block font-medium">
                    Main Overall Objective (1-2 sentences)
                  </label>
                  <textarea
                    name="projectMainObjective"
                    id="projectMainObjective"
                    placeholder="Main Overall Objective (1-2 sentences)"
                    value={formData.projectMainObjective}
                    onChange={handleDetailedChange}
                    rows={2}
                    className="w-full p-2 border rounded mt-2"
                  />
                </div>
                <div>
                  <label htmlFor="specificObjectives" className="block font-medium">
                    Specific Objectives & Activities (max 1000 words)
                  </label>
                  <textarea
                    name="specificObjectives"
                    id="specificObjectives"
                    placeholder="Specific Objectives & Activities (max 1000 words)"
                    value={formData.specificObjectives}
                    onChange={handleDetailedChange}
                    rows={2}
                    className="w-full p-2 border rounded mt-2"
                  />
                </div>
                <div>
                  <label htmlFor="implementationPlan" className="block font-medium">
                    Implementation Plan (max 1000 words)
                  </label>
                  <textarea
                    name="implementationPlan"
                    id="implementationPlan"
                    placeholder="Implementation Plan (max 1000 words)"
                    value={formData.implementationPlan}
                    onChange={handleDetailedChange}
                    rows={2}
                    className="w-full p-2 border rounded mt-2"
                  />
                </div>
                <div>
                  <label htmlFor="targetGroups" className="block font-medium">
                    Target Groups (max 500 words)
                  </label>
                  <textarea
                    name="targetGroups"
                    id="targetGroups"
                    placeholder="Target Groups (max 500 words)"
                    value={formData.targetGroups}
                    onChange={handleDetailedChange}
                    rows={2}
                    className="w-full p-2 border rounded mt-3"
                  />
                </div>
                <div>
                  <label htmlFor="communicationPlan" className="block font-medium">
                    Communication, Sustainability, Monitoring & Evaluation (max 300 words)
                  </label>
                  <textarea
                    name="communicationPlan"
                    id="communicationPlan"
                    placeholder="Communication, Sustainability, Monitoring & Evaluation (max 300 words)"
                    value={formData.communicationPlan}
                    onChange={handleDetailedChange}
                    rows={2}
                    className="w-full p-2 border rounded mt-3"
                  />
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={handleStep2Back}
                  className="bg-gray-600 text-white px-6 py-2 rounded-xl transition"
                >
                  BACK
                </button>
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-xl transition">
                  NEXT
                </button>
              </div>
            </form>
          )}
          {step === 3 && (
            <form onSubmit={handleBudgetSubmit} className="space-y-6">
              <h2 className="text-3xl text-center font-bold text-white">
                UNESCO Participation Programme Form
              </h2>
              <h1 className="text-xl text-center font-semibold text-blue-600 mt-4">
                Budget Information
              </h1>
              <div className="overflow-x-auto mt-6">
                <table className="bg-white rounded-3xl shadow-2xl w-full">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left">Item/Position</th>
                      <th className="px-4 py-2 text-left">Short Explanation</th>
                      <th className="px-4 py-2 text-left">Costs in $ USD</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2">
                        Category 1: Conferences, meetings, translation and interpretation services, participants’ travel costs, consultants’ services and any other services deemed necessary by common accord.
                      </td>
                      <td className="px-4 py-2">
                        <textarea
                          name="category1Explanation"
                          value={budgetData.category1Explanation}
                          onChange={handleBudgetChange}
                          placeholder="Explanation here"
                          className="w-full border rounded-md px-2 py-1"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          name="category1Cost"
                          value={budgetData.category1Cost}
                          onChange={handleBudgetChange}
                          placeholder="0.00"
                          className="w-full border rounded-md px-2 py-1"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">Category 2: Seminars and training courses</td>
                      <td className="px-4 py-2">
                        <textarea
                          name="category2Explanation"
                          value={budgetData.category2Explanation}
                          onChange={handleBudgetChange}
                          placeholder="Explanation here"
                          className="w-full border rounded-md px-2 py-1"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          name="category2Cost"
                          value={budgetData.category2Cost}
                          onChange={handleBudgetChange}
                          placeholder="0.00"
                          className="w-full border rounded-md px-2 py-1"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">Category 3: Supplies and equipment</td>
                      <td className="px-4 py-2">
                        <textarea
                          name="category3Explanation"
                          value={budgetData.category3Explanation}
                          onChange={handleBudgetChange}
                          placeholder="Explanation here"
                          className="w-full border rounded-md px-2 py-1"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          name="category3Cost"
                          value={budgetData.category3Cost}
                          onChange={handleBudgetChange}
                          placeholder="0.00"
                          className="w-full border rounded-md px-2 py-1"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">Category 4: Study grants and fellowships</td>
                      <td className="px-4 py-2">
                        <textarea
                          name="category4Explanation"
                          value={budgetData.category4Explanation}
                          onChange={handleBudgetChange}
                          placeholder="Explanation here"
                          className="w-full border rounded-md px-2 py-1"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          name="category4Cost"
                          value={budgetData.category4Cost}
                          onChange={handleBudgetChange}
                          placeholder="0.00"
                          className="w-full border rounded-md px-2 py-1"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">
                        Category 5: Specialists and consultants – not including staff costs
                      </td>
                      <td className="px-4 py-2">
                        <textarea
                          name="category5Explanation"
                          value={budgetData.category5Explanation}
                          onChange={handleBudgetChange}
                          placeholder="Explanation here"
                          className="w-full border rounded-md px-2 py-1"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          name="category5Cost"
                          value={budgetData.category5Cost}
                          onChange={handleBudgetChange}
                          placeholder="0.00"
                          className="w-full border rounded-md px-2 py-1"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">
                        Category 6: Other costs (to be specified)
                      </td>
                      <td className="px-4 py-2">
                        <textarea
                          name="category6Explanation"
                          value={budgetData.category6Explanation}
                          onChange={handleBudgetChange}
                          placeholder="Explanation here"
                          className="w-full border rounded-md px-2 py-1"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          name="category6Cost"
                          value={budgetData.category6Cost}
                          onChange={handleBudgetChange}
                          placeholder="0.00"
                          className="w-full border rounded-md px-2 py-1"
                        />
                      </td>
                    </tr>
                    <tr className="bg-gray-100 font-semibold">
                      <td className="px-4 py-2 text-left">Total Estimated Cost:</td>
                      <td className="px-4 py-2 text-left"></td>
                      <td className="px-4 py-2 text-left">
                        ${budgetData.totalCost.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* New File Upload Section for Budget Supporting Documents */}
              <div className="mt-xl">
              <label className="bg-gray-600 text-white  px-4 py-2 text-right  rounded-md ">Upload Supporting Documents</label>
  
              <div className="border-wrapper">
              <input
              type="file"
              id="supporting-docs"
              multiple
              onChange={handleFileChange}
               className="mt-2 rounded-xl"
              />
             </div>
              </div>
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={handleStep3Back}
                  className="bg-gray-600 text-white px-6 py-2 rounded-xl transition"
                >
                  BACK
                </button>
                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-xl transition">
                  SUBMIT
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};
export default Page;