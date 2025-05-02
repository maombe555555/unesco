"use client";
import React, { useState } from "react";
export default function NotifyApplicantsPage() {
  const [applicant, setApplicant] = useState("");
  const [marks, setMarks] = useState("");
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleNotify = () => {
    if (!applicant || !marks || !deadline) return;

    // Simulate sending email
    console.log("Sending email to:", applicant);
    console.log("Marks:", marks);
    console.log("Deadline:", deadline);
    setIsSent(true);
  };

  return (
    <div>
      <h2>Notify Applicant</h2>

      <div>
        <label>Applicant Email</label>
        <input
          type="email"
          placeholder="applicant@example.com"
          value={applicant}
          onChange={(e) => setApplicant(e.target.value)}
        />
      </div>

      <div>
        <label>Project Marks</label>
        <input
          placeholder="Enter marks"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
        />
      </div>

      <div>
        <label>Deadline</label>
        <input
          type="date"
          onChange={(e) => setDeadline(new Date(e.target.value))}
        />
        {deadline && <p>Selected: {deadline.toDateString()}</p>}
      </div>

      <div>
        <label>Optional Message</label>
        <textarea
          placeholder="Any additional info..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <button onClick={handleNotify}>Send Notification</button>

      {isSent && <p>Email sent successfully!</p>}
    </div>
  );
}
