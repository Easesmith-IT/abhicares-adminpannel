import React, { useState } from "react";

import styles from "./Faq.module.css";

const Faq = () => {
  const FAQS = [
    {
      id: 0,
      ques: "What are the benefits of Plus membership",
      answer: "This is the answer for this question.",
      display: false,
    },
    {
      id: 1,
      ques: "How does 100% money back guarantee work ?",
      answer: "This is the answer for this question.",
      display: false,
    },
    {
      id: 2,
      ques: "Who is UC Plus professinal ?",
      answer: "This is the answer for this question.",
      display: false,
    },
    {
      id: 3,
      ques: "Can I pay memebership through cash ?",
      answer: "This is the answer for this question.",
      display: false,
    },
    {
      id: 4,
      ques: "Can I cancel my memberhship after buying it ?",
      answer: "This is the answer for this question.",
      display: false,
    },
  ];

  const [faqStates, setFaqStates] = useState(FAQS);

  const faqDropdownHandler = (id) => {
    setFaqStates((prev) => {
      const newFaqs = prev.map((faq) =>
        faq.id === id ? { ...faq, display: !faq.display } : faq
      );

      return newFaqs;
    });
  };
  return (
    <ul className={styles.FAQcontainer}>
      <h2>FAQS</h2>
      {faqStates.map((faq) => {
        return (
          <li key={faq.id}>
            <span
              style={{ display: "block" }}
              onClick={() => faqDropdownHandler(faq.id)}
            >
              {faq.ques}
            </span>

            {faq.display && <span>{faq.answer}</span>}
          </li>
        );
      })}
    </ul>
  );
};

export default Faq;
